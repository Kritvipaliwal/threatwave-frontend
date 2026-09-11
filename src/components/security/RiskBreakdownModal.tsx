import React from 'react';
import { X, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { RISK_SCORE_FACTORS } from '../../data/demoData';

interface RiskBreakdownModalProps {
  score: number;
  onClose: () => void;
}

export const RiskBreakdownModal: React.FC<RiskBreakdownModalProps> = ({ score, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080d1a] border border-cyan-400 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e3a66] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                ENTERPRISE RISK POSTURE BREAKDOWN
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Dynamic weighted multi-factor calculation based on real-time network telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Score Header */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">AGGREGATE RISK INDEX</div>
            <div className="text-3xl font-black text-rose-400">{score} / 100</div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            CRITICAL EXPOSURE
          </span>
        </div>

        {/* 6 Factors Table */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            6 EVALUATED RISK PARAMETERS
          </div>

          {RISK_SCORE_FACTORS.map((f, i) => (
            <div
              key={f.factor}
              className="p-3 rounded-xl bg-slate-900/70 border border-[#1e3a66]/50 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">#{i + 1}</span>
                  <span className="text-white font-extrabold">{f.factor}</span>
                  <span className="text-[10px] text-slate-500">(Weight {(f.weight * 100).toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    f.impact === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {f.impact}
                  </span>
                  <span className="text-cyan-300 font-extrabold text-sm">{f.score}</span>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate-400">
                {f.description}
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full"
                  style={{ width: `${f.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Remediation Summary */}
        <div className="p-3 rounded-xl bg-[#09152b] border border-cyan-500/30 text-xs font-sans text-slate-300 leading-relaxed flex items-center justify-between gap-3">
          <div>
            <strong className="text-cyan-300 font-mono text-[11px] block uppercase">
              Remediation Impact Forecast:
            </strong>
            Containing active host <span className="text-white font-mono">10.0.1.50</span> and null-routing adversary IP will recover risk score to <span className="text-emerald-400 font-mono font-bold">24 / 100 (LOW)</span>.
          </div>
          <button
            onClick={onClose}
            className="shrink-0 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold font-mono text-xs cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskBreakdownModal;
