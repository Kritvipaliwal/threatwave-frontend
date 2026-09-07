import React, { useState } from 'react';
import { Server, ShieldAlert, Cpu, Activity, Lock, X, CheckCircle2 } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { Asset } from '../types';

export const AssetMonitor: React.FC = () => {
  const { state, executeResponseAction } = useDemoEngine();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold flex items-center gap-1">
              <Server className="w-3 h-3" /> ENTERPRISE ENDPOINT INVENTORY
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">100% HEALTH AGENTS ONLINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Infrastructure Asset Monitor
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Continuous posture monitoring, telemetry health, CPU/network load, and real-time vulnerability exposure.
          </p>
        </div>
      </div>

      {/* Asset Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {state.assets.map(asset => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66]/70 hover:border-cyan-400/50 hover:bg-slate-900/40 transition-all cursor-pointer shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">{asset.hostname}</div>
                  <div className="text-[11px] text-slate-400">{asset.ipAddress}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(asset.status)}`}>
                {asset.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-500">OPERATING SYSTEM:</span>
                <span className="text-slate-300 font-bold">{asset.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">EXPOSURE RISK SCORE:</span>
                <span className={`font-bold ${asset.riskScore > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {asset.riskScore} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CVE VULNERABILITIES:</span>
                <span className="text-amber-300 font-bold">{asset.vulnerabilitiesCount} Tracked</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CPU / NETWORK LOAD:</span>
                <span className="text-cyan-300">{asset.cpu}% • {asset.network}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
              <span>Last Heartbeat: {asset.lastActivity}</span>
              <span className="text-cyan-400 font-bold">Inspect Details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Detail Drawer Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full p-5 rounded-2xl bg-[#0c1527] border border-cyan-400/50 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>{selectedAsset.hostname} Telemetry</span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">IP ADDRESS & SUBNET</span>
                <div className="text-sm font-bold text-cyan-300">{selectedAsset.ipAddress} (VPC Production)</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RISK INDEX</span>
                  <span className="text-lg font-bold text-rose-400">{selectedAsset.riskScore}/100</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HEALTH STATUS</span>
                  <span className="text-lg font-bold text-emerald-400">{selectedAsset.status}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#1e3a66]">
              <button
                onClick={() => {
                  executeResponseAction('ISOLATE_ASSET', selectedAsset.hostname);
                  setSelectedAsset(null);
                  alert(`Network containment enforced: ${selectedAsset.hostname} isolated from VPC routing.`);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Isolate Host from Subnet
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
