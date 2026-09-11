import React, { useState, useEffect } from 'react';
import { 
  Network, Server, Cpu, Database, Activity, ShieldCheck, 
  Brain, CheckCircle2, ArrowRight, Zap, Play, Pause, Radio, RefreshCw
} from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';

interface PipelineStage {
  id: string;
  name: string;
  category: string;
  details: string;
  tech: string;
  latency: string;
  status: 'active' | 'processing' | 'idle';
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'st-1', name: 'TEST ENVIRONMENT', category: 'ORIGIN', details: 'Sandboxed virtual enterprise network generating live baseline and test adversary traffic', tech: 'VLAN / TAP', latency: '0.0ms', status: 'active' },
  { id: 'st-2', name: 'DEMO WEB APP', category: 'TRAFFIC', details: 'Production-like Nginx web application hosting authenticated login and API endpoints', tech: 'Web Cluster', latency: '0.2ms', status: 'active' },
  { id: 'st-3', name: 'ZEEK PASSIVE SENSOR', category: 'INGESTION', details: 'Passive TAP/SPAN sensor extracting flow tuples into conn.log, http.log, dns.log, and ssl.log', tech: 'Zeek 6.x / C++', latency: '0.8ms', status: 'active' },
  { id: 'st-4', name: 'ZEEK LOG COLLECTOR', category: 'COLLECTION', details: 'Offset-following async file reader reading appended lines without blocking or re-reading', tech: 'Python AsyncIO', latency: '0.4ms', status: 'active' },
  { id: 'st-5', name: 'EVENT PROCESSOR', category: 'DISPATCH', details: 'Central pipeline coordinator normalizing records and dispatching to detection engines', tech: 'FastAPI / Pydantic', latency: '0.3ms', status: 'active' },
  { id: 'st-6', name: 'FEATURE ENGINE', category: 'EXTRACTION', details: 'Extracts connection frequencies, byte volumes, URI regex tokens, and entropy measures', tech: 'NumPy / Scikit-learn', latency: '1.2ms', status: 'active' },
  { id: 'st-7', name: 'DETECTION ENGINES', category: 'DETECTION', details: 'Parallel heuristic rules, statistical Poisson Z-score anomalies, and baseline profiles', tech: 'Rule + Stats + Baseline', latency: '1.5ms', status: 'active' },
  { id: 'st-8', name: 'SIGNAL FUSION', category: 'VERDICT', details: 'Fuses multi-engine signals into unified confidence rating (0-100) and severity classification', tech: 'Weighted Ensemble', latency: '0.5ms', status: 'active' },
  { id: 'st-9', name: 'CORRELATION ENGINE', category: 'SYNTHESIS', details: 'Correlates related events across temporal windows and assets into unified Incident THR-1042', tech: 'Graph Clustering', latency: '1.8ms', status: 'active' },
  { id: 'st-10', name: 'ATTACK STORY + GRAPH', category: 'MAPPING', details: 'Constructs 7-step MITRE ATT&CK story and dynamic 9-node interactive topology graph', tech: 'Kill-Chain Matrix', latency: '1.0ms', status: 'active' },
  { id: 'st-11', name: 'RISK ENGINE (0-100)', category: 'SCORING', details: 'Evaluates 6 weighted factors: Criticality, Severity, Confidence, Exploit, Blast, Exposure', tech: 'Multi-Factor Model', latency: '0.4ms', status: 'active' },
  { id: 'st-12', name: 'AI INVESTIGATOR', category: 'REASONING', details: 'ThreatWave SecOps AI Copilot generates root cause, blast radius, and containment playbooks', tech: 'SecOps AI Copilot', latency: '8.5ms', status: 'active' },
  { id: 'st-13', name: 'HUMAN APPROVAL', category: 'GOVERNANCE', details: 'Analyst-in-the-Loop SOAR authorization—no automated destructive actions without approval', tech: 'SOAR Policy Gate', latency: 'Analyst Action', status: 'active' },
  { id: 'st-14', name: 'CONTAINMENT RESPONSE', category: 'ENFORCEMENT', details: 'Enforces firewall drop on attacker IP and isolates affected assets with immutable audit log', tech: 'VyOS / iptables', latency: '15ms', status: 'active' },
  { id: 'st-15', name: 'POSTGRESQL / SUPABASE', category: 'STORAGE', details: 'ACID-compliant storage of 14 security tables with Alembic schema migrations', tech: 'SQLAlchemy 2.x', latency: '1.1ms', status: 'active' },
  { id: 'st-16', name: 'REALTIME WEBSOCKET', category: 'STREAMING', details: 'High-throughput async event bus broadcasting live alerts and telemetry updates', tech: 'WS /ws Protocol', latency: '0.2ms', status: 'active' },
  { id: 'st-17', name: 'THREATWAVE FRONTEND', category: 'COMMAND UI', details: 'Real-time cybersecurity command center with live graphs, AI copilot, and investigation tables', tech: 'React / Vite / Tailwind', latency: 'Render 60fps', status: 'active' }
];

export const SystemFlow: React.FC = () => {
  const { stats, latestEvent } = useRealtime();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Pulse cycle through the pipeline
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex(prev => (prev + 1) % PIPELINE_STAGES.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // When a real event arrives, bump pulse to detection
  useEffect(() => {
    if (latestEvent) {
      setActiveStepIndex(6); // Jump to detection engines
    }
  }, [latestEvent]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Top Banner */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              END-TO-END TELEMETRY ARCHITECTURE
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">17-STAGE PIPELINE</span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">SIH DEMO MODE READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            ThreatWave Platform Data Flow & Pipeline
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5 max-w-3xl">
            Live animated visualization tracking network packets from passive TAP sensors through multi-engine detection, AI correlation, and analyst containment.
          </p>
        </div>

        {/* Controls & Pulse Rate */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Pulse' : 'Resume Pulse'}</span>
          </button>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
            <div className="text-cyan-400 font-black text-base">{stats.eventsPerSec} EPS</div>
            <div className="text-[10px] text-slate-400 uppercase">Live Ingestion</div>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Stages Ribbon & Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-xs">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isPulseActive = activeStepIndex === idx;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isPulseActive
                    ? 'bg-[#0e2145] border-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.3)] scale-[1.02]'
                    : 'bg-[#080d1a] border-[#1e3a66]/70 hover:border-cyan-500/50 hover:bg-[#0b1426]'
                }`}
              >
                {isPulseActive && (
                  <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-400/15 rounded-full blur-xl pointer-events-none animate-pulse" />
                )}

                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-2">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase border ${
                    isPulseActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    STAGE {String(idx + 1).padStart(2, '0')} • {stage.category}
                  </span>
                  <span className="text-emerald-400 font-bold">{stage.latency}</span>
                </div>

                <h3 className="font-bold text-white text-sm tracking-tight font-sans mb-1.5 flex items-center gap-1.5">
                  {stage.name}
                  {isPulseActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed font-sans mb-3 line-clamp-2">
                  {stage.details}
                </p>

                <div className="pt-2 border-t border-[#1e3a66]/50 flex items-center justify-between text-[10px] text-slate-500">
                  <span>ENGINE: <strong className="text-slate-300">{stage.tech}</strong></span>
                  <span className="text-cyan-400">READY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep Stage Spotlight Box */}
      <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-500/40 shadow-xl font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e3a66]">
          <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ACTIVE TELEMETRY FOCUS: STAGE {String(activeStepIndex + 1).padStart(2, '0')} — {PIPELINE_STAGES[activeStepIndex].name}</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            INSPECTING FLOW
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {PIPELINE_STAGES[activeStepIndex].name}
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              {PIPELINE_STAGES[activeStepIndex].details}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase">CATEGORY: </span>
                <span className="text-cyan-400 font-bold">{PIPELINE_STAGES[activeStepIndex].category}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase">CORE TECHNOLOGY: </span>
                <span className="text-white font-bold">{PIPELINE_STAGES[activeStepIndex].tech}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase">PROCESSING TIME: </span>
                <span className="text-emerald-400 font-bold">{PIPELINE_STAGES[activeStepIndex].latency}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-slate-500 uppercase">LIVE SENSOR TELEMETRY METRICS</div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Events Processed:</span>
              <span className="text-white font-bold">{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Events Per Second:</span>
              <span className="text-emerald-400 font-bold">{stats.eventsPerSec}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Packets Per Second:</span>
              <span className="text-cyan-400 font-bold">{stats.packetsPerSec}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="text-rose-400 font-bold">{stats.riskScore} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemFlow;
