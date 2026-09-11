import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, ShieldAlert, Clock, Info } from 'lucide-react';
import { GENERATE_NETWORK_SERIES } from '../../data/demoData';

interface DataPoint {
  time: string;
  normal: number;
  suspicious: number;
  threat: number;
  total: number;
  isAnomaly?: boolean;
}

export const LiveNetworkActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'15M' | '1H' | '6H' | '24H'>('15M');
  const [data, setData] = useState<DataPoint[]>(GENERATE_NETWORK_SERIES());
  const [hoverPoint, setHoverPoint] = useState<DataPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [highlightedAnomaly, setHighlightedAnomaly] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Periodic rolling data update to simulate live stream
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5);
      const normal = Math.floor(2100 + Math.sin(now.getTime() * 0.001) * 350 + Math.random() * 150);
      const suspicious = Math.floor(60 + Math.random() * 45);
      const isThreatSpike = Math.random() > 0.75;
      const threat = isThreatSpike ? Math.floor(140 + Math.random() * 80) : Math.floor(8 + Math.random() * 12);

      const newPt: DataPoint = {
        time: timeStr,
        normal,
        suspicious,
        threat,
        total: normal + suspicious + threat,
        isAnomaly: isThreatSpike
      };

      if (isThreatSpike) {
        setHighlightedAnomaly(true);
      }

      setData(prev => [...prev.slice(1), newPt]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const maxTotal = Math.max(...data.map(d => d.total), 3000);
  const currentTotal = data[data.length - 1]?.total || 2340;
  const peakTotal = Math.max(...data.map(d => d.total));

  // Compute SVG Points
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * chartW;
  const getY = (val: number) => height - paddingY - (val / maxTotal) * chartH;

  // Generate Area & Line SVG paths
  const normalPoints = data.map((d, i) => `${getX(i)},${getY(d.normal)}`);
  const suspiciousPoints = data.map((d, i) => `${getX(i)},${getY(d.normal + d.suspicious)}`);
  const threatPoints = data.map((d, i) => `${getX(i)},${getY(d.total)}`);

  const threatAreaPath = [
    `M ${getX(0)} ${height - paddingY}`,
    ...threatPoints.map(p => `L ${p}`),
    `L ${getX(data.length - 1)} ${height - paddingY} Z`
  ].join(' ');

  const normalAreaPath = [
    `M ${getX(0)} ${height - paddingY}`,
    ...normalPoints.map(p => `L ${p}`),
    `L ${getX(data.length - 1)} ${height - paddingY} Z`
  ].join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const clampedX = Math.max(paddingX, Math.min(width - paddingX, mouseX));
    const idx = Math.round(((clampedX - paddingX) / chartW) * (data.length - 1));
    const pt = data[idx];
    if (pt) {
      setHoverPoint(pt);
      setHoverPos({ x: getX(idx), y: getY(pt.total) });
    }
  };

  return (
    <div ref={containerRef} className="relative p-5 rounded-2xl bg-[#091224] border border-[#1e3a66]/70 shadow-xl overflow-hidden font-mono">
      {/* Glow highlight for anomaly */}
      {highlightedAnomaly && (
        <div className="absolute top-0 right-0 w-64 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-white font-extrabold text-sm tracking-wider uppercase">
              LIVE NETWORK ACTIVITY
            </h2>
            <span className="text-slate-500">•</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
              REAL-TIME FLOW
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Volumetric packet telemetry categorized by normal baseline, suspicious scans, and active threat signals.
          </p>
        </div>

        {/* Time range switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['15M', '1H', '6H', '24H'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase">CURRENT FLOW</div>
          <div className="text-lg font-extrabold text-cyan-300 tracking-tight flex items-baseline gap-1">
            <span>{currentTotal.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-normal">pkts/s</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase">PEAK ACTIVITY</div>
          <div className="text-lg font-extrabold text-amber-400 tracking-tight flex items-baseline gap-1">
            <span>{peakTotal.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-normal">pkts/s</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase">SUSPICIOUS RATIO</div>
          <div className="text-lg font-extrabold text-purple-300 tracking-tight flex items-baseline gap-1">
            <span>{((data[data.length - 1]?.suspicious / currentTotal) * 100).toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 font-normal">elevated</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase">ACTIVE THREAT PEAK</div>
          <div className="text-lg font-extrabold text-rose-400 tracking-tight flex items-baseline gap-1">
            <span>{Math.max(...data.map(d => d.threat))}</span>
            <span className="text-[10px] text-slate-400 font-normal">events/s</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-56 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPoint(null)}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#00f2fe" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.55" />
              <stop offset="80%" stopColor="#f43f5e" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={height - paddingY - frac * chartH}
              x2={width - paddingX}
              y2={height - paddingY - frac * chartH}
              stroke="rgba(30, 58, 102, 0.35)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Normal Traffic Area */}
          <path d={normalAreaPath} fill="url(#normalGrad)" />

          {/* Threat Traffic Layer Area */}
          <path d={threatAreaPath} fill="url(#threatGrad)" />

          {/* Normal Traffic Line */}
          <polyline
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2"
            points={normalPoints.join(' ')}
          />

          {/* Suspicious Traffic Line */}
          <polyline
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            points={suspiciousPoints.join(' ')}
          />

          {/* Threat Events Line */}
          <polyline
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            points={threatPoints.join(' ')}
          />

          {/* Anomaly Markers on Peaks */}
          {data.map((pt, idx) => {
            if (!pt.isAnomaly) return null;
            const cx = getX(idx);
            const cy = getY(pt.total);
            return (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="6" fill="#f43f5e" className="animate-ping" opacity="0.75" />
                <circle cx={cx} cy={cy} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                <text x={cx} y={cy - 10} fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ANOMALY
                </text>
              </g>
            );
          })}

          {/* Live Moving Sweep Indicator at the latest point */}
          <circle
            cx={getX(data.length - 1)}
            cy={getY(data[data.length - 1]?.total || 0)}
            r="5"
            fill="#00f2fe"
            stroke="#ffffff"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* Hover Crosshair & Pointer */}
          {hoverPoint && hoverPos && (
            <g>
              <line
                x1={hoverPos.x}
                y1={paddingY}
                x2={hoverPos.x}
                y2={height - paddingY}
                stroke="#00f2fe"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoverPos.x}
                cy={hoverPos.y}
                r="5"
                fill="#ffffff"
                stroke="#00f2fe"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverPoint && hoverPos && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-slate-950/95 border border-cyan-400 shadow-2xl text-[10px] space-y-1"
            style={{
              left: Math.min(hoverPos.x + 10, width - 180),
              top: Math.max(10, hoverPos.y - 80)
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400">
              <span>TIMESTAMP:</span>
              <span className="text-white font-bold">{hoverPoint.time} UTC</span>
            </div>
            <div className="flex items-center justify-between text-cyan-300">
              <span>Normal Traffic:</span>
              <span className="font-bold">{hoverPoint.normal.toLocaleString()} pkts/s</span>
            </div>
            <div className="flex items-center justify-between text-purple-300">
              <span>Suspicious Traffic:</span>
              <span className="font-bold">{hoverPoint.suspicious.toLocaleString()} pkts/s</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span>Threat Events:</span>
              <span className="font-bold">{hoverPoint.threat.toLocaleString()} ev/s</span>
            </div>
            {hoverPoint.isAnomaly && (
              <div className="text-rose-400 font-bold text-[9px] pt-0.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>SIGNIFICANT ANOMALY FLAGGED</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-[#1e3a66]/50 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-cyan-400 inline-block" />
            <span className="text-slate-300">Normal Traffic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-purple-400 inline-block" />
            <span className="text-slate-300">Suspicious Scans</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-slate-300">Threat Events</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time Scapy passive metadata tap • Synthetic telemetry</span>
        </div>
      </div>
    </div>
  );
};

export default LiveNetworkActivityChart;
