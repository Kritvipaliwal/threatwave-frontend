import React from 'react';
import { X } from 'lucide-react';
import { ThreatProfile } from '../../data/demoData';
import { EvidencePanel } from '../attack/EvidencePanel';

interface EvidenceModalProps {
  threat: ThreatProfile | null;
  onClose: () => void;
  onActionContain?: (threat: ThreatProfile) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  threat,
  onClose,
  onActionContain
}) => {
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#080d1a] border border-cyan-400 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <EvidencePanel
          threat={threat}
          onClose={onClose}
          onActionContain={() => {
            if (onActionContain) onActionContain(threat);
          }}
        />
      </div>
    </div>
  );
};

export default EvidenceModal;
