import React, { useState, useEffect } from 'react';
import { 
  Radio, Cpu, Layers, GitMerge, Network, FileText, Brain, ShieldCheck, 
  ArrowRight, Activity, Sparkles, CheckCircle2
} from 'lucide-react';
import { SECURITY_PIPELINE_STAGES, SecurityPipelineStage } from '../../data/demoData';
import { useRealtime } from '../../hooks/useRealtime';
import { useDemoEngine } from '../../demo/useDemoEngine';

interface SecurityPipelineVisualProps {
  onSelectStage?: (stage: SecurityPipelineStage) => void;
}

export const SecurityPipelineVisual: React.FC<SecurityPipelineVisualProps> = ({ onSelectStage }) => {
  const { stats } = useRealtime();
  const { state } = useDemoEngine();
  const [activeStageIdx, setActiveStageIdx] = useState<number>(3); // Detection active
  const [particleOffset, setParticleOffset] = useState<number>(0);

  // Periodic particle progress along pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleOffset(prev => (prev + 1) % SECURITY_PIPELINE_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const getStageIcon = (idx: number) => {
    switch (idx) {
      case 0: return Activity;
      case 1: return Radio;
      case 2: return Cpu;
      case 3: return Layers;
      case 4: return GitMerge;
      case 5: return Network;
      case 6: return FileText;
      case 7: return Brain;
      case 8: return ShieldCheck;
      default: return Activity;
    }
  };

  return (
    <div className="relative p-5 rounded-2xl bg-[#070d1c] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.08)] overflow-hidden">
      {/* Glow Ambient */}
      <div className="absolute top-0 right-1/3 w-64 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Visual Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1e3a66]/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-white font-extrabold tracking-wider">THREATWAVE DETECTION PIPELINE</span>
              <span className="text-slate-500">•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                END-TO-END ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Zero-Loss SPAN Tap → Passive Scapy Telemetry → 6-Vector Features → Tri-Engine Detection → Bayesian Fusion → Correlation Story
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">FLOW VELOCITY:</span>
            <span className="text-white font-extrabold">
              {stats.packetsPerSec > 0
                ? `${Math.round(stats.packetsPerSec).toLocaleString()} PKTS/S`
                : (state.liveLabMode ? '0 PKTS/S' : '4,280 PKTS/S')}
            </span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">AVG PIPELINE LATENCY:</span>
            <span className="text-emerald-400 font-bold">&lt; 3.8ms</span>
          </div>
        </div>
      </div>

      {/* Horizontal Pipeline Grid */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[1040px] flex items-center justify-between gap-1.5 relative">
          {SECURITY_PIPELINE_STAGES.map((stage, idx) => {
            const Icon = getStageIcon(idx);
            const isHighlighted = particleOffset === idx;
            const isLast = idx === SECURITY_PIPELINE_STAGES.length - 1;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Node */}
                <div
                  onClick={() => {
                    setActiveStageIdx(idx);
                    if (onSelectStage) onSelectStage(stage);
                  }}
                  className={`relative flex-1 p-3 rounded-xl border transition-all duration-300 cursor-pointer group select-none ${
                    isHighlighted
                      ? 'bg-gradient-to-b from-[#112347] to-[#0a152d] border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.35)] scale-[1.02]'
                      : activeStageIdx === idx
                        ? 'bg-[#0f1d38] border-cyan-500/60 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                        : 'bg-[#0a1324] border-[#1e3a66]/60 hover:border-slate-600 hover:bg-[#0c1830]'
                  }`}
                >
                  {/* Top indicator pin */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isHighlighted 
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,242,254,0.8)]' 
                        : 'bg-slate-900 border border-[#1e3a66] text-cyan-400 group-hover:text-white'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Node Title & Engine */}
                  <div className="font-mono font-extrabold text-xs text-white tracking-tight truncate">
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-cyan-300/80 font-mono truncate mb-2">
                    {stage.engine}
                  </div>

                  {/* Live Metric Badge */}
                  <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-[10px] space-y-0.5">
                    <div className="text-slate-400 text-[9px] uppercase tracking-wider">{stage.metricLabel}</div>
                    <div className="text-white font-extrabold text-[11px] truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span>{stage.metricValue}</span>
                    </div>
                  </div>

                  {/* Animated Traveling glowing badge when particle reaches this node */}
                  {isHighlighted && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[9px] font-mono font-black text-black shadow-lg animate-bounce uppercase">
                      Active Pulse
                    </div>
                  )}
                </div>

                {/* Arrow Connector between stages */}
                {!isLast && (
                  <div className="shrink-0 flex items-center justify-center px-1 text-slate-600">
                    <div className="relative flex items-center">
                      <ArrowRight className={`w-3.5 h-3.5 transition-colors ${
                        particleOffset === idx ? 'text-cyan-400 animate-pulse scale-125' : 'text-slate-600'
                      }`} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SecurityPipelineVisual;
