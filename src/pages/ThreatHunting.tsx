import React, { useState } from 'react';
import { Crosshair, Terminal, Sparkles, CheckCircle2, Search, ArrowRight, Download } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { SecurityEvent } from '../types';

export const ThreatHunting: React.FC = () => {
  const { state } = useDemoEngine();
  const [queryInput, setQueryInput] = useState<string>('');
  const [isHunting, setIsHunting] = useState<boolean>(false);
  const [huntStage, setHuntStage] = useState<number>(0);
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [results, setResults] = useState<SecurityEvent[]>(state.events.slice(0, 5));

  const suggestedHunts = [
    'Find all SQL injection attempts targeting database port 5432 or 80',
    'Show brute force attacks with more than 10 failed logins',
    'List critical severity threats originating from Tor exit nodes',
    'Detect abnormal port scanning sweeps on DMZ infrastructure'
  ];

  const handleRunHunt = async (customQuery?: string) => {
    const q = (customQuery || queryInput).trim();
    if (!q || isHunting) return;

    setIsHunting(true);
    setHuntStage(1); // AI ANALYSIS
    await new Promise(r => setTimeout(r, 600));

    setHuntStage(2); // QUERY GENERATION
    const sql = `SELECT * FROM telemetry_logs WHERE (attack_type ILIKE '%${q.substring(0, 6)}%' OR severity = 'CRITICAL') AND timestamp >= NOW() - INTERVAL '24 HOURS' ORDER BY confidence DESC LIMIT 10;`;
    setGeneratedSql(sql);
    await new Promise(r => setTimeout(r, 700));

    setHuntStage(3); // DATABASE SEARCH
    await new Promise(r => setTimeout(r, 600));

    setHuntStage(4); // THREATS FOUND
    // Filter realistic matching events
    const matches = state.events.filter(ev => 
      ev.attackType.toLowerCase().includes(q.toLowerCase().substring(0, 4)) || ev.severity === 'CRITICAL'
    );
    setResults(matches.length > 0 ? matches : state.events.slice(0, 4));

    setIsHunting(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> ADVERSARY PURSUIT
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">NL-TO-SQL AI HYPOTHESIS ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Threat Hunting Workspace
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Pursue advanced persistent threats (APT) using natural language hypotheses translated into safe parameterized queries.
          </p>
        </div>
      </div>

      {/* Query Search Console */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4 shadow-xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRunHunt();
          }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Hypothesis: 'Find SQL injection attacks', 'Show failed SSH logins', 'List critical events'..."
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isHunting || !queryInput.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 shrink-0"
          >
            <Crosshair className="w-4 h-4" />
            <span>{isHunting ? 'Hunting...' : 'Launch Hunt'}</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            RECOMMENDED HUNTING HYPOTHESES:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedHunts.map((hunt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(hunt);
                  handleRunHunt(hunt);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-[#1e3a66]/70 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors text-left"
              >
                {hunt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="font-bold text-white uppercase tracking-wider">Automated Threat Hunting Pipeline</span>
          <span className="text-cyan-300 text-[11px]">
            {isHunting ? `STAGE ${huntStage} OF 4 RUNNING` : 'PIPELINE READY'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
          {[
            { step: 1, name: 'NATURAL LANGUAGE', desc: 'Hypothesis parsed' },
            { step: 2, name: 'AI ANALYSIS', desc: 'MITRE ATT&CK mapped' },
            { step: 3, name: 'QUERY GENERATION', desc: 'Safe parameterized SQL' },
            { step: 4, name: 'DATABASE SEARCH', desc: 'Indexed telemetry scan' },
            { step: 5, name: 'THREATS FOUND', desc: `${results.length} Artifacts identified` }
          ].map(stage => {
            const isDone = huntStage >= stage.step;
            const isCurrent = huntStage === stage.step && isHunting;

            return (
              <div
                key={stage.step}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)] animate-pulse'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold">0{stage.step}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-[11px] truncate">{stage.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stage.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Generated SQL Code Box */}
        {generatedSql && (
          <div className="mt-4 p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[10px]">
              <span>GENERATED PARAMETERIZED SQL:</span>
              <span className="text-emerald-400">Execution Time: 4.2ms</span>
            </div>
            <code className="text-amber-300 block overflow-x-auto">{generatedSql}</code>
          </div>
        )}
      </div>

      {/* Hunting Findings Results Table */}
      <div className="rounded-xl bg-[#0c1527] border border-[#1e3a66] overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900/60 border-b border-[#1e3a66]/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Hunting Findings Artifacts ({results.length} records)</span>
          </div>
          <button
            onClick={() => alert('Exporting hunting telemetry results to CSV...')}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-[11px]"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c1527] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e3a66]">
              <tr>
                <th className="py-2.5 px-4">TIMESTAMP</th>
                <th className="py-2.5 px-4">SEVERITY</th>
                <th className="py-2.5 px-4">ATTACK CLASSIFICATION</th>
                <th className="py-2.5 px-4">SOURCE IP</th>
                <th className="py-2.5 px-4">TARGET HOST</th>
                <th className="py-2.5 px-4">EVIDENCE NOTE</th>
                <th className="py-2.5 px-4">AI CONF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a66]/30">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">{r.timestamp}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      r.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{r.attackType}</td>
                  <td className="py-3 px-4 text-cyan-300 font-bold whitespace-nowrap">{r.sourceIp}</td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{r.destinationIp}:{r.port}</td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs truncate">{r.description}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">{Math.round(r.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
