import React, { useState } from 'react';
import { 
  GitCommit, ShieldAlert, CheckCircle2, ChevronRight, Clock, AlertTriangle, 
  Eye, Terminal, Sparkles, ArrowRight, Brain
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { AttackStoryPanel } from '../components/attack/AttackStoryPanel';
import { EvidenceModal } from '../components/security/EvidenceModal';
import { CORE_THREAT_PROFILES, ThreatProfile } from '../data/demoData';

export const AttackTimeline: React.FC = () => {
  const { state } = useDemoEngine();
  const [inspectedThreat, setInspectedThreat] = useState<ThreatProfile | null>(null);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              CHRONOLOGICAL ATTACK STORY
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">END-TO-END CORRELATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Attack Timeline & Kill Chain Sequence
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time step-by-step reconstruction of adversary intrusion vectors, dwell times, and forensic evidence.
          </p>
        </div>
      </div>

      {/* Embedded Attack Story Panel (THR-1042) */}
      <AttackStoryPanel
        onSelectStep={(step) => {
          const matched = CORE_THREAT_PROFILES.find(t => 
            t.name.toLowerCase().includes(step.title.toLowerCase()) ||
            step.title.toLowerCase().includes(t.name.toLowerCase())
          ) || CORE_THREAT_PROFILES[1];
          setInspectedThreat(matched);
        }}
      />

      {/* MITRE ATT&CK Matrix Mapping Grid */}
      <div className="p-5 rounded-2xl bg-[#091224] border border-[#1e3a66] font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-extrabold text-white uppercase text-xs flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <span>MITRE ATT&CK Enterprise Matrix Mapping</span>
          </span>
          <span className="text-[10px] text-cyan-300">v14 Enterprise Framework</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { phase: 'Reconnaissance', tactic: 'T1595', name: 'Active Scanning', status: 'CONFIRMED' },
            { phase: 'Initial Access', tactic: 'T1190', name: 'Exploit Public App', status: 'CONFIRMED' },
            { phase: 'Execution', tactic: 'T1059', name: 'SQL Query Execution', status: 'CONFIRMED' },
            { phase: 'Persistence', tactic: 'T1078', name: 'Valid Accounts', status: 'CORRELATED' },
            { phase: 'Priv Escalation', tactic: 'T1068', name: 'Role Grant Bypass', status: 'CONFIRMED' },
            { phase: 'Credential Access', tactic: 'T1003', name: 'DB Credential Dump', status: 'CONFIRMED' },
            { phase: 'Exfiltration', tactic: 'T1041', name: 'Exfil Over C2', status: 'MITIGATED' }
          ].map(m => (
            <div
              key={m.tactic}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1"
            >
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">{m.phase}</div>
              <div className="text-cyan-400 font-extrabold text-xs">{m.tactic}</div>
              <div className="text-white text-[11px] font-sans truncate">{m.name}</div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase mt-1 ${
                m.status === 'MITIGATED' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        threat={inspectedThreat}
        onClose={() => setInspectedThreat(null)}
      />
    </div>
  );
};

export default AttackTimeline;
