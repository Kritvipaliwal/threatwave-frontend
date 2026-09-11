import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, Activity, Skull, Zap, Lock, Brain, Server, Bug, Award,
  CheckCircle2, ArrowRight, Sparkles, Network, ExternalLink, Cpu
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { useRealtime } from '../hooks/useRealtime';
import { StatCard } from '../components/common/StatCard';
import { ThreatRadar } from '../components/common/ThreatRadar';
import { AttackMap } from '../components/common/AttackMap';
import { EventStream } from '../components/common/EventStream';
import { SecurityPipelineVisual } from '../components/security/SecurityPipelineVisual';
import { LiveNetworkActivityChart } from '../components/charts/LiveNetworkActivityChart';
import { ThreatActivityChart } from '../components/charts/ThreatActivityChart';
import { RiskScoreGauge } from '../components/charts/RiskScoreGauge';
import { AttackStoryPanel } from '../components/attack/AttackStoryPanel';
import { EvidenceModal } from '../components/security/EvidenceModal';
import { RiskBreakdownModal } from '../components/security/RiskBreakdownModal';
import { ActionApprovalModal } from '../components/security/ActionApprovalModal';
import { ThreatProfile, CORE_THREAT_PROFILES } from '../data/demoData';
import { ActivePage, SecurityEvent } from '../types';

interface SecurityOverviewProps {
  onNavigate: (page: ActivePage) => void;
}

export const SecurityOverview: React.FC<SecurityOverviewProps> = ({ onNavigate }) => {
  const { state, executeResponseAction, simulateAttack } = useDemoEngine();
  const { stats } = useRealtime();

  // Modals state
  const [inspectedThreat, setInspectedThreat] = useState<ThreatProfile | null>(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false);
  const [approvalAction, setApprovalAction] = useState<{
    title: string;
    target: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    reason: string;
    actionType: string;
  } | null>(null);

  const handleStartDemo = () => {
    if (state.activeSimulation.isSimulating) return;
    simulateAttack('FULL_ATTACK_STORY');
  };

  const handleInspectEvent = (ev: SecurityEvent) => {
    // Find matching threat profile or generate one from event
    const matched = CORE_THREAT_PROFILES.find(t => 
      t.name.toLowerCase() === ev.attackType.toLowerCase() ||
      ev.description.toLowerCase().includes(t.name.toLowerCase())
    ) || {
      ...CORE_THREAT_PROFILES[0],
      name: ev.attackType,
      source: ev.sourceIp,
      target: ev.destinationIp,
      severity: ev.severity,
      confidence: Math.round(ev.confidence * 100)
    };
    setInspectedThreat(matched);
  };

  const triggerContainmentModal = (actionType: string, target: string, title: string) => {
    setApprovalAction({
      title,
      target,
      priority: 'CRITICAL',
      reason: 'Multiple correlated high-confidence signals flagged in attack story THR-1042.',
      actionType
    });
  };

  const handleApproveAction = () => {
    if (approvalAction) {
      executeResponseAction(approvalAction.actionType, approvalAction.target);
      setApprovalAction(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. TOP HERO COMMAND CENTER HEADER */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#070d1a] via-[#0b162c] to-[#060b16] border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Status Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.25)]">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> THREATWAVE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE ● SYSTEM ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Network Monitoring Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-300 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> AI Engine Active
            </span>
            <span className="text-slate-600">|</span>
            <span className={`${stats.sensorConnected ? 'text-emerald-400' : 'text-slate-400'} flex items-center gap-1.5 font-bold`}>
              <span className={`w-2 h-2 rounded-full ${stats.sensorConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'} inline-block`} />
              {stats.sensorConnected ? 'Sensor Connected' : 'Sensor Listening'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            AI-POWERED CYBER DEFENSE COMMAND CENTER
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 max-w-2xl font-sans">
            Autonomous multi-vector detection and real-time response orchestration. Correlating passive network metadata taps, Bayesian signal fusion, and MITRE ATT&CK story synthesis.
          </p>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartDemo}
              disabled={state.activeSimulation.isSimulating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 text-slate-950 font-black text-xs font-mono flex items-center gap-2 hover:shadow-[0_0_24px_rgba(0,242,254,0.5)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{state.activeSimulation.isSimulating ? 'SIMULATION IN PROGRESS...' : 'START LIVE DEMO (FULL ATTACK STORY)'}</span>
            </button>
            <button
              onClick={() => onNavigate('live-detection')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-[#1e3a66] text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Threat Workspace →</span>
            </button>
            <button
              onClick={() => onNavigate('threat-graph')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-[#1e3a66] text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attack Graph →</span>
            </button>
          </div>
        </div>

        {/* Header Right Mini Telemetry Widget */}
        <div className="relative z-10 flex items-center gap-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,242,254,0.15)] shrink-0 font-mono">
          <div className="text-center pr-3 border-r border-slate-800">
            <div className="text-3xl font-black text-cyan-300 tracking-tight">
              {stats.eventsPerSec}
            </div>
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
              EVENTS / SEC
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1 text-slate-200">
              <span className={`w-2 h-2 rounded-full ${stats.sensorConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="font-bold">PASSIVE SENSOR</span>
            </div>
            <div className="text-[10px] text-slate-400">Scapy / TAP: <span className="text-emerald-400 font-bold">{state.liveLabMode ? 'LIVE MIRROR' : 'SIMULATION'}</span></div>
            <div className="text-[10px] text-slate-400">Fused Conf: <span className="text-cyan-300 font-bold">{stats.fusedConfidence > 0 ? `${stats.fusedConfidence.toFixed(1)}%` : (state.liveLabMode ? '0.0%' : '96.8%')}</span></div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED SECURITY PIPELINE VISUALIZATION */}
      <SecurityPipelineVisual onSelectStage={() => onNavigate('live-detection')} />

      {/* 3. 7 REQUIRED KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard
          label="EVENTS / SEC"
          value={stats.eventsPerSec}
          subtitle="Passive mirror flow"
          icon={Activity}
          accentColor="cyan"
          onClick={() => onNavigate('live-detection')}
        />
        <StatCard
          label="ACTIVE THREATS"
          value={state.metrics.totalThreats}
          subtitle="Tri-engine verified"
          icon={Skull}
          accentColor="crimson"
          onClick={() => onNavigate('live-detection')}
        />
        <StatCard
          label="CRITICAL THREATS"
          value={state.metrics.criticalThreats}
          subtitle="Immediate triage"
          icon={ShieldAlert}
          accentColor="crimson"
          onClick={() => onNavigate('live-detection')}
        />
        <StatCard
          label="OPEN INCIDENTS"
          value={state.metrics.activeIncidents}
          subtitle="SOC triage queue"
          icon={Zap}
          accentColor="amber"
          onClick={() => onNavigate('incident-response')}
        />
        <StatCard
          label="PROTECTED ASSETS"
          value={state.assets.length}
          subtitle="100% telemetry online"
          icon={Server}
          accentColor="cyan"
          onClick={() => onNavigate('assets')}
        />
        <StatCard
          label="CURRENT RISK SCORE"
          value={state.metrics.securityScore}
          suffix="/100"
          subtitle="CIS enterprise index"
          icon={Award}
          accentColor="emerald"
          onClick={() => setIsRiskModalOpen(true)}
        />
        <StatCard
          label="DETECTION CONFIDENCE"
          value={97}
          suffix="%"
          subtitle="Signal fusion score"
          icon={Brain}
          accentColor="purple"
          onClick={() => onNavigate('ai-assistant')}
        />
      </div>

      {/* 4. LIVE NETWORK ACTIVITY GRAPH & RISK SCORE GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveNetworkActivityChart />
        </div>
        <div className="lg:col-span-4">
          <RiskScoreGauge 
            score={state.metrics.securityScore}
            onOpenBreakdown={() => setIsRiskModalOpen(true)}
          />
        </div>
      </div>

      {/* 5. THREAT ACTIVITY GRAPH (8 CATEGORIES OVER TIME) */}
      <ThreatActivityChart />

      {/* 6. MAJOR FEATURE: INTERACTIVE ATTACK STORY (THR-1042) */}
      <AttackStoryPanel
        onSelectStep={(step) => {
          const matching = CORE_THREAT_PROFILES.find(t => 
            t.name.toLowerCase().includes(step.title.toLowerCase()) ||
            step.title.toLowerCase().includes(t.name.toLowerCase())
          );
          if (matching) setInspectedThreat(matching);
        }}
        onNavigateToGraph={() => onNavigate('threat-graph')}
      />

      {/* 7. LIVE EVENT STREAM + RADAR + SOAR ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Security Events Column */}
        <div className="lg:col-span-7">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>LIVE SECURITY EVENTS — STREAM INGESTION</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">CLICK EVENT TO INSPECT EVIDENCE</span>
            </div>
            <div onClick={(e) => {
              // Clicking within stream will trigger evidence if target card
              const closest = (e.target as HTMLElement).closest('[data-event-id]');
              if (closest) {
                const id = closest.getAttribute('data-event-id');
                const ev = state.events.find(ev => ev.id === id);
                if (ev) handleInspectEvent(ev);
              }
            }}>
              <EventStream 
                events={state.events} 
                maxHeight="420px" 
              />
            </div>
          </div>
        </div>

        {/* Threat Radar + Command Spotlight */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>LIVE THREAT RADAR</span>
              </div>
              <span className="text-rose-400 text-[10px] font-bold">SWEEP ACTIVE</span>
            </div>
            <ThreatRadar
              blips={state.radarBlips}
              onSelectBlip={b => {
                const matched = CORE_THREAT_PROFILES.find(t => t.name.toLowerCase().includes(b.name.toLowerCase())) || CORE_THREAT_PROFILES[0];
                setInspectedThreat(matched);
              }}
            />
          </div>

          {/* Incident Command Spotlight */}
          {state.activeIncident && (
            <div className="p-4 rounded-xl bg-[#0c1527] border border-rose-500/40 shadow-xl font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Zap className="w-4 h-4 text-rose-400" />
                  <span>COMMAND SPOTLIGHT #{state.activeIncident.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  state.activeIncident.status === 'RESOLVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                }`}>
                  {state.activeIncident.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-white text-xs">{state.activeIncident.title}</div>
                <div className="text-slate-400 text-[11px] mt-0.5 font-sans">
                  Target: <span className="text-cyan-300 font-mono">{state.activeIncident.targetAsset}</span> • Adversary: <span className="text-rose-400 font-mono">{state.activeIncident.sourceIp}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono text-[10px] block mb-0.5">AI PLAYBOOK RECOMMENDATION:</strong>
                {state.activeIncident.recommendedAction}
              </div>

              {/* Action Buttons with Analyst Approval Trigger */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <button
                  onClick={() => triggerContainmentModal('BLOCK_IP', state.activeIncident!.sourceIp, 'Block Adversary IP via Perimeter Firewall')}
                  className="py-1.5 px-2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold hover:bg-rose-500/30 transition-colors cursor-pointer"
                >
                  [BLOCK IP]
                </button>
                <button
                  onClick={() => triggerContainmentModal('ISOLATE_ASSET', state.activeIncident!.targetAsset, 'Isolate Compromised Host from Subnet')}
                  className="py-1.5 px-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  [ISOLATE HOST]
                </button>
                <button
                  onClick={() => onNavigate('threat-graph')}
                  className="py-1.5 px-2 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  [VIEW GRAPH]
                </button>
                <button
                  onClick={() => onNavigate('incident-response')}
                  className="py-1.5 px-2 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  [INVESTIGATE]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. GLOBAL CYBER ATTACK MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>GLOBAL CYBER ATTACK MAP — INGRESS ARCS & ACTIVE TRAJECTORIES</span>
          </div>
          <span className="text-[11px] text-amber-400 font-bold">SYNTHETIC SOC TELEMETRY FEEDS</span>
        </div>
        <AttackMap arcs={state.attackArcs} />
      </div>

      {/* MODALS */}
      {/* Evidence Inspection Modal */}
      <EvidenceModal
        threat={inspectedThreat}
        onClose={() => setInspectedThreat(null)}
        onActionContain={(thr) => {
          setInspectedThreat(null);
          triggerContainmentModal('CONTAIN_HOST', thr.target, `Contain Target Host (${thr.target})`);
        }}
      />

      {/* Risk Breakdown Modal */}
      {isRiskModalOpen && (
        <RiskBreakdownModal
          score={state.metrics.securityScore}
          onClose={() => setIsRiskModalOpen(false)}
        />
      )}

      {/* Analyst Action Approval Modal */}
      {approvalAction && (
        <ActionApprovalModal
          action={approvalAction}
          onApprove={handleApproveAction}
          onReject={() => setApprovalAction(null)}
          onClose={() => setApprovalAction(null)}
        />
      )}
    </div>
  );
};

export default SecurityOverview;
