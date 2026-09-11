import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Layers, Sparkles, 
  Terminal, ArrowRight, Hash, Globe, Clock
} from 'lucide-react';
import { ThreatProfile, CORE_THREAT_PROFILES } from '../../data/demoData';

interface EvidencePanelProps {
  threat?: ThreatProfile;
  onClose?: () => void;
  onActionContain?: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  threat = CORE_THREAT_PROFILES[1], // Default to SQL Injection
  onClose,
  onActionContain
}) => {
  const { metrics, evidencePoints, metadata } = threat;

  // Confidence ring renderer
  const renderConfidenceRing = (label: string, value: number, color: string, sub: string) => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;

    return (
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center font-mono space-y-1">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r={r} fill="transparent" stroke="#0a1426" strokeWidth="6" />
            <circle
              cx="35"
              cy="35"
              r={r}
              fill="transparent"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-white">
            {value}%
          </span>
        </div>
        <div className="text-[10px] font-bold text-slate-300 uppercase truncate">{label}</div>
        <div className="text-[9px] text-slate-500 truncate">{sub}</div>
      </div>
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-[#080e1c] border border-cyan-400/40 shadow-2xl font-mono text-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e3a66] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
              {threat.severity}
            </span>
            <span className="text-white font-extrabold text-base tracking-tight">
              {threat.name}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 text-xs font-bold">Risk Score: {threat.riskScore}/100</span>
          </div>
          <div className="text-slate-400 text-xs font-sans">
            Source: <strong className="text-rose-400 font-mono">{threat.source}</strong> → Target: <strong className="text-cyan-300 font-mono">{threat.target}</strong>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer self-start sm:self-auto"
          >
            Close Panel
          </button>
        )}
      </div>

      {/* WHY THREATWAVE FLAGGED THIS Header */}
      <div>
        <h3 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>WHY THREATWAVE FLAGGED THIS</span>
        </h3>

        {/* 6 Checked Evidence Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {evidencePoints.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/80 border border-[#1e3a66]/60 flex items-start gap-2.5"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <span className="text-slate-200 text-xs font-sans leading-relaxed">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MULTI-ENGINE SIGNAL CONFIDENCE & FUSION (DETECTION TRANSPARENCY) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MULTI-ENGINE SIGNAL CONFIDENCE & FUSION BREAKDOWN
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-slate-400">False-Positive Prob:</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
              {threat.metrics.falsePositiveProb ?? 2.4}% (Very Low)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {renderConfidenceRing('Rule Match', metrics.ruleConfidence, '#f59e0b', 'OWASP/Suricata')}
          {renderConfidenceRing('Stat Anomaly', metrics.statisticalScore, '#a855f7', 'Poisson Z-Score')}
          {renderConfidenceRing('Baseline Drift', metrics.baselineConfidence ?? 91, '#ec4899', 'Sliding Median')}
          {renderConfidenceRing('ML Model', metrics.mlConfidence, '#00f2fe', 'Isolation Forest')}
          {renderConfidenceRing('Threat Intel', metrics.threatIntelConfidence ?? 78, '#3b82f6', 'Zeek/Spur Feed')}
          {renderConfidenceRing('Fused Score', metrics.fusedConfidence, '#10b981', 'Signal Fusion')}
        </div>
      </div>

      {/* Metadata 5-Tuple & Deep Packet Signatures */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>PASSIVE SENSOR PACKET METADATA (Scapy / tshark Tap)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Connection Frequency:</span>
            <span className="text-white font-bold">{metadata.connectionFrequency}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Baseline Deviation:</span>
            <span className="text-rose-400 font-bold">{metadata.baselineDeviation}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Target Port(s):</span>
            <span className="text-cyan-300 font-bold">{metadata.destinationPorts.join(', ')}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Detection Method:</span>
            <span className="text-emerald-400 font-bold">{threat.detectionMethod} PIPELINE</span>
          </div>
        </div>

        {metadata.ja3Fingerprint && (
          <div className="pt-2 border-t border-slate-900 text-[10px]">
            <span className="text-slate-500">TLS JA3 Fingerprint: </span>
            <span className="text-purple-300 font-mono">{metadata.ja3Fingerprint}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-[10px] text-slate-500 font-sans">
          SIH Demo Environment • All generated telemetry is safe synthetic data.
        </div>

        {onActionContain && (
          <button
            onClick={onActionContain}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Launch Analyst Containment Review</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EvidencePanel;
