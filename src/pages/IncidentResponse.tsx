import React, { useState } from 'react';
import { 
  Zap, ShieldAlert, CheckCircle2, Ban, Lock, FileWarning, Check, X, 
  ArrowRight, Brain, AlertTriangle, Eye, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { Incident } from '../types';
import { ActionApprovalModal } from '../components/security/ActionApprovalModal';
import { incidentService } from '../services/incidentService';

const LIFECYCLE_STEPS = [
  'DETECTED',
  'INVESTIGATING',
  'CONTAINED',
  'REMEDIATING',
  'RESOLVED'
] as const;

interface AuditLogEntry {
  id: string;
  incidentId: string;
  action: string;
  target: string;
  analyst: string;
  timestamp: string;
  status: 'EXECUTED' | 'REJECTED';
  reason: string;
}

export const IncidentResponse: React.FC = () => {
  const { state, executeResponseAction } = useDemoEngine();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(state.incidents[0] || null);
  const [approvalModalAction, setApprovalModalAction] = useState<{
    title: string;
    target: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    reason: string;
    actionType: string;
  } | null>(null);

  const [incidentStatusMap, setIncidentStatusMap] = useState<Record<string, string>>({
    'INC-2048': 'INVESTIGATING',
    'INC-2047': 'CONTAINED',
    'THR-1042': 'INVESTIGATING'
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'aud-001',
      incidentId: 'INC-2047',
      action: 'Firewall Null-Route Adversary',
      target: '185.220.101.5/32',
      analyst: 'SecOps Tier-2 Lead',
      timestamp: '09:55:12 UTC',
      status: 'EXECUTED',
      reason: 'Adversary port sweep and SQL injection verified across Zeek conn.log.'
    },
    {
      id: 'aud-002',
      incidentId: 'INC-2048',
      action: 'VLAN Quarantine Web Host',
      target: 'SRV-PROD-WEB01 (192.168.1.50)',
      analyst: 'SecOps Incident Commander',
      timestamp: '10:02:40 UTC',
      status: 'EXECUTED',
      reason: 'Prevent lateral Postgres penetration toward internal database cluster.'
    }
  ]);

  const activeStatus = selectedIncident 
    ? (incidentStatusMap[selectedIncident.id] || selectedIncident.status) 
    : 'INVESTIGATING';

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedIncident) return;
    setIncidentStatusMap(prev => ({
      ...prev,
      [selectedIncident.id]: newStatus
    }));
  };

  const handleApproveAction = async () => {
    if (!approvalModalAction || !selectedIncident) return;
    try {
      await incidentService.approveResponseAction(
        selectedIncident.id,
        approvalModalAction.actionType,
        approvalModalAction.target,
        approvalModalAction.reason
      );
    } catch (e) {
      console.warn('Backend approval dispatch fallback:', e);
    }
    executeResponseAction(approvalModalAction.actionType, approvalModalAction.target);
    handleUpdateStatus('CONTAINED');
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        incidentId: selectedIncident.id,
        action: approvalModalAction.title,
        target: approvalModalAction.target,
        analyst: 'SecOps Analyst (Tier-2)',
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        status: 'EXECUTED',
        reason: approvalModalAction.reason
      },
      ...prev
    ]);
    setApprovalModalAction(null);
  };

  const handleRejectAction = () => {
    if (!selectedIncident) return;
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        incidentId: selectedIncident.id,
        action: 'Recommended Containment Rejected',
        target: selectedIncident.targetAsset,
        analyst: 'SecOps Analyst (Tier-2)',
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        status: 'REJECTED',
        reason: 'Analyst declined automated action pending secondary manual forensics.'
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              SOAR RESPONSE & PLAYBOOK ORCHESTRATION
            </span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{state.metrics.activeIncidents} ACTIVE INCIDENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Incident Response & Mitigation Command
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Analyst-in-the-loop containment execution, MITRE ATT&CK mitigation playbooks, and SOAR response tracking.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-emerald-400 font-extrabold text-sm">ANALYST APPROVAL ENFORCED</div>
          <div className="text-[10px] text-slate-400">Zero Autonomous Destructive Actions</div>
        </div>
      </div>

      {/* Main Incident Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left Column: Active SOC Incident Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#1e3a66] pb-2">
            <span className="font-bold text-white uppercase">Active SOC Incident Queue</span>
            <span>{state.incidents.length} Tickets</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {state.incidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCrit = inc.severity === 'CRITICAL';
              const currentStatus = incidentStatusMap[inc.id] || inc.status;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_16px_rgba(0,242,254,0.2)]'
                      : 'bg-[#091224] border-[#1e3a66]/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-cyan-300 text-sm">{inc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isCrit ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs">{inc.title}</div>
                  <div className="text-[11px] text-slate-400 font-sans truncate">{inc.description}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>Target: <strong className="text-slate-300">{inc.targetAsset}</strong></span>
                    <span className={`font-bold ${
                      currentStatus === 'RESOLVED' 
                        ? 'text-emerald-400' 
                        : currentStatus === 'CONTAINED' 
                        ? 'text-cyan-400' 
                        : 'text-rose-400'
                    }`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Incident Lifecycle & AI Playbook Recommendation */}
        <div className="lg:col-span-7">
          {selectedIncident && (
            <div className="p-6 rounded-2xl bg-[#091224] border border-[#1e3a66] space-y-5 shadow-2xl">
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e3a66] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-cyan-400 text-lg">{selectedIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeStatus === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : activeStatus === 'CONTAINED'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    }`}>
                      {activeStatus}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-white font-sans">{selectedIncident.title}</h2>
                </div>

                <div className="text-slate-400 text-[10px] text-right">
                  <div>Assigned: <strong className="text-cyan-300">{selectedIncident.assignedTo}</strong></div>
                  <div>Logged: {new Date(selectedIncident.createdAt).toLocaleTimeString()} UTC</div>
                </div>
              </div>

              {/* 1. PIPELINE STATUS PROGRESSION STEPPER */}
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  INCIDENT RESPONSE LIFECYCLE FLOW
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {LIFECYCLE_STEPS.map((step, idx) => {
                    const stepIdx = LIFECYCLE_STEPS.indexOf(step);
                    const currentIdx = LIFECYCLE_STEPS.indexOf(activeStatus as any);
                    const isPassed = stepIdx <= currentIdx;
                    const isCurrent = step === activeStatus;

                    return (
                      <button
                        key={step}
                        onClick={() => handleUpdateStatus(step)}
                        className={`p-2 rounded-lg border font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                            : isPassed
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-900 text-slate-600'
                        }`}
                      >
                        <div className="text-[8px] opacity-70">STEP {idx + 1}</div>
                        <div className="truncate">{step}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. AI RECOMMENDATION CARD */}
              <div className="p-4 rounded-xl bg-[#060c18] border border-cyan-400/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="font-extrabold text-white uppercase text-xs">
                      THREATWAVE AI RECOMMENDATION
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px]">
                    PRIORITY: CRITICAL
                  </span>
                </div>

                <div className="text-sm font-extrabold text-cyan-300 font-sans">
                  Contain affected web server ({selectedIncident.targetAsset}).
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-sans text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 font-mono text-[10px] block mb-0.5">REASON:</strong>
                  Multiple correlated high-confidence events detected. Tainted SQL queries accompanied by anomalous outbound egress volume (+1,400%).
                </div>

                {/* Response Approval Buttons */}
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                  <button
                    onClick={() => setApprovalModalAction({
                      title: `Contain Host (${selectedIncident.targetAsset})`,
                      target: selectedIncident.targetAsset,
                      priority: 'CRITICAL',
                      reason: 'Adversary SQL injection and bulk data exfiltration verified by ThreatWave AI.',
                      actionType: 'ISOLATE_ASSET'
                    })}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer text-center"
                  >
                    [ REVIEW ]
                  </button>

                  <button
                    onClick={() => setApprovalModalAction({
                      title: `Contain Host (${selectedIncident.targetAsset}) & Null-Route ${selectedIncident.sourceIp}`,
                      target: `${selectedIncident.targetAsset} / ${selectedIncident.sourceIp}`,
                      priority: 'CRITICAL',
                      reason: 'Authorized immediate containment to halt ongoing data exfiltration stream.',
                      actionType: 'ISOLATE_ASSET'
                    })}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black shadow-lg shadow-rose-600/30 transition-all cursor-pointer text-center"
                  >
                    [ APPROVE ACTION ]
                  </button>

                  <button
                    onClick={handleRejectAction}
                    className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    [ REJECT ]
                  </button>
                </div>
              </div>

              {/* Threat Context Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 block text-[10px]">Adversary Origin:</span>
                  <span className="text-rose-400 font-bold truncate block">{selectedIncident.sourceIp}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 block text-[10px]">Affected Target Asset:</span>
                  <span className="text-cyan-300 font-bold truncate block">{selectedIncident.targetAsset}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. SOAR CONTAINMENT & ANALYST AUTHORIZATION AUDIT TRAIL */}
      <div className="p-5 rounded-2xl bg-[#080d1a] border border-[#1e3a66] space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-extrabold text-xs uppercase tracking-wider">
              ANALYST AUTHORIZATION & SOAR CONTAINMENT AUDIT TRAIL
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Immutable SOC Log • Compliance Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800/80 bg-slate-950/60">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Incident</th>
                <th className="py-2.5 px-3">Action Enacted</th>
                <th className="py-2.5 px-3">Target Scope</th>
                <th className="py-2.5 px-3">Authorized By</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Justification Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-300 whitespace-nowrap">{log.incidentId}</td>
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">{log.action}</td>
                  <td className="py-2.5 px-3 text-amber-300 whitespace-nowrap">{log.target}</td>
                  <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{log.analyst}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                      log.status === 'EXECUTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] max-w-xs truncate font-sans">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyst Action Approval Modal */}
      {approvalModalAction && (
        <ActionApprovalModal
          action={approvalModalAction}
          onApprove={handleApproveAction}
          onReject={() => setApprovalModalAction(null)}
          onClose={() => setApprovalModalAction(null)}
        />
      )}
    </div>
  );
};

export default IncidentResponse;
