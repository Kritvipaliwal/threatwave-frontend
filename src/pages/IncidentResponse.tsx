import React, { useState } from 'react';
import { Zap, ShieldAlert, CheckCircle2, Ban, Lock, FileWarning, Check, X } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { Incident } from '../types';

export const IncidentResponse: React.FC = () => {
  const { state, executeResponseAction } = useDemoEngine();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(state.incidents[0] || null);
  const [actionModal, setActionModal] = useState<{ action: string; target: string } | null>(null);

  const confirmAction = () => {
    if (!actionModal) return;
    executeResponseAction(actionModal.action, actionModal.target);
    setActionModal(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> SOAR AUTOMATION PLAYBOOKS
            </span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{state.metrics.activeIncidents} ACTIVE INCIDENTS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Incident Response Command Center
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time security incident triage, MITRE ATT&CK mitigation playbooks, and one-click automated containment execution.
          </p>
        </div>
      </div>

      {/* Incident Command Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Incident Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 border-b border-[#1e3a66] pb-2">
            <span className="font-bold text-white uppercase">Active SOC Queue</span>
            <span>{state.incidents.length} Tickets</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {state.incidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCrit = inc.severity === 'CRITICAL';
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_16px_rgba(0,242,254,0.15)]'
                      : 'bg-[#0c1527] border-[#1e3a66]/70 hover:border-slate-700'
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
                    <span className={`font-bold ${inc.status === 'RESOLVED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Detail & SOAR Actions */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e3a66] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-cyan-400 text-lg">{selectedIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedIncident.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    }`}>
                      {selectedIncident.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedIncident.title}</h2>
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  <div>Assigned: <strong className="text-slate-300">{selectedIncident.assignedTo}</strong></div>
                  <div>Opened: 20:54 UTC</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block font-bold">EXECUTIVE SUMMARY</span>
                <p className="text-slate-200 text-xs font-sans leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">ADVERSARY SOURCE</span>
                  <span className="text-rose-400 font-bold text-sm">{selectedIncident.sourceIp}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TARGET ASSET</span>
                  <span className="text-cyan-300 font-bold text-sm">{selectedIncident.targetAsset}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-400/30 text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block text-[11px]">RECOMMENDED SOAR PLAYBOOK:</span>
                <p className="text-xs font-sans text-slate-200">{selectedIncident.recommendedAction}</p>
              </div>

              {/* SOAR Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#1e3a66]">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">ONE-CLICK MITIGATION ACTIONS</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setActionModal({ action: 'BLOCK_IP', target: selectedIncident.sourceIp })}
                    className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold hover:bg-rose-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" /> [BLOCK IP: {selectedIncident.sourceIp}]
                  </button>
                  <button
                    onClick={() => setActionModal({ action: 'ISOLATE_ASSET', target: selectedIncident.targetAsset })}
                    className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> [ISOLATE ASSET]
                  </button>
                  <button
                    onClick={() => setActionModal({ action: 'DISABLE_ACCOUNT', target: 'root / compromised_svc' })}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FileWarning className="w-4 h-4" /> [DISABLE ACCOUNT]
                  </button>
                  <button
                    onClick={() => setActionModal({ action: 'RESOLVE_INCIDENT', target: selectedIncident.id })}
                    className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> [RESOLVE INCIDENT]
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#0c1527] border border-[#1e3a66] text-center text-slate-500">
              Select an incident from the queue to review forensics and execute response playbooks.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full p-5 rounded-2xl bg-[#0c1527] border border-cyan-400/50 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>CONFIRM SOAR ACTION EXECUTION</span>
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Confirm execution of action <strong className="text-cyan-300 font-mono">{actionModal.action}</strong> on target <strong className="text-rose-400 font-mono">{actionModal.target}</strong>? This action updates firewall routing and recovers the security posture score.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Execute SOAR Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
