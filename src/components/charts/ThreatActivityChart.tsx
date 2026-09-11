import React, { useState } from 'react';
import { BarChart3, Filter, ShieldAlert } from 'lucide-react';

interface ThreatDataPoint {
  label: string;
  bruteForce: number;
  portScan: number;
  sqlInjection: number;
  phishing: number;
  malware: number;
  dnsAnomaly: number;
  dataExfil: number;
  anomalousBehavior: number;
}

const GENERATE_CATEGORY_DATA = (range: '1H' | '6H' | '24H' | '7D'): ThreatDataPoint[] => {
  const points: ThreatDataPoint[] = [];
  const count = range === '1H' ? 6 : range === '6H' ? 6 : range === '24H' ? 8 : 7;

  for (let i = 0; i < count; i++) {
    let label = '';
    if (range === '1H') label = `${(i + 1) * 10}m`;
    else if (range === '6H') label = `H-${6 - i}`;
    else if (range === '24H') label = `${i * 3}h`;
    else label = `Day ${i + 1}`;

    const mult = range === '7D' ? 14 : range === '24H' ? 4 : 1;

    points.push({
      label,
      portScan: Math.floor((12 + Math.sin(i * 1.2) * 5) * mult),
      sqlInjection: Math.floor((8 + Math.cos(i * 0.9) * 4) * mult),
      bruteForce: Math.floor((10 + Math.sin(i * 0.7) * 4) * mult),
      phishing: Math.floor((6 + Math.cos(i * 1.1) * 3) * mult),
      malware: Math.floor((4 + Math.sin(i * 1.5) * 3) * mult),
      dnsAnomaly: Math.floor((9 + Math.cos(i * 0.5) * 4) * mult),
      dataExfil: Math.floor((3 + (i === count - 2 ? 8 : 1)) * mult),
      anomalousBehavior: Math.floor((7 + Math.sin(i * 0.8) * 3) * mult)
    });
  }

  return points;
};

const CATEGORIES = [
  { key: 'portScan', name: 'Port Scanning', color: '#00f2fe' },
  { key: 'sqlInjection', name: 'SQL Injection', color: '#f43f5e' },
  { key: 'bruteForce', name: 'Brute Force', color: '#f59e0b' },
  { key: 'phishing', name: 'Phishing', color: '#38bdf8' },
  { key: 'malware', name: 'Malware', color: '#e11d48' },
  { key: 'dnsAnomaly', name: 'DNS Anomaly', color: '#a855f7' },
  { key: 'dataExfil', name: 'Data Exfiltration', color: '#ec4899' },
  { key: 'anomalousBehavior', name: 'Anomalous Behavior', color: '#10b981' }
] as const;

export const ThreatActivityChart: React.FC = () => {
  const [range, setRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const data = GENERATE_CATEGORY_DATA(range);

  // Calculate totals per category
  const totals = CATEGORIES.map(cat => {
    const total = data.reduce((acc, curr) => acc + (curr[cat.key as keyof ThreatDataPoint] as number), 0);
    return { ...cat, total };
  });

  const maxCategoryTotal = Math.max(...totals.map(t => t.total), 10);

  return (
    <div className="p-5 rounded-2xl bg-[#091224] border border-[#1e3a66]/70 shadow-xl font-mono">
      {/* Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>THREAT ACTIVITY OVER TIME</span>
            <span className="text-slate-500">•</span>
            <span className="text-[10px] text-cyan-300 font-normal">8 CORE VECTORS</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Historical distribution breakdown of detected multi-vector attack events across time horizons.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['1H', '6H', '24H', '7D'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                range === r
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Threat Category Bar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {totals.map(cat => {
          const isFiltered = activeCategory && activeCategory !== cat.key;
          const pct = Math.min(100, Math.round((cat.total / maxCategoryTotal) * 100));

          return (
            <div
              key={cat.key}
              onClick={() => setActiveCategory(prev => prev === cat.key ? null : cat.key)}
              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_16px_rgba(0,242,254,0.25)]'
                  : isFiltered
                    ? 'bg-[#0a1426]/50 border-slate-900 opacity-40'
                    : 'bg-[#0c162b] border-[#1e3a66]/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-extrabold text-white text-[11px] truncate">
                    {cat.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-slate-200">
                  {cat.total}
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                    boxShadow: `0 0 8px ${cat.color}`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>{pct}% of max</span>
                <span className="text-cyan-400 uppercase">ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Trend Matrix */}
      <div className="mt-4 pt-4 border-t border-[#1e3a66]/50">
        <div className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
          <span>Temporal Density Matrix ({range})</span>
          <span className="text-cyan-400 font-normal">Click a category above to isolate</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {data.map((pt, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-950/80 border border-slate-900 text-center">
              <div className="text-[10px] text-slate-400 font-mono mb-1">{pt.label}</div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-cyan-300">
                  {pt.portScan + pt.sqlInjection + pt.bruteForce + pt.malware}
                </div>
                <div className="text-[9px] text-slate-400">events</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatActivityChart;
