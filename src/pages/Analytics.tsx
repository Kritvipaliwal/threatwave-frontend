import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, ShieldAlert, Activity, PieChart as PieIcon, 
  Clock, Zap 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');

  // Chart datasets mapped to time range
  const trendData = {
    '24H': [
      { time: '00:00', threats: 42, blocked: 38, anomaly: 6 },
      { time: '04:00', threats: 68, blocked: 62, anomaly: 12 },
      { time: '08:00', threats: 124, blocked: 110, anomaly: 28 },
      { time: '12:00', threats: 210, blocked: 195, anomaly: 45 },
      { time: '16:00', threats: 185, blocked: 172, anomaly: 35 },
      { time: '20:00', threats: 155, blocked: 148, anomaly: 22 },
      { time: 'Now', threats: 190, blocked: 180, anomaly: 30 }
    ],
    '7D': [
      { time: 'Mon', threats: 940, blocked: 890, anomaly: 140 },
      { time: 'Tue', threats: 1240, blocked: 1180, anomaly: 190 },
      { time: 'Wed', threats: 1680, blocked: 1590, anomaly: 280 },
      { time: 'Thu', threats: 1420, blocked: 1360, anomaly: 210 },
      { time: 'Fri', threats: 2100, blocked: 1990, anomaly: 340 },
      { time: 'Sat', threats: 880, blocked: 850, anomaly: 110 },
      { time: 'Sun', threats: 760, blocked: 730, anomaly: 95 }
    ],
    '30D': [
      { time: 'Week 1', threats: 6200, blocked: 5900, anomaly: 850 },
      { time: 'Week 2', threats: 8400, blocked: 8100, anomaly: 1200 },
      { time: 'Week 3', threats: 7800, blocked: 7500, anomaly: 980 },
      { time: 'Week 4', threats: 9100, blocked: 8800, anomaly: 1350 }
    ]
  }[timeRange];

  const categoryData = [
    { name: 'SQL Injection', value: 34, color: '#f43f5e' },
    { name: 'SSH Brute Force', value: 28, color: '#f59e0b' },
    { name: 'Port Scanning', value: 18, color: '#00f2fe' },
    { name: 'DDoS SYN Flood', value: 12, color: '#38bdf8' },
    { name: 'Phishing / Malware', value: 8, color: '#a855f7' }
  ];

  const vectorStats = [
    { vector: 'Port 80/443 (HTTP/S)', count: '1,420 attacks', trend: '+12%', color: 'text-rose-400' },
    { vector: 'Port 22 (SSH Auth)', count: '890 attacks', trend: '-4%', color: 'text-amber-400' },
    { vector: 'Port 5432 (PostgreSQL)', count: '410 attacks', trend: '+18%', color: 'text-rose-400' },
    { vector: 'Port 445 (SMB Probe)', count: '280 attacks', trend: '-2%', color: 'text-sky-400' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> EXECUTIVE CYBER INTELLIGENCE
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">TELEMETRY AGGREGATION</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Security Telemetry & Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Holistic attack distribution, mean time to detect (MTTD), automated containment efficacy, and protocol trends.
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-[#1e3a66] font-mono text-xs self-start md:self-auto">
          {(['24H', '7D', '30D'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === range
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">DETECTION RATE</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">99.4%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero false negatives</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">AVG CONTAINMENT TIME</span>
          <div className="text-2xl font-extrabold text-cyan-300 mt-1">2.4 mins</div>
          <span className="text-[10px] text-slate-400 mt-1 block">SOAR playbook speed</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">BLOCKED PACKET RATIO</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">94.8%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Firewall drop rate</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">THREAT TREND</span>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">+14.2%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ingress volume rise</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Ingestion & Block Trend Area Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
            <span className="text-white font-bold uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Threat Ingress vs. Automated Containment ({timeRange})</span>
            </span>
            <span className="text-cyan-300 text-[10px] font-bold">TELEMETRY METRICS</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a66" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1527', borderColor: '#1e3a66', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="threats" name="Ingress Threats" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#threatsGrad)" />
                <Area type="monotone" dataKey="blocked" name="SOAR Blocked" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#blockedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Category Breakdown Pie Chart */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
            <span className="text-white font-bold uppercase flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-rose-400" />
              <span>Attack Vectors</span>
            </span>
            <span className="text-rose-400 text-[10px] font-bold">SPECTRUM</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#1e3a66', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-300">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Attack Vectors & Target Ports Table */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] font-mono text-xs space-y-3">
        <span className="text-white font-bold uppercase tracking-wider block">
          Most Exploited Target Ports & Entry Vectors
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vectorStats.map((vec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold">{vec.vector}</div>
              <div className="text-base font-extrabold text-white">{vec.count}</div>
              <div className={`text-[10px] font-bold ${vec.color}`}>{vec.trend} past 24h</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
