import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Lock, Ban, Server } from 'lucide-react';

interface ActionApprovalModalProps {
  action: {
    title: string;
    target: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    reason: string;
    actionType: string;
  } | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const ActionApprovalModal: React.FC<ActionApprovalModalProps> = ({
  action,
  onApprove,
  onReject,
  onClose
}) => {
  const [analystNotes, setAnalystNotes] = useState<string>('Analyst verified against ThreatWave correlated attack story THR-1042.');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  if (!action) return null;

  const handleConfirm = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      onApprove();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#080d1a] border border-rose-500/50 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="font-extrabold text-sm uppercase tracking-wider">
              ANALYST CONTAINMENT APPROVAL
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-xs font-sans">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Analyst Verification Required:</strong> ThreatWave never executes destructive containment playbooks autonomously. Explicit authorization is logged in the SOC audit trail.
          </span>
        </div>

        {/* Action Details */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Playbook Action:</span>
            <span className="text-rose-400 font-extrabold">{action.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Target Asset / IP:</span>
            <span className="text-cyan-300 font-extrabold">{action.target}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Severity Priority:</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 text-[10px]">
              {action.priority}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-900 text-slate-300 font-sans leading-relaxed text-[11px]">
            <strong className="text-slate-400 font-mono text-[10px] block mb-0.5">TRIGGER REASON:</strong>
            {action.reason}
          </div>
        </div>

        {/* Analyst Sign-off Note */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase font-bold">
            Analyst Authorization Notes:
          </label>
          <input
            type="text"
            value={analystNotes}
            onChange={e => setAnalystNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onReject}
            disabled={isExecuting}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>REJECT ACTION</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={isExecuting}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-black shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-red-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'EXECUTING SOAR...' : 'APPROVE ACTION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionApprovalModal;
