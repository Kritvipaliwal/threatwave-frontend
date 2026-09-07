import React, { useState } from 'react';
import { 
  Radio, ShieldAlert, Filter, Search, Terminal, Eye, X, Activity, Server
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { SecurityEvent } from '../types';

export const LiveThreatDetection: React.FC = () => {
  const { state } = useDemoEngine();
  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [inspectModalEvent, setInspectModalEvent] = useState<SecurityEvent | null>(null);

  const filtered = state.events.filter(ev => {
    const matchSev = severityFilter === 'ALL' || ev.severity === severityFilter;
    const matchSearch = search === '' || 
      ev.attackType.toLowerCase().includes(search.toLowerCase()) ||
      ev.sourceIp.includes(search) ||
      ev.destinationIp.includes(search);
    return matchSev && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400 animate-ping" />
              STREAM CONNECTED
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">100% INGESTION RATE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Live Threat Detection & Packet Stream
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time deep packet inspection, distributed intrusion detection, and anomaly scoring stream.
          </p>
        </div>

        {/* Live Rates */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-cyan-400 font-extrabold text-lg">2,420</div>
            <div className="text-[10px] text-slate-500 uppercase">EVENTS/SEC</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-rose-400 font-extrabold text-lg">{state.metrics.criticalThreats}</div>
            <div className="text-[10px] text-slate-500 uppercase">CRITICAL/HR</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-extrabold text-lg">99.4%</div>
            <div className="text-[10px] text-slate-500 uppercase">DETECTION RATE</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search IP or attack (e.g. SQL, Brute, 185)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Feed Table */}
      <div className="rounded-xl bg-[#0c1527] border border-[#1e3a66] overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900/60 border-b border-[#1e3a66]/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Telemetry Ingestion Table ({filtered.length} matching events)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            POLLING: SYNCED
          </span>
        </div>

        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-[#0c1527] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e3a66]">
              <tr>
                <th className="py-2.5 px-4">TIMESTAMP</th>
                <th className="py-2.5 px-4">SEVERITY</th>
                <th className="py-2.5 px-4">ATTACK VECTOR</th>
                <th className="py-2.5 px-4">SOURCE IP</th>
                <th className="py-2.5 px-4">DESTINATION ASSET</th>
                <th className="py-2.5 px-4">PORT/PROTO</th>
                <th className="py-2.5 px-4">AI CONFIDENCE</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a66]/30">
              {filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {ev.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      ev.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : ev.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {ev.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {ev.attackType}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 whitespace-nowrap font-bold">
                    {ev.sourceIp}
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {ev.destinationIp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                      {ev.protocol}:{ev.port}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-emerald-400 font-bold">
                    {Math.round(ev.confidence * 100)}%
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setInspectModalEvent(ev)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-400/40 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px] ml-auto"
                    >
                      <Eye className="w-3 h-3" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Telemetry Payload Inspector Modal */}
      {inspectModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full p-5 rounded-2xl bg-[#0c1527] border border-cyan-400/50 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>RAW TELEMETRY PAYLOAD INSPECTOR</span>
              </div>
              <button
                onClick={() => setInspectModalEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SOURCE IP</span>
                <span className="text-cyan-400 font-bold text-sm">{inspectModalEvent.sourceIp}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ATTACK CLASSIFICATION</span>
                <span className="text-rose-400 font-bold text-sm">{inspectModalEvent.attackType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">DESCRIPTION / ANOMALY NOTE</span>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                {inspectModalEvent.description}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">PACKET JSON PAYLOAD</span>
              <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] max-h-48">
                {JSON.stringify(inspectModalEvent, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectModalEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
