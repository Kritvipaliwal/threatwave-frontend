import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, TrendingUp, Zap, BarChart2, ShieldAlert,
  ArrowUpRight, Clock, Target, Layers, CheckCircle2, Filter, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { AnomalyMetricItem, Severity } from '../types';

const INITIAL_ANOMALIES: AnomalyMetricItem[] = [
  {
    id: 'anom-01',
    title: 'Connection Rate Burst (Z-Score Spike)',
    metricType: 'CONNECTION_BURST',
    expected: '18 conns/min (rolling mean)',
    observed: '74 conns/min (burst peak)',
    deviation: '+311%',
    detectionMethod: 'STATISTICAL',
    confidence: 94,
    risk: 'CRITICAL',
    timestamp: '10:41:08 UTC',
    targetAsset: 'SRV-PROD-WEB01 (192.168.1.50)',
    sourceIp: '185.220.101.5',
    details: 'Sliding 60-second window detected connection frequency surge exceeding 3.8 standard deviations above baseline.',
    timeSeriesData: [
      { time: '10:35', expected: 18, observed: 19 },
      { time: '10:36', expected: 18, observed: 17 },
      { time: '10:37', expected: 18, observed: 21 },
      { time: '10:38', expected: 19, observed: 20 },
      { time: '10:39', expected: 18, observed: 24 },
      { time: '10:40', expected: 19, observed: 52 },
      { time: '10:41', expected: 18, observed: 74 },
    ]
  },
  {
    id: 'anom-02',
    title: 'Outbound Encrypted Egress Data Spike',
    metricType: 'EGRESS_VOLUME',
    expected: '15.4 KB/min',
    observed: '142.6 MB (burst payload)',
    deviation: '+925,870%',
    detectionMethod: 'STATISTICAL',
    confidence: 98,
    risk: 'CRITICAL',
    timestamp: '10:41:44 UTC',
    targetAsset: 'DB-CLUSTER-MASTER (192.168.1.100)',
    sourceIp: '185.220.101.5',
    details: 'Anomalous egress TLS transfer directed to external threat actor sink. Volume correlates with full database table staging.',
    timeSeriesData: [
      { time: '10:35', expected: 15, observed: 16 },
      { time: '10:36', expected: 15, observed: 14 },
      { time: '10:37', expected: 16, observed: 18 },
      { time: '10:38', expected: 15, observed: 15 },
      { time: '10:39', expected: 15, observed: 32 },
      { time: '10:40', expected: 16, observed: 120 },
      { time: '10:41', expected: 15, observed: 142600 },
    ]
  },
  {
    id: 'anom-03',
    title: 'Direct Database Ingress Segmentation Violation',
    metricType: 'BASELINE',
    expected: 'Private Subnet Only (192.168.1.0/24)',
    observed: 'External Public IP Ingress (Port 5432)',
    deviation: 'Boundary Violation',
    detectionMethod: 'BASELINE',
    confidence: 96,
    risk: 'HIGH',
    timestamp: '10:41:35 UTC',
    targetAsset: 'DB-CLUSTER-MASTER (192.168.1.100:5432)',
    sourceIp: '185.220.101.5',
    details: 'PostgreSQL listening port received direct unauthenticated connection packets bypassing the DMZ reverse proxy tier.'
  },
  {
    id: 'anom-04',
    title: 'High Entropy DNS Domain Resolution',
    metricType: 'DNS',
    expected: '< 3.2 bits entropy',
    observed: '4.82 bits (dga-c2.internal-update.biz)',
    deviation: '+50.6%',
    detectionMethod: 'HEURISTIC',
    confidence: 91,
    risk: 'HIGH',
    timestamp: '10:41:02 UTC',
    targetAsset: 'EDGE-GATEWAY-01 (192.168.1.1:53)',
    sourceIp: '192.168.1.50',
    details: 'Shannon entropy analysis on outbound query string matches Domain Generation Algorithm (DGA) C2 infrastructure.'
  },
  {
    id: 'anom-05',
    title: 'Sensitive Service Port Discovery Burst',
    metricType: 'PORT',
    expected: 'Standard ports 80, 443',
    observed: 'Probing ports 22, 3389, 5432, 8080',
    deviation: '+400% port diversity',
    detectionMethod: 'STATISTICAL',
    confidence: 89,
    risk: 'MEDIUM',
    timestamp: '10:40:54 UTC',
    targetAsset: 'SRV-PROD-WEB01 (192.168.1.50)',
    sourceIp: '185.220.101.5',
    details: 'Vertical port sweep targeting enterprise administration and backend database ports from single source.'
  }
];

export const AnomalyCenter: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyMetricItem[]>(INITIAL_ANOMALIES);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyMetricItem>(INITIAL_ANOMALIES[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const getRiskBadge = (sev: Severity) => {
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

  const filtered = anomalies.filter(a => {
    if (filterType === 'ALL') return true;
    return a.detectionMethod === filterType || a.metricType === filterType;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              STATISTICAL & BASELINE ENGINE
            </span>
            <span>•</span>
            <span className="text-rose-400 font-bold">5 ACTIVE OUTLIERS DETECTED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            SOC Anomaly Center & Baseline Deviations
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5 max-w-3xl">
            Continuous real-time detection evaluating rolling Poisson distributions, Z-score deviations, and strict asset segmentation boundaries.
          </p>
        </div>

        {/* Live Stat Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
            <div className="text-rose-400 font-black text-xl">+311%</div>
            <div className="text-[10px] text-slate-400 uppercase">Max Burst Rate</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[110px]">
            <div className="text-cyan-400 font-black text-xl">Z = 4.82</div>
            <div className="text-[10px] text-slate-400 uppercase">Peak Z-Score</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#091224] border border-[#1e3a66] font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'STATISTICAL', 'BASELINE', 'HEURISTIC', 'CONNECTION_BURST', 'EGRESS_VOLUME', 'DNS'].map(f => (
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
        <div className="text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> anomalies
        </div>
      </div>

      {/* 3. Main Anomaly Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Anomalies */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map(anom => {
            const isSelected = selectedAnomaly.id === anom.id;

            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0e1c36] border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                    : 'bg-[#080d1a] border-[#1e3a66]/70 hover:border-cyan-500/50 hover:bg-[#0b1426]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                      <Zap className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm tracking-tight">{anom.title}</h3>
                      <div className="font-mono text-xs text-slate-400">{anom.targetAsset}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getRiskBadge(anom.risk)}`}>
                      {anom.risk} RISK
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] font-bold">
                      {anom.detectionMethod}
                    </span>
                  </div>
                </div>

                {/* Structured Expected vs Observed Table */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">EXPECTED (BASELINE)</div>
                    <div className="text-slate-300 font-semibold mt-0.5">{anom.expected}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">OBSERVED TELEMETRY</div>
                    <div className="text-rose-400 font-bold mt-0.5">{anom.observed}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">STATISTICAL DEVIATION</div>
                    <div className="text-amber-300 font-extrabold mt-0.5 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{anom.deviation}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  {anom.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Time-Series Chart */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-500/40 shadow-xl space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a66]">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>DEVIATION TELEMETRY</span>
              </span>
              <span className="text-cyan-300 font-bold">{selectedAnomaly.confidence}% CONFIDENCE</span>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">INSPECTED SIGNAL</div>
              <div className="font-bold text-white text-base tracking-tight font-sans mt-0.5">
                {selectedAnomaly.title}
              </div>
            </div>

            {/* Time-Series Chart if data present */}
            {selectedAnomaly.timeSeriesData && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                  <span>BASELINE VS. OBSERVED CURVE</span>
                  <span className="text-rose-400 font-bold">OUTLIER SPIKE</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedAnomaly.timeSeriesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="anomSpike" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#091224', borderColor: '#1e3a66', fontSize: 11, borderRadius: 8 }} />
                      <Area type="monotone" dataKey="expected" stroke="#06b6d4" fill="none" strokeWidth={1.5} strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="observed" stroke="#f43f5e" fillOpacity={1} fill="url(#anomSpike)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs">
              <div className="font-mono text-[10px] text-slate-400 uppercase">ANALYST CORROBORATION</div>
              <div className="text-slate-300 leading-relaxed">
                Detected via <strong className="text-cyan-300 font-mono">{selectedAnomaly.detectionMethod}</strong> mathematical evaluation.
                Source endpoint <strong className="text-white font-mono">{selectedAnomaly.sourceIp}</strong> is flagged in Incident THR-1042.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyCenter;
