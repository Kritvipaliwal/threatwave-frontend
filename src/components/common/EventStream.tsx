import React, { useState } from 'react';
import { Radio, Filter } from 'lucide-react';
import { SecurityEvent, Severity } from '../../types';

interface EventStreamProps {
  events: SecurityEvent[];
  maxHeight?: string;
  onSelectEvent?: (event: SecurityEvent) => void;
}

export const EventStream: React.FC<EventStreamProps> = ({ 
  events, 
  maxHeight = '420px',
  onSelectEvent 
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = events.filter(ev => {
    const matchSev = severityFilter === 'ALL' || ev.severity === severityFilter;
    const matchCat = categoryFilter === 'ALL' || ev.category === categoryFilter;
    return matchSev && matchCat;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/50';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c1527] rounded-xl border border-[#1e3a66]/60 overflow-hidden shadow-xl">
      {/* Stream Header & Filters */}
      <div className="p-3 border-b border-[#1e3a66]/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>LIVE SECURITY EVENT STREAM</span>
          <span className="text-[10px] text-slate-400">({filtered.length} visible)</span>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <Filter className="w-3 h-3 text-slate-500 mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Category Sub-Filters */}
      <div className="px-3 py-1.5 bg-slate-900/40 border-b border-[#1e3a66]/40 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
        <span className="text-slate-500">CATEGORY:</span>
        {['ALL', 'NETWORK', 'WEB', 'AUTHENTICATION', 'MALWARE', 'PHISHING'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              categoryFilter === cat
                ? 'bg-slate-800 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Table / List */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight }}>
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-[#0c1527] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e3a66]/60">
            <tr>
              <th className="py-2 px-3">TIME</th>
              <th className="py-2 px-3">SEVERITY</th>
              <th className="py-2 px-3">ATTACK TYPE</th>
              <th className="py-2 px-3">SOURCE → TARGET</th>
              <th className="py-2 px-3">AI CONF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a66]/30">
            {filtered.map(ev => (
              <tr
                key={ev.id}
                data-event-id={ev.id}
                onClick={() => onSelectEvent && onSelectEvent(ev)}
                className={`hover:bg-slate-800/50 cursor-pointer transition-all duration-300 animate-fadeIn ${
                  ev.severity === 'CRITICAL' ? 'bg-rose-500/5' : ''
                }`}
              >
                <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                  {ev.timestamp}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(ev.severity)}`}>
                    {ev.severity}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{ev.attackType}</span>
                    {ev.category === 'HISTORICAL' || ev.description?.startsWith('[HISTORICAL]') ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                        HISTORICAL
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                  <span className="text-cyan-400">{ev.sourceIp}</span>
                  <span className="text-slate-500 mx-1.5">→</span>
                  <span className="text-slate-200">{ev.destinationIp}:{ev.port}</span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="text-emerald-400 font-bold">
                    {Math.round(ev.confidence * 100)}%
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">
                  <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-bold">No live threats detected — Sensor Active</span>
                    <span className="text-slate-500 text-[10px]">Passively observing network frames on monitored TAP</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventStream;
