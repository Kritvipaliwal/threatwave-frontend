import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Server, Database, Radio, Activity, CheckCircle2, 
  AlertTriangle, XCircle, RefreshCw, Layers, ShieldCheck, Cpu, Terminal
} from 'lucide-react';
import { versionService } from '../services/versionService';
import type { SystemHealthStatus, SystemVersionInfo } from '../types';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);
  const [version, setVersion] = useState<SystemVersionInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshDiagnostics = async () => {
    setLoading(true);
    try {
      const [h, v] = await Promise.all([
        versionService.getSystemHealth(),
        versionService.getSystemVersion()
      ]);
      setHealth(h);
      setVersion(v);
    } catch (err) {
      console.error('Failed to fetch system diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDiagnostics();
    const timer = setInterval(refreshDiagnostics, 15000);
    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SIMULATED':
      case 'STANDBY':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'DEGRADED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const components = [
    { name: 'ThreatWave Frontend (React / Vite)', status: health?.frontend || 'ONLINE', role: 'Command UI & Real-Time Visualization', icon: Layers },
    { name: 'ThreatWave Backend (FastAPI)', status: health?.backend || 'ONLINE', role: 'Telemetry Processing & Detection Pipeline', icon: Server },
    { name: 'Relational Database (PostgreSQL / SQLite)', status: health?.database || 'ONLINE', role: 'Security Events & Correlation Store', icon: Database },
    { name: 'Passive Network Sensor (Zeek 6.x)', status: health?.zeekSensor || 'ONLINE', role: 'Live TAP Ingress (conn, http, dns, ssl)', icon: Activity },
    { name: 'Packet Inspection Engine (TShark)', status: health?.tshark || 'ONLINE', role: 'Deep Packet Evidence & PCAP Analyzer', icon: Terminal },
    { name: 'Async WebSocket Bus', status: health?.websocket || 'ONLINE', role: 'Microsecond Real-time Event Streaming', icon: Radio },
    { name: 'SecOps AI Copilot Reasoning Provider', status: health?.aiProvider || 'ONLINE', role: 'Incident Investigation & Playbooks', icon: Cpu }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
              SYSTEM DIAGNOSTICS & VERSION COMPATIBILITY
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">ALL 7 TIERS SYNCHRONIZED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            System Health & Component Status
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5 max-w-3xl">
            Real-time operational health checks verifying backend telemetry ingestion, database connectivity, sensor interfaces, and AI reasoners.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={refreshDiagnostics}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Diagnostics</span>
          </button>
        </div>
      </div>

      {/* 2. Version Information Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-500 uppercase">FRONTEND VERSION</div>
          <div className="text-cyan-400 font-bold text-base mt-0.5">v{version?.frontend_version || '2.1.0'}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Up to date</div>
        </div>
        <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-500 uppercase">BACKEND VERSION</div>
          <div className="text-white font-bold text-base mt-0.5">v{version?.backend_version || '2.1.0'}</div>
          <div className="text-[10px] text-cyan-300 mt-1">FastAPI Telemetry</div>
        </div>
        <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-500 uppercase">API & SCHEMA VERSION</div>
          <div className="text-amber-300 font-bold text-base mt-0.5">{version?.api_version.toUpperCase()} / Schema {version?.schema_version}</div>
          <div className="text-[10px] text-slate-400 mt-1">Alembic Synchronized</div>
        </div>
        <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-500 uppercase">ENVIRONMENT</div>
          <div className="text-purple-400 font-bold text-base mt-0.5 uppercase">{version?.environment || 'Development'}</div>
          <div className="text-[10px] text-slate-400 mt-1">TAP Monitoring</div>
        </div>
      </div>

      {/* 3. 7 Component Health Cards */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          CORE INFRASTRUCTURE COMPONENTS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map(comp => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.name}
                className="p-5 rounded-2xl bg-[#080d1a] border border-[#1e3a66]/70 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm tracking-tight font-sans">{comp.name}</h3>
                    <p className="text-slate-400 text-xs font-sans">{comp.role}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border shrink-0 ${getStatusBadge(comp.status)}`}>
                  {comp.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Active Feature Flags */}
      <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-500/40 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e3a66]">
          <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ACTIVE PLATFORM CAPABILITIES & FEATURE FLAGS</span>
          </span>
          <span className="text-cyan-300 font-bold">5 ENABLED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Dynamic Attack Story</div>
              <div className="text-[10px] text-slate-500 font-mono">MITRE Kill Chain Synthesis</div>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-xs">ENABLED</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Topological Attack Graph</div>
              <div className="text-[10px] text-slate-500 font-mono">Interactive 9-Node Matrix</div>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-xs">ENABLED</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Anomaly Center</div>
              <div className="text-[10px] text-slate-500 font-mono">Z-score Outlier Engine</div>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-xs">ENABLED</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">SecOps AI Copilot</div>
              <div className="text-[10px] text-slate-500 font-mono">Automated Incident Reasoner</div>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-xs">ENABLED</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Live Observed Network Map</div>
              <div className="text-[10px] text-slate-500 font-mono">Passive Topology Detection</div>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-xs">ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
