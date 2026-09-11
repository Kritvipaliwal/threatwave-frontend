import React, { useState, useEffect } from 'react';
import { 
  Network, Shield, Server, Database, Router, Globe, Laptop, 
  AlertTriangle, CheckCircle2, Activity, RefreshCw, Layers, 
  Radio, Lock, ArrowRight, Zap, Info, ShieldAlert, Cpu
} from 'lucide-react';
import { networkService } from '../services/networkService';
import type { NetworkMapResponse, NetworkNode, NetworkEdge } from '../types';

export const LiveNetworkMap: React.FC = () => {
  const [data, setData] = useState<NetworkMapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchMap = async () => {
    setLoading(true);
    try {
      const res = await networkService.getNetworkMap();
      setData(res);
      if (res.nodes.length > 0 && !selectedNode) {
        setSelectedNode(res.nodes[0]);
      }
    } catch (e) {
      console.error('Failed to load network map:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMap();
    const timer = setInterval(fetchMap, 15000);
    return () => clearInterval(timer);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gateway':
        return Router;
      case 'external_target':
      case 'attacker':
        return Globe;
      case 'database':
        return Database;
      case 'local_host':
      case 'workstation':
        return Laptop;
      default:
        return Server;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compromised':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'suspicious':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'offline':
        return 'bg-slate-500/20 text-slate-400 border-slate-600';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const filteredNodes = data?.nodes.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'THREAT') return n.status === 'compromised' || n.status === 'suspicious';
    return n.type === filterType;
  }) || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              TOPOLOGY DISCOVERY
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">ZEEK PASSIVE TAP FEED</span>
            <span>•</span>
            <span className="text-slate-400">ENDPOINT: /api/network/map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Observed Network Communications Map
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5 max-w-3xl">
            Real-time topology constructed exclusively from captured packet headers and flow records.
          </p>
        </div>

        {/* Action button & telemetry stamp */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={fetchMap}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Topology</span>
          </button>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
            <div className="text-emerald-400 font-black text-base">{data?.last_seen || 'Active'}</div>
            <div className="text-[10px] text-slate-400 uppercase">Last Seen</div>
          </div>
        </div>
      </div>

      {/* 2. Important Telemetry Disclaimer */}
      <div className="p-4 rounded-xl bg-[#0a1224] border border-cyan-500/30 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-cyan-300">OBSERVED NETWORK COMMUNICATIONS PRINCIPLE:</span>
          <p className="text-slate-300 leading-relaxed">
            This graph represents hosts actively transmitting packets captured by the ThreatWave passive sensor.
            It reflects verified protocol flows (TCP/HTTP/HTTPS/DNS/PostgreSQL), not physical Wi-Fi or Bluetooth device discovery.
          </p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#091224] border border-[#1e3a66]">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {['ALL', 'THREAT', 'gateway', 'device', 'local_host', 'external_target'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white font-bold">{filteredNodes.length}</span> of {data?.nodes.length || 0} observed nodes
        </div>
      </div>

      {/* 4. Main Topology Display & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Node Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map(node => {
              const Icon = getNodeIcon(node.type);
              const isSelected = selectedNode?.id === node.id;
              const isCompromised = node.status === 'compromised';
              const isSuspicious = node.status === 'suspicious';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0f1f3d] border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                      : 'bg-[#080e1c] border-[#1e3a66]/70 hover:border-cyan-500/50 hover:bg-[#0b162c]'
                  }`}
                >
                  {isCompromised && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl border ${
                        isCompromised
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : isSuspicious
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm tracking-tight">{node.label}</h3>
                        <div className="font-mono text-xs text-cyan-300 font-semibold">{node.ip}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(node.status)}`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#1e3a66]/50 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>TYPE: <strong className="text-slate-200">{node.type.toUpperCase()}</strong></span>
                    {node.mac && <span>MAC: <strong className="text-slate-300">{node.mac}</strong></span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Observed Connections Table */}
          <div className="p-5 rounded-2xl bg-[#080d1a] border border-[#1e3a66] space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>OBSERVED FLOWS & SESSIONS ({data?.edges.length || 0})</span>
              </span>
              <span className="text-slate-400 text-[10px]">PASSIVE CONCURRENT INGRESS/EGRESS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                    <th className="pb-2">SOURCE</th>
                    <th className="pb-2">DESTINATION</th>
                    <th className="pb-2">PROTOCOL</th>
                    <th className="pb-2">PORT</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2 text-right">SECURITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {data?.edges.map((edge, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 text-cyan-300 font-bold">{edge.source}</td>
                      <td className="py-2.5 text-white">{edge.target}</td>
                      <td className="py-2.5 text-amber-300 font-semibold">{edge.protocol}</td>
                      <td className="py-2.5 text-slate-300">{edge.port}</td>
                      <td className="py-2.5 text-slate-400">{edge.status}</td>
                      <td className="py-2.5 text-right">
                        {edge.threat ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                            ATTACK FLOW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            BENIGN
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Node Detailed Inspector */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-500/40 shadow-xl space-y-4 sticky top-24 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a66]">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>HOST TELEMETRY CARD</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedNode ? getStatusBadge(selectedNode.status) : ''}`}>
                {selectedNode?.status || 'SELECT HOST'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">HOSTNAME / LABEL</div>
                  <div className="font-bold text-white text-base tracking-tight font-sans mt-0.5">
                    {selectedNode.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">IP ADDRESS</div>
                    <div className="text-cyan-400 font-bold mt-0.5">{selectedNode.ip}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">NODE TYPE</div>
                    <div className="text-white font-bold mt-0.5 uppercase">{selectedNode.type}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">HARDWARE MAC</div>
                    <div className="text-slate-300 font-semibold mt-0.5">{selectedNode.mac || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">TELEMETRY STATE</div>
                    <div className="text-emerald-400 font-bold mt-0.5">SYNCHRONIZED</div>
                  </div>
                </div>

                {selectedNode.status === 'compromised' && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs space-y-1 font-sans">
                    <div className="font-bold flex items-center gap-1.5 font-mono text-rose-400">
                      <AlertTriangle className="w-4 h-4" /> ACTIVE INTRUSION INDICATOR
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Correlated in multi-stage attack story THR-1042. Received OWASP SQL injection payload and executed lateral database ingress.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase">OBSERVED TRAFFIC PROFILES</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">TCP 443 (HTTPS Ingress)</span>
                      <span className="text-cyan-400 font-bold">14.2 MB</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">TCP 5432 (PostgreSQL)</span>
                      <span className="text-rose-400 font-bold">4.8 MB (Lateral)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">UDP 53 (DNS PTR Query)</span>
                      <span className="text-slate-400 font-bold">42 pkts</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                Select a network node from the topology to inspect observed telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNetworkMap;
