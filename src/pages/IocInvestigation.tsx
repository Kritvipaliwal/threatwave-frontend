import React, { useState } from 'react';
import { Fingerprint, Search, ShieldAlert, Plus, Ban, ExternalLink } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { IOC } from '../types';

export const IocInvestigation: React.FC = () => {
  const { state } = useDemoEngine();
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = state.iocs.filter(ioc => {
    const matchType = typeFilter === 'ALL' || ioc.type === typeFilter;
    const matchSearch = search === '' ||
      ioc.value.toLowerCase().includes(search.toLowerCase()) ||
      ioc.associatedThreats.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
              <Fingerprint className="w-3 h-3" /> THREAT TELEMETRY ARTIFACTS
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">CROSS-INCIDENT CORRELATION</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            IOC Investigation Registry
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Database of Indicators of Compromise (IPs, Hashes, Domains, CVEs) tracked across enterprise attack surfaces.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search indicator or threat family..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono w-full sm:w-auto overflow-x-auto">
          {['ALL', 'IP', 'DOMAIN', 'HASH'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                typeFilter === t
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* IOCs Table */}
      <div className="rounded-xl bg-[#0c1527] border border-[#1e3a66] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c1527] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e3a66]">
              <tr>
                <th className="py-2.5 px-4">INDICATOR ARTIFACT</th>
                <th className="py-2.5 px-4">TYPE</th>
                <th className="py-2.5 px-4">THREAT SCORE</th>
                <th className="py-2.5 px-4">REPUTATION</th>
                <th className="py-2.5 px-4">GEOLOCATION / ASN</th>
                <th className="py-2.5 px-4">CORRELATED THREATS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a66]/30">
              {filtered.map(ioc => (
                <tr key={ioc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-300 whitespace-nowrap">{ioc.value}</td>
                  <td className="py-3 px-4 text-slate-400">{ioc.type}</td>
                  <td className="py-3 px-4 font-bold text-rose-400">{ioc.threatScore} / 100</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {ioc.reputation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{ioc.country} ({ioc.organization})</td>
                  <td className="py-3 px-4 text-amber-300">{ioc.associatedThreats}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Enforcing perimeter firewall rule block for ${ioc.value}`)}
                      className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600 hover:text-white border border-rose-500/40 text-rose-300 text-[11px] font-bold transition-all"
                    >
                      Enforce Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
