import React, { useState } from 'react';
import { 
  GitCommit, ArrowDown, Brain, ShieldAlert, Sparkles, ExternalLink, 
  CheckCircle2, Clock, Terminal, ChevronRight, Eye
} from 'lucide-react';
import { DEMO_ATTACK_STORY, AttackStoryStep } from '../../data/demoData';

interface AttackStoryPanelProps {
  onSelectStep?: (step: AttackStoryStep) => void;
  onNavigateToGraph?: () => void;
}

export const AttackStoryPanel: React.FC<AttackStoryPanelProps> = ({ 
  onSelectStep,
  onNavigateToGraph 
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>(DEMO_ATTACK_STORY.steps[2].id);
  const story = DEMO_ATTACK_STORY;

  const activeStep = story.steps.find(s => s.id === selectedStepId) || story.steps[2];

  const getSeverityBadge = (sev: string) => {
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

  return (
    <div className="p-5 rounded-2xl bg-[#091224] border border-cyan-500/30 shadow-2xl font-mono">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e3a66]/60 pb-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-white font-extrabold text-sm tracking-wider uppercase">
              ATTACK STORY — {story.code}
            </h2>
            <span className="text-slate-500">•</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-400" />
              AI CORRELATED INCIDENT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Adversary kill-chain narrative correlated from continuous passive packet telemetry across 4 network segments.
          </p>
        </div>

        {onNavigateToGraph && (
          <button
            onClick={onNavigateToGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View in Attack Graph</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vertical Timeline Steps */}
        <div className="lg:col-span-7 space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {story.steps.map((step, idx) => {
            const isSelected = selectedStepId === step.id;
            const isLast = idx === story.steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => {
                    setSelectedStepId(step.id);
                    if (onSelectStep) onSelectStep(step);
                  }}
                  className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_16px_rgba(0,242,254,0.2)] scale-[1.01]'
                      : 'bg-[#0a1426] border-[#1e3a66]/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-cyan-400 text-xs">{step.timestamp}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-bold text-white text-xs">{step.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(step.severity)}`}>
                      {step.severity}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans line-clamp-1 mb-2">
                    {step.description}
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800 text-slate-400">
                    <div>
                      Stage: <span className="text-cyan-300 font-bold">{step.stage}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <span>Conf: {step.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                {!isLast && (
                  <div className="flex items-center justify-center py-0.5 text-slate-600">
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-500/50 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Column: Step Inspection Spotlight */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-[#1e3a66] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              STAGE EVIDENCE INSPECTION
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeStep.timestamp} UTC
            </span>
          </div>

          <div>
            <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider mb-0.5">
              {activeStep.stage}
            </div>
            <div className="text-sm font-extrabold text-white">
              {activeStep.title}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
            {activeStep.description}
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#070d1a] border border-[#1e3a66]/60 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Forensic Evidence Signal:</div>
              <div className="text-cyan-300 font-mono text-xs">{activeStep.evidence}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Source IP:</span>
                <span className="text-rose-400 font-bold truncate block">{activeStep.source}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Target Asset:</span>
                <span className="text-cyan-300 font-bold truncate block">{activeStep.target}</span>
              </div>
            </div>
          </div>

          {/* AI Narrative Synthesis */}
          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 text-[11px] font-sans text-purple-200 leading-relaxed">
            <strong className="text-purple-300 font-mono text-[10px] block mb-0.5 uppercase tracking-wider">
              ✦ AI Correlation Synthesis:
            </strong>
            Adversary transitioned from reconnaissance probe to weaponized exploit within 120 seconds. Confidence score {activeStep.confidence}% with MITRE ATT&CK kill-chain continuity.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackStoryPanel;
