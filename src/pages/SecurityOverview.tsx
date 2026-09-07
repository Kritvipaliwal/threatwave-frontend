import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, Activity, Skull, Zap, Lock, Brain, Server, Bug, Award,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { StatCard } from '../components/common/StatCard';
import { ThreatRadar } from '../components/common/ThreatRadar';
import { AttackMap } from '../components/common/AttackMap';
import { ThreatWaveChart } from '../components/common/ThreatWaveChart';
import { AttackChainGraph } from '../components/common/AttackChainGraph';
import { EventStream } from '../components/common/EventStream';
import { ActivePage } from '../types';

interface SecurityOverviewProps {
  onNavigate: (page: ActivePage) => void;
}

export const SecurityOverview: React.FC<SecurityOverviewProps> = ({ onNavigate }) => {
  const { state, executeResponseAction, simulateAttack } = useDemoEngine();
  const [actionConfirmTarget, setActionConfirmTarget] = useState<string | null>(null);

  const handleAction = (action: string, target: string) => {
    executeResponseAction(action, target);
    setActionConfirmTarget(null);
  };

  const handleStartDemo = () => {
    if (state.activeSimulation.isSimulating) return;
    simulateAttack('FULL_ATTACK_STORY');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. HERO COMMAND CENTER HEADER */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#0c1527] via-[#0f1d38] to-[#080d1a] border border-[#1e3a66] shadow-2xl overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> THREATWAVE
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM ONLINE
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-cyan-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> AI ENGINE ACTIVE
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-rose-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" /> THREAT MONITORING LIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            AI Cyber Defense Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed mb-3">
            Autonomous multi-vector SOC correlating real-time packet telemetry, dark-web IOC feeds, and MITRE ATT&CK mitigation playbooks.
          </p>

          {/* Quick Trigger Live Demo Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDemo}
              disabled={state.activeSimulation.isSimulating}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{state.activeSimulation.isSimulating ? 'SIMULATION IN PROGRESS...' : 'START LIVE DEMO (FULL ATTACK STORY)'}</span>
            </button>
            <button
              onClick={() => onNavigate('attack-simulator')}
              className="px-3.5 py-2 rounded-lg bg-slate-900/80 border border-[#1e3a66] text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
            >
              Configure Simulator →
            </button>
          </div>
        </div>

        {/* Central Security Posture Score Gauge */}
        <div className="relative z-10 flex items-center gap-5 p-4 rounded-xl bg-[#050811]/90 border border-cyan-400/30 shadow-[0_0_24px_rgba(0,242,254,0.15)] shrink-0">
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                {state.metrics.securityScore}
              </span>
              <span className="text-sm font-mono text-slate-500 ml-1">/100</span>
            </div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mt-1">
              SECURITY SCORE
            </div>
          </div>
          <div className="border-l border-[#1e3a66] pl-4 font-mono text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE 24/7 MONITORING</span>
            </div>
            <div className="text-[11px] text-slate-400">Posture: <span className="text-emerald-400 font-bold">RESILIENT</span></div>
            <div className="text-[11px] text-slate-400">Active Nodes: <span className="text-cyan-400 font-bold">{state.assets.length} Assets</span></div>
            <button
              onClick={() => onNavigate('security-posture')}
              className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              Audit Posture <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 8 LIVE THREAT COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL THREATS"
          value={state.metrics.totalThreats}
          subtitle="Ingested in real-time telemetry"
          icon={Activity}
          accentColor="cyan"
          onClick={() => onNavigate('live-detection')}
        />
        <StatCard
          label="CRITICAL THREATS"
          value={state.metrics.criticalThreats}
          subtitle="Immediate triage required"
          icon={Skull}
          accentColor="crimson"
          onClick={() => onNavigate('live-detection')}
        />
        <StatCard
          label="ACTIVE INCIDENTS"
          value={state.metrics.activeIncidents}
          subtitle="Open SOC triage queue"
          icon={Zap}
          accentColor="amber"
          onClick={() => onNavigate('incident-response')}
        />
        <StatCard
          label="BLOCKED IPS"
          value={state.metrics.blockedIps}
          subtitle="Automated SOAR drops active"
          icon={Lock}
          accentColor="emerald"
          onClick={() => onNavigate('threat-intelligence')}
        />
        <StatCard
          label="AI DETECTIONS"
          value={state.metrics.aiDetections}
          subtitle="Confidence > 90% verified"
          icon={Brain}
          accentColor="purple"
          onClick={() => onNavigate('ai-assistant')}
        />
        <StatCard
          label="ASSETS MONITORED"
          value={state.metrics.assetsMonitored}
          subtitle="100% agent telemetry healthy"
          icon={Server}
          accentColor="cyan"
          onClick={() => onNavigate('assets')}
        />
        <StatCard
          label="VULNERABILITIES"
          value={state.metrics.vulnerabilities}
          subtitle="Tracked in CVE inventory"
          icon={Bug}
          accentColor="amber"
          onClick={() => onNavigate('vulnerabilities')}
        />
        <StatCard
          label="SECURITY SCORE"
          value={state.metrics.securityScore}
          suffix="%"
          subtitle="CIS enterprise benchmark"
          icon={Award}
          accentColor="emerald"
          onClick={() => onNavigate('security-posture')}
        />
      </div>

      {/* 3. LIVE THREAT WAVE & 4. LIVE THREAT RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>LIVE THREAT WAVE — NETWORK ACTIVITY & ATTACK INTENSITY</span>
            </div>
            <span className="text-slate-400 text-[11px]">ROLLING TIME WINDOW</span>
          </div>
          <ThreatWaveChart />
        </div>

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
            onSelectBlip={b => alert(`Threat Radar Target: ${b.name}\nAdversary IP: ${b.ip}\nSeverity: ${b.severity}`)}
          />
        </div>
      </div>

      {/* 5. GLOBAL CYBER ATTACK MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>GLOBAL CYBER ATTACK MAP — INGRESS ARCS & ACTIVE TRAJECTORIES</span>
          </div>
          <span className="text-[11px] text-amber-400 font-bold">SYNTHETIC SOC FEEDS</span>
        </div>
        <AttackMap arcs={state.attackArcs} />
      </div>

      {/* 8. ATTACK CHAIN VISUALIZATION */}
      <AttackChainGraph nodes={state.attackChainNodes} />

      {/* 6. LIVE EVENT STREAM + 7. AI INTELLIGENCE + 11. INCIDENT COMMAND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Stream */}
        <div className="lg:col-span-7">
          <EventStream events={state.events} maxHeight="400px" />
        </div>

        {/* Right Column: AI Panel + Active Incident */}
        <div className="lg:col-span-5 space-y-4">
          {/* 7. AI Intelligence Panel */}
          <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/70 shadow-lg space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span>THREATWAVE AI INTELLIGENCE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-400/30 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>CORRELATION SYNTHESIS:</span>
                <span className="text-cyan-300 font-bold">CONFIDENCE {state.aiInsight.confidence}%</span>
              </div>
              <p className="text-slate-200 text-xs font-sans leading-relaxed">
                {state.aiInsight.text}
              </p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                <span>Deep learning IOC models correlating 6 threat vectors.</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ai-assistant')}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all"
            >
              Launch SOC AI Analyst Copilot →
            </button>
          </div>

          {/* 11. Incident Command Center Spotlight */}
          {state.activeIncident && (
            <div className="p-4 rounded-xl bg-[#0c1527] border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)] font-mono text-xs space-y-3">
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
                <div className="font-bold text-white text-sm">{state.activeIncident.title}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Target: <span className="text-cyan-300">{state.activeIncident.targetAsset}</span> • Source: <span className="text-rose-400">{state.activeIncident.sourceIp}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono">Recommended Playbook:</strong> {state.activeIncident.recommendedAction}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setActionConfirmTarget('BLOCK_IP')}
                  className="py-1.5 px-2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold hover:bg-rose-500/30 transition-colors text-[11px]"
                >
                  [BLOCK IP]
                </button>
                <button
                  onClick={() => setActionConfirmTarget('ISOLATE_ASSET')}
                  className="py-1.5 px-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition-colors text-[11px]"
                >
                  [ISOLATE ASSET]
                </button>
                <button
                  onClick={() => onNavigate('threat-graph')}
                  className="py-1.5 px-2 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  [VIEW GRAPH]
                </button>
                <button
                  onClick={() => onNavigate('incident-response')}
                  className="py-1.5 px-2 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  [INVESTIGATE]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full p-5 rounded-2xl bg-[#0c1527] border border-cyan-400/50 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>CONFIRM SOAR AUTOMATION PLAYBOOK</span>
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Are you sure you want to execute <strong className="text-cyan-300 font-mono">{actionConfirmTarget}</strong> on adversary <strong className="text-rose-400 font-mono">185.220.101.5</strong>? This will drop firewall sessions and update the security posture score.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActionConfirmTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(actionConfirmTarget, '185.220.101.5')}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
              >
                Authorize Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
