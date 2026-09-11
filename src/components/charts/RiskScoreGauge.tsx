import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RISK_SCORE_FACTORS, RiskFactor } from '../../data/demoData';

interface RiskScoreGaugeProps {
  score?: number;
  onOpenBreakdown?: () => void;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ 
  score = 91, 
  onOpenBreakdown 
}) => {
  const [displayScore, setDisplayScore] = useState<number>(score);

  // Smooth counter animation
  useEffect(() => {
    let start = displayScore;
    const end = score;
    if (start === end) return;

    const stepTime = 20;
    const diff = end - start;
    const steps = 15;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const current = Math.round(start + (diff * stepCount) / steps);
      setDisplayScore(current);
      if (stepCount >= steps) {
        clearInterval(timer);
        setDisplayScore(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Risk Tier classification
  const getTier = (s: number) => {
    if (s >= 85) return { label: 'CRITICAL', color: 'text-rose-500', stroke: '#f43f5e', bg: 'bg-rose-500/20', border: 'border-rose-500/40' };
    if (s >= 70) return { label: 'HIGH', color: 'text-orange-500', stroke: '#f97316', bg: 'bg-orange-500/20', border: 'border-orange-500/40' };
    if (s >= 40) return { label: 'MEDIUM', color: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/20', border: 'border-amber-500/40' };
    return { label: 'LOW', color: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' };
  };

  const tier = getTier(displayScore);

  // SVG Radial Circle calculation
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (displayScore / 100) * circumference;

  return (
    <div 
      onClick={onOpenBreakdown}
      className="p-5 rounded-2xl bg-[#091224] border border-[#1e3a66]/70 shadow-xl font-mono cursor-pointer group hover:border-cyan-400/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between border-b border-[#1e3a66]/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-white font-extrabold text-xs uppercase tracking-wider">
            ENTERPRISE RISK SCORE
          </span>
        </div>
        <button
          className="text-[10px] text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 font-bold"
          title="Inspect risk factors"
        >
          <span>Breakdown</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial SVG Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#0f1d38"
              strokeWidth={strokeWidth}
            />
            {/* Animated Dynamic Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={tier.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${tier.stroke})` }}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white tracking-tight">
              {displayScore}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              / 100
            </span>
            <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest ${tier.bg} ${tier.color} ${tier.border} border`}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* 6 Factors Summary */}
        <div className="flex-1 w-full space-y-2 text-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            WEIGHTED RISK FACTORS
          </div>
          {RISK_SCORE_FACTORS.slice(0, 4).map((f) => (
            <div key={f.factor} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 truncate max-w-[150px]">{f.factor}:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
                <span className="text-white font-extrabold text-[10px] w-6 text-right">{f.score}</span>
              </div>
            </div>
          ))}
          <div className="pt-1 text-[10px] text-cyan-400 flex items-center justify-end gap-1 font-bold">
            <span>+ 2 additional impact factors →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
