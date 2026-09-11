import React, { useState } from 'react';
import { 
  GitFork, ShieldAlert, X, Activity, Server, Database, Eye, 
  Terminal, Sparkles, Network, ArrowRight
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { AttackGraphCanvas, GraphNodeData } from '../components/attack/AttackGraphCanvas';
import { EvidenceModal } from '../components/security/EvidenceModal';
import { CORE_THREAT_PROFILES, ThreatProfile } from '../data/demoData';

export const ThreatGraph: React.FC = () => {
  const { state } = useDemoEngine();
  const [selectedThreatProfile, setSelectedThreatProfile] = useState<ThreatProfile | null>(null);

  const handleInspectNode = (node: GraphNodeData) => {
    // Match node to threat profile
    const match = CORE_THREAT_PROFILES.find(t => 
      t.name.toLowerCase().includes(node.name.toLowerCase()) ||
      node.name.toLowerCase().includes(t.name.toLowerCase())
    ) || CORE_THREAT_PROFILES[1];

    setSelectedThreatProfile(match);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              TOPOLOGICAL THREAT GRAPH
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">9 INTERCONNECTED STAGES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Adversary Attack Graph & Kill Chain
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Interactive graph topology correlating attacker infrastructure, reconnaissance, weaponized exploits, database access, and data exfiltration.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[100px]">
            <div className="text-rose-400 font-black text-lg">9 Nodes</div>
            <div className="text-[10px] text-slate-500 uppercase">Topological</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[100px]">
            <div className="text-cyan-400 font-black text-lg">10 Edges</div>
            <div className="text-[10px] text-slate-500 uppercase">Pulsing Flow</div>
          </div>
        </div>
      </div>

      {/* Interactive Canvas */}
      <AttackGraphCanvas onInspectNode={handleInspectNode} />

      {/* Kill-Chain Progression Ribbon */}
      <div className="p-5 rounded-2xl bg-[#091224] border border-[#1e3a66] font-mono text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span>ATTACK PROGRESSION TIMELINE</span>
          </span>
          <span className="text-slate-400 text-[10px]">CORRELATED ADVERSARY FLOW</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-2 min-w-[800px] text-[11px]">
            {['Attacker', 'Recon', 'Port Scan', 'Web Server', 'SQL Injection', 'Compromise', 'Priv Escalation', 'Database', 'Exfiltration'].map((st, i, arr) => (
              <React.Fragment key={st}>
                <div className={`p-2.5 rounded-xl border text-center font-bold flex-1 ${
                  i >= 4 
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                    : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                }`}>
                  <div className="text-[9px] text-slate-400 uppercase">Phase {i + 1}</div>
                  <div className="truncate">{st}</div>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-slate-600 font-bold shrink-0">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Modal on Node Click */}
      <EvidenceModal
        threat={selectedThreatProfile}
        onClose={() => setSelectedThreatProfile(null)}
      />
    </div>
  );
};

export default ThreatGraph;
