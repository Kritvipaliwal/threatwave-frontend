import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Server, Zap, Bug, Fingerprint, Activity } from 'lucide-react';
import { useDemoEngine } from '../../demo/useDemoEngine';
import { ActivePage } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { state } = useDemoEngine();
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Assets
  const matchedAssets = state.assets.filter(a =>
    a.hostname.toLowerCase().includes(q) || a.ipAddress.includes(q) || a.assetType.toLowerCase().includes(q)
  );

  // Search Incidents
  const matchedIncidents = state.incidents.filter(inc =>
    inc.title.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q) || inc.targetAsset.toLowerCase().includes(q)
  );

  // Search Vulnerabilities
  const matchedVulns = state.vulnerabilities.filter(v =>
    v.cveId.toLowerCase().includes(q) || v.title.toLowerCase().includes(q)
  );

  // Search IOCs
  const matchedIocs = state.iocs.filter(ioc =>
    ioc.value.toLowerCase().includes(q) || ioc.associatedThreats.toLowerCase().includes(q)
  );

  // Search Events
  const matchedEvents = state.events.filter(ev =>
    ev.sourceIp.includes(q) || ev.destinationIp.includes(q) || ev.attackType.toLowerCase().includes(q)
  );

  const totalMatches = matchedAssets.length + matchedIncidents.length + matchedVulns.length + matchedIocs.length + matchedEvents.length;

  const handleSelect = (page: ActivePage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0c1527] border border-cyan-400/40 shadow-[0_0_40px_rgba(0,242,254,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#1e3a66]/70 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search IP, Hash, Domain, CVE, Incident ID, or Hostname..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm font-mono placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {q.length < 2 ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-cyan-400/40" />
              <p>Type at least 2 characters to search across the entire ThreatWave SOC.</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <span>Try:</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">185.220</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">CVE-2024</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">Prod-DB</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">SQL</span>
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No matching security entities found for "{query}".
            </div>
          ) : (
            <>
              {/* Assets matches */}
              {matchedAssets.length > 0 && (
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1.5">
                    Assets ({matchedAssets.length})
                  </div>
                  <div className="space-y-1">
                    {matchedAssets.slice(0, 3).map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelect('assets')}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Server className="w-4 h-4 text-cyan-400" />
                          <div>
                            <div className="font-bold text-white">{a.hostname}</div>
                            <div className="text-[10px] text-slate-400">{a.ipAddress} • {a.os}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold">Risk: {a.riskScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents matches */}
              {matchedIncidents.length > 0 && (
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase mb-1.5">
                    Incidents ({matchedIncidents.length})
                  </div>
                  <div className="space-y-1">
                    {matchedIncidents.slice(0, 3).map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => handleSelect('incident-response')}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="font-bold text-white">{inc.id}: {inc.title}</div>
                            <div className="text-[10px] text-slate-400">{inc.targetAsset} • Status: {inc.status}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold">{inc.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CVE matches */}
              {matchedVulns.length > 0 && (
                <div>
                  <div className="text-[10px] text-rose-400 font-bold uppercase mb-1.5">
                    Vulnerabilities ({matchedVulns.length})
                  </div>
                  <div className="space-y-1">
                    {matchedVulns.slice(0, 3).map(v => (
                      <div
                        key={v.id}
                        onClick={() => handleSelect('vulnerabilities')}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-rose-400/50 hover:bg-rose-500/10 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bug className="w-4 h-4 text-rose-400" />
                          <div>
                            <div className="font-bold text-white">{v.cveId}: {v.title}</div>
                            <div className="text-[10px] text-slate-400">CVSS {v.cvssScore} • {v.affectedAsset}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold">{v.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IOC matches */}
              {matchedIocs.length > 0 && (
                <div>
                  <div className="text-[10px] text-purple-400 font-bold uppercase mb-1.5">
                    IOC Indicators ({matchedIocs.length})
                  </div>
                  <div className="space-y-1">
                    {matchedIocs.slice(0, 3).map(ioc => (
                      <div
                        key={ioc.id}
                        onClick={() => handleSelect('threat-intelligence')}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-purple-400/50 hover:bg-purple-500/10 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Fingerprint className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="font-bold text-white">{ioc.value}</div>
                            <div className="text-[10px] text-slate-400">{ioc.type} • {ioc.associatedThreats}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold">{ioc.reputation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events matches */}
              {matchedEvents.length > 0 && (
                <div>
                  <div className="text-[10px] text-sky-400 font-bold uppercase mb-1.5">
                    Security Logs ({matchedEvents.length})
                  </div>
                  <div className="space-y-1">
                    {matchedEvents.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => handleSelect('live-detection')}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-sky-400/50 hover:bg-sky-500/10 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Activity className="w-4 h-4 text-sky-400" />
                          <div>
                            <div className="font-bold text-white">{ev.attackType}</div>
                            <div className="text-[10px] text-slate-400">{ev.sourceIp} → {ev.destinationIp}:{ev.port}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-cyan-300 font-bold">{ev.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#1e3a66]/60 bg-black/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Click any item to inspect its module</span>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ESC to close</kbd>
        </div>
      </div>
    </div>
  );
};
