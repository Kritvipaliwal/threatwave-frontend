import React, { useState } from 'react';
import { 
  Globe, Search, ShieldAlert, Fingerprint, Ban, CheckCircle2, AlertTriangle, 
  Layers, ExternalLink, MapPin
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { IOC } from '../types';

export const ThreatIntelligence: React.FC = () => {
  const { state, executeResponseAction } = useDemoEngine();
  const [indicatorInput, setIndicatorInput] = useState<string>('185.220.101.5');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [selectedIoc, setSelectedIoc] = useState<IOC>(state.iocs[0]);

  const handleScanIoc = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!indicatorInput.trim() || isScanning) return;

    setIsScanning(true);
    const steps = [1, 2, 3, 4, 5];
    for (const s of steps) {
      setScanStep(s);
      await new Promise(r => setTimeout(r, 350));
    }

    // Match or create dynamic IOC result
    const match = state.iocs.find(i => i.value.toLowerCase() === indicatorInput.trim().toLowerCase());
    if (match) {
      setSelectedIoc(match);
    } else {
      setSelectedIoc({
        id: `ioc-${Date.now()}`,
        value: indicatorInput.trim(),
        type: indicatorInput.includes('.') && !indicatorInput.includes('/') ? 'IP' : 'DOMAIN',
        threatScore: 94,
        reputation: 'MALICIOUS',
        country: 'Netherlands',
        organization: 'Shinjiru Bulletproof Hosting',
        firstSeen: '2026-03-05',
        associatedThreats: 'Credential Harvesting & SQL Injection'
      });
    }

    setIsScanning(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold flex items-center gap-1">
              <Globe className="w-3 h-3" /> GLOBAL THREAT RADAR
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">4 LIVE INTELLIGENCE FEEDS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Threat Intelligence & IOC Reputation
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time adversary profiling, dark-web threat feeds, and automated IP reputation scoring.
          </p>
        </div>
      </div>

      {/* Intelligence Feeds Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        {[
          { name: 'ABUSEIPDB FEED', status: 'SYNCED', detail: 'Last pull: 2 mins ago', color: 'text-emerald-400' },
          { name: 'ALIENVAULT OTX', status: 'ACTIVE', detail: '1,420 Pulse Indicators', color: 'text-cyan-400' },
          { name: 'VIRUSTOTAL INTEL', status: 'CONNECTED', detail: 'Quota: 92% Available', color: 'text-emerald-400' },
          { name: 'THREATWAVE BLACKLIST', status: `${state.metrics.blockedIps} IPS ENFORCED`, detail: 'Automated Firewall Drops', color: 'text-rose-400' }
        ].map((feed, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#0c1527] border border-[#1e3a66]/70">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>{feed.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className={`font-extrabold text-sm ${feed.color}`}>{feed.status}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{feed.detail}</div>
          </div>
        ))}
      </div>

      {/* IOC Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4">
        <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Investigate Indicator of Compromise (IP, Domain, URL, Hash, CVE)</span>
        </div>

        <form onSubmit={handleScanIoc} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={indicatorInput}
              onChange={e => setIndicatorInput(e.target.value)}
              placeholder="e.g., 185.220.101.5 or auth-verify-security-portal.com or MD5 hash..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !indicatorInput.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 shrink-0"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isScanning ? 'Scanning...' : 'Investigate IOC'}</span>
          </button>
        </form>

        {/* Scan Workflow Animation */}
        {isScanning && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-400/40 font-mono text-xs">
            <div className="flex items-center justify-between gap-2 text-[11px] text-cyan-300 mb-2">
              <span className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                INTELLIGENCE CORRELATION IN PROGRESS...
              </span>
              <span>STAGE {scanStep} / 5</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-[10px]">
              {['SCANNING IOC', 'REPUTATION CHECK', 'THREAT INTEL', 'CORRELATION', 'RISK ASSESSMENT'].map((name, i) => (
                <div key={i} className={`p-1.5 rounded text-center border ${
                  scanStep > i
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : scanStep === i + 1
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold animate-pulse'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* IOC Investigation Result Profile Card */}
      {selectedIoc && (
        <div className="p-6 rounded-2xl bg-[#0c1527] border border-rose-500/40 shadow-[0_0_24px_rgba(244,63,94,0.2)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3a66] pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs mb-1">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  {selectedIoc.reputation} ENTITY
                </span>
                <span className="text-slate-400">IOC TYPE: {selectedIoc.type}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300 tracking-tight">
                {selectedIoc.value}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-xs text-slate-400">THREAT SCORE</div>
                <div className="text-2xl font-extrabold text-rose-400">{selectedIoc.threatScore} / 100</div>
              </div>
              <button
                onClick={() => {
                  executeResponseAction('BLOCK_IP', selectedIoc.value);
                  alert(`Defense action complete: ${selectedIoc.value} blacklisted across perimeter firewalls.`);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Ban className="w-3.5 h-3.5" /> Enforce Blacklist
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">GEOLOCATION</span>
              <span className="text-white font-bold text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {selectedIoc.country}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ORGANIZATION / ASN</span>
              <span className="text-white font-bold text-sm truncate block mt-0.5">
                {selectedIoc.organization}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ASSOCIATED THREATS</span>
              <span className="text-amber-300 font-bold text-sm truncate block mt-0.5">
                {selectedIoc.associatedThreats}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">FIRST DISCOVERED</span>
              <span className="text-slate-300 font-bold text-sm block mt-0.5">
                {selectedIoc.firstSeen}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Blacklisted IPs Table */}
      <div className="rounded-xl bg-[#0c1527] border border-[#1e3a66] overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900/60 border-b border-[#1e3a66]/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Ban className="w-4 h-4 text-rose-400" />
            <span>Enforced Threat Blacklist ({state.metrics.blockedIps} Active Drops)</span>
          </div>
          <span className="text-[10px] text-rose-400 font-bold">FIREWALL HARDENED</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c1527] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e3a66]">
              <tr>
                <th className="py-2.5 px-4">INDICATOR</th>
                <th className="py-2.5 px-4">TYPE</th>
                <th className="py-2.5 px-4">COUNTRY</th>
                <th className="py-2.5 px-4">THREAT VECTOR</th>
                <th className="py-2.5 px-4">REPUTATION</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a66]/30">
              {state.iocs.map(ioc => (
                <tr key={ioc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-300 whitespace-nowrap">{ioc.value}</td>
                  <td className="py-3 px-4 text-slate-400">{ioc.type}</td>
                  <td className="py-3 px-4 text-slate-300">{ioc.country}</td>
                  <td className="py-3 px-4 text-amber-300">{ioc.associatedThreats}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {ioc.reputation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setIndicatorInput(ioc.value);
                        setSelectedIoc(ioc);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 text-slate-300 transition-colors text-[11px]"
                    >
                      Audit
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
