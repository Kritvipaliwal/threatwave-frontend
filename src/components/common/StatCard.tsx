import React, { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'cyan' | 'crimson' | 'amber' | 'emerald' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix = '',
  subtitle,
  icon: Icon,
  accentColor,
  onClick
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(value);
  const [pulsing, setPulsing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof value === 'number' && typeof displayValue === 'number') {
      if (value !== displayValue) {
        setPulsing(true);
        const timer = setTimeout(() => setPulsing(false), 800);
        // Smooth count animation
        const diff = value - displayValue;
        const steps = 10;
        let stepCount = 0;
        const interval = setInterval(() => {
          stepCount++;
          if (stepCount >= steps) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            setDisplayValue(Math.round((displayValue as number) + (diff * (stepCount / steps))));
          }
        }, 30);
        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        };
      }
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorStyles = {
    cyan: {
      border: 'hover:border-cyan-400/50',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(0,242,254,0.25)]',
      topLine: 'bg-cyan-400'
    },
    crimson: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      topLine: 'bg-rose-500'
    },
    amber: {
      border: 'hover:border-amber-400/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      topLine: 'bg-amber-400'
    },
    emerald: {
      border: 'hover:border-emerald-400/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      topLine: 'bg-emerald-400'
    },
    purple: {
      border: 'hover:border-purple-400/50',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      topLine: 'bg-purple-400'
    }
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/70 transition-all duration-300 ${
        pulsing ? `${colorStyles.glow} border-current scale-[1.02]` : ''
      } ${colorStyles.border} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${colorStyles.topLine}`} />
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            {label}
          </span>
          <div className="text-2xl font-extrabold font-mono tracking-tight text-white mt-1">
            {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
            <span className="text-sm font-normal text-slate-400 ml-1">{suffix}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
            {subtitle}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
