import React, { useState } from 'react';
import { 
  Radio, ShieldAlert, Filter, Search, Terminal, Eye, X, Activity, Server,
  Cpu, Layers, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { useRealtime } from '../hooks/useRealtime';
import { CORE_THREAT_PROFILES, DETECTION_ENGINES, ThreatProfile } from '../data/demoData';
import { EvidenceModal } from '../components/security/EvidenceModal';
import { SecurityEvent } from '../types';

export const LiveThreatDetection: React.FC = () => {
  const { state } = useDemoEngine();
  const { stats } = useRealtime();

  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<ThreatProfile | null>(null);

  const filteredEvents = state.events.filter(ev => {
    const matchSev = severityFilter === 'ALL' || ev.severity === severityFilter;
    const matchSearch = search === '' || 
      ev.attackType.toLowerCase().includes(search.toLowerCase()) ||
      ev.sourceIp.includes(search) ||
      ev.destinationIp.includes(search);
    return matchSev && matchSearch;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. TOP BANNER & LIVE DETECTION STATUS */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                LIVE DETECTION STATUS
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                Sensor: <strong className="text-white">CONNECTED</strong>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block ml-0.5" />
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Threat Detection & Passive Packet Workspace
            </h1>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Scapy & tshark passive tap feed into multi-layered feature extractor, isolation forest ML models, and stateful correlation rules.
            </p>
          </div>

          {/* Live Sensor Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
              <div className="text-cyan-400 font-black text-xl">12,481</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Events Processed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
              <div className="text-emerald-400 font-black text-xl">{stats.eventsPerSec}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Events / Sec</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
              <div className="text-rose-400 font-black text-xl">{state.metrics.criticalThreats}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Critical Signals</div>
            </div>
          </div>
        </div>

        {/* 5 Detection Engines Status Row */}
        <div className="pt-4 border-t border-[#1e3a66]/60">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            REAL-TIME DETECTION ENGINES (MICROSECOND PIPELINE)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono text-xs">
            {DETECTION_ENGINES.map(eng => (
              <div
                key={eng.name}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-[#1e3a66]/70 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="font-extrabold text-white text-[11px]">{eng.name}</div>
                  <div className="text-[9px] text-slate-400">{eng.latency} inference</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {eng.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 8 CORE THREAT CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="font-extrabold text-white uppercase text-sm">8 ACTIVE THREAT VECTORS</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 text-[11px]">Click card to open Evidence & Confidence Rings</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">SAFE TEST ENVIRONMENT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {CORE_THREAT_PROFILES.map(thr => (
            <div
              key={thr.id}
              onClick={() => setSelectedThreat(thr)}
              className="p-4 rounded-2xl bg-[#091224] border border-[#1e3a66]/80 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] transition-all duration-300 cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getSeverityBadge(thr.severity)}`}>
                  {thr.severity}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{thr.timestamp}</span>
                </span>
              </div>

              <div>
                <h2 className="text-white font-extrabold text-base group-hover:text-cyan-300 transition-colors">
                  {thr.name}
                </h2>
                <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider mt-0.5">
                  Method: {thr.detectionMethod} PIPELINE
                </div>
              </div>

              {/* Source & Target IPs */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Source:</span>
                  <span className="text-rose-400 font-bold truncate max-w-[140px]">{thr.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target:</span>
                  <span className="text-cyan-300 font-bold truncate max-w-[140px]">{thr.target}</span>
                </div>
              </div>

              {/* Confidence & Risk Score meters */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-emerald-400 font-black">{thr.confidence}%</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${thr.confidence}%` }} />
                </div>

                <div className="flex justify-between text-[10px] pt-1">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className="text-rose-400 font-black">{thr.riskScore} / 100</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${thr.riskScore}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-cyan-400 font-bold group-hover:text-cyan-300">
                <span>View Evidence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TELEMETRY INGESTION TABLE WITH FILTER TOOLBAR */}
      <div className="space-y-3 font-mono">
        <div className="p-4 rounded-xl bg-[#091224] border border-[#1e3a66] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by IP, attack type, port..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Ingested Table */}
        <div className="rounded-2xl bg-[#080d1a] border border-[#1e3a66] overflow-hidden shadow-2xl">
          <div className="p-3.5 bg-slate-950/90 border-b border-[#1e3a66] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Stream Telemetry Log ({filteredEvents.length} events)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Continuous Ingestion
            </span>
          </div>

          <div className="overflow-x-auto max-h-[440px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Vector / Attack Type</th>
                  <th className="py-2.5 px-4">Severity</th>
                  <th className="py-2.5 px-4">Source IP</th>
                  <th className="py-2.5 px-4">Target Host</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredEvents.map(ev => (
                  <tr
                    key={ev.id}
                    onClick={() => {
                      const matched = CORE_THREAT_PROFILES.find(t => 
                        t.name.toLowerCase() === ev.attackType.toLowerCase()
                      ) || {
                        ...CORE_THREAT_PROFILES[0],
                        name: ev.attackType,
                        source: ev.sourceIp,
                        target: ev.destinationIp,
                        severity: ev.severity,
                        confidence: Math.round(ev.confidence * 100)
                      };
                      setSelectedThreat(matched);
                    }}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{ev.timestamp} UTC</td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{ev.attackType}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(ev.severity)}`}>
                        {ev.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-rose-400 whitespace-nowrap">{ev.sourceIp}</td>
                    <td className="py-3 px-4 text-cyan-300 whitespace-nowrap">{ev.destinationIp}:{ev.port}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                      {(ev.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/20 text-[10px] font-bold">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EVIDENCE PANEL MODAL */}
      <EvidenceModal
        threat={selectedThreat}
        onClose={() => setSelectedThreat(null)}
      />
    </div>
  );
};

export default LiveThreatDetection;
