import React, { useState } from 'react';
import { 
  FileText, Download, Eye, Share2, RefreshCw, CheckCircle2, Clock, 
  ShieldCheck, AlertTriangle, Printer, X, Sparkles, Filter, Brain, 
  GitCommit, Layers, Terminal, Activity, ArrowRight, ShieldAlert
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { DEMO_ATTACK_STORY, CORE_THREAT_PROFILES, RISK_SCORE_FACTORS } from '../data/demoData';

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  frequency: string;
  description: string;
  lastGenerated: string;
  fileSize: string;
  format: string;
  accent: string;
  sections: string[];
}

const GENERATION_STAGES = [
  'COLLECTING EVIDENCE',
  'ANALYZING EVENTS',
  'BUILDING TIMELINE',
  'GENERATING REPORT',
  'REPORT READY'
] as const;

export const Reports: React.FC = () => {
  const { metrics, incidents, vulnerabilities } = useDemoEngine();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const templates: ReportTemplate[] = [
    {
      id: 'incident-forensics',
      title: 'Incident Post-Mortem & Attack Story Report (THR-1042)',
      category: 'FORENSICS',
      frequency: 'Per Incident / On-Demand',
      description: 'Comprehensive forensic audit detailing the 7-stage kill chain, correlated passive packet evidence, MITRE ATT&CK attribution, and remediation SLAs.',
      lastGenerated: 'Just now',
      fileSize: '4.2 MB',
      format: 'PDF / JSON',
      accent: 'rose',
      sections: ['Incident Summary', 'Attack Timeline', 'Evidence', 'Threat Classification', 'Risk Assessment', 'AI Analysis', 'Response Actions', 'Recommendations']
    },
    {
      id: 'daily-soc',
      title: 'Daily Security Operations & Telemetry Report',
      category: 'OPERATIONAL',
      frequency: 'Daily (00:00 UTC)',
      description: 'Comprehensive 24-hour SOC review detailing throughput peaks, blocked adversaries, passive tap rates, and firewall telemetry.',
      lastGenerated: 'Today, 00:05 UTC',
      fileSize: '3.4 MB',
      format: 'PDF / CSV',
      accent: 'cyan',
      sections: ['Threat Telemetry Breakdown', 'Top 10 Blocked Autonomous Systems', 'Perimeter Ingress Anomalies', 'Firewall Rule Performance']
    },
    {
      id: 'threat-intel-digest',
      title: 'Threat Intelligence & APT Campaign Digest',
      category: 'INTELLIGENCE',
      frequency: 'Weekly',
      description: 'Global threat landscape briefing including active APT campaigns, zero-day CVE advisories, and industry sector threat scoring.',
      lastGenerated: 'Yesterday, 18:30 UTC',
      fileSize: '4.8 MB',
      format: 'PDF',
      accent: 'blue',
      sections: ['Emerging APT Campaign Tracking', 'Underground Forum Breach Dumps', 'Zero-Day Vulnerability Advisories', 'Curated IOC Blacklists']
    },
    {
      id: 'executive-briefing',
      title: 'Executive Cyber Risk & Posture Briefing',
      category: 'EXECUTIVE',
      frequency: 'Monthly / Board Level',
      description: 'High-level CISO and Board briefing covering organizational cyber risk posture, compliance scores, and threat trends.',
      lastGenerated: 'Sep 01, 2026',
      fileSize: '6.2 MB',
      format: 'PDF Presentation',
      accent: 'purple',
      sections: ['Enterprise Security Posture Index', 'Financial Risk Exposure Estimation', 'SOC SLA & MTTD/MTTR Trends', 'Strategic Security Investments']
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerate = async (template: ReportTemplate) => {
    setGeneratingId(template.id);
    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      setCurrentStageIdx(i);
      await new Promise(r => setTimeout(r, 450));
    }
    setGeneratingId(null);
    setPreviewReport(template);
    showToast(`Report "${template.title}" generated successfully.`);
  };

  const handleDownload = (title: string, format: string) => {
    showToast(`Downloading "${title}.${format.split(' ')[0].toLowerCase()}"...`);
  };

  const handleShare = (title: string) => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`Encrypted SOC link for "${title}" copied to clipboard.`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filtered = templates.filter(t => activeFilter === 'ALL' || t.category === activeFilter);

  return (
    <div className="space-y-6 pb-16 font-mono text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-[0_0_25px_rgba(0,242,254,0.3)] text-cyan-300 text-sm font-mono">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              CYBER FORENSICS & EXECUTIVE ARCHIVE
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">NIST CSF & MITRE COMPLIANT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Security Reports & Intelligence Dispatch
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Automated cryptographic attack story compilation, executive post-mortems, and compliance exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleGenerate(templates[0])}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs font-mono shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:opacity-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            GENERATE ATTACK STORY REPORT
          </button>
        </div>
      </div>

      {/* Top Stat Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#091224] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-400 uppercase">REPORTS GENERATED (30D)</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">184</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Cryptographically Signed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#091224] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-400 uppercase">AUDIT READINESS</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">100%</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> ISO 27001 & SOC-2
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#091224] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-400 uppercase">CURRENT RISK SCORE</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{metrics.securityScore} / 100</div>
          <div className="text-[10px] text-slate-400 mt-1">Baseline Index</div>
        </div>

        <div className="p-4 rounded-xl bg-[#091224] border border-[#1e3a66]">
          <div className="text-[10px] text-slate-400 uppercase">CORRELATED STORY</div>
          <div className="text-2xl font-black text-purple-400 mt-1">THR-1042</div>
          <div className="text-[10px] text-purple-300 mt-1">7 Stages Reconstructed</div>
        </div>
      </div>

      {/* Animated Generation Stage Progress Bar */}
      {generatingId && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-400/60 shadow-2xl space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>GENERATING REPORT: {GENERATION_STAGES[currentStageIdx]}...</span>
            </span>
            <span className="text-cyan-400 font-bold">{currentStageIdx + 1} / {GENERATION_STAGES.length}</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
            {GENERATION_STAGES.map((st, i) => (
              <div
                key={st}
                className={`p-2 rounded-lg border font-bold transition-all ${
                  i === currentStageIdx
                    ? 'bg-cyan-500 text-black border-cyan-400'
                    : i < currentStageIdx
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {st}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {['ALL', 'FORENSICS', 'OPERATIONAL', 'INTELLIGENCE', 'EXECUTIVE'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(report => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-[#091224] border border-[#1e3a66] hover:border-cyan-400/60 shadow-xl space-y-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 uppercase">
                  {report.category}
                </span>
                <h2 className="text-sm font-extrabold text-white mt-1.5 font-sans">{report.title}</h2>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {report.frequency} • {report.fileSize} • {report.format}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {report.description}
            </p>

            {/* Sections Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {report.sections.map(s => (
                <span key={s} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                  {s}
                </span>
              ))}
            </div>

            {/* Action Buttons: View, Export PDF, Share, Download */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreviewReport(report)}
                className="py-1.5 px-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 text-center font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
              <button
                onClick={() => {
                  setPreviewReport(report);
                  setTimeout(() => window.print(), 500);
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-center font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleShare(report.title)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-center font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                onClick={() => handleDownload(report.title, report.format)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-center font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RENDERED COMPLETE 8-SECTION REPORT PREVIEW MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#080e1c] border border-cyan-400 shadow-2xl overflow-hidden">
            {/* Modal Bar */}
            <div className="p-4 bg-slate-950 border-b border-[#1e3a66] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-white text-xs uppercase">
                  FORENSIC REPORT PREVIEW — {previewReport.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF / Print</span>
                </button>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Complete 8-Section Document Preview */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-200 font-sans bg-[#060a14]">
              {/* Document Header */}
              <div className="border-b border-[#1e3a66] pb-6 flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                    THREATWAVE AI CYBER DEFENSE SOC PLATFORM
                  </div>
                  <h1 className="text-2xl font-black font-sans text-white mt-1">
                    {previewReport.title}
                  </h1>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Generated: {new Date().toUTCString()} | Incident Ref: THR-1042
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" /> NIST CSF & MITRE MAPPED
                  </div>
                  <div className="text-slate-400">Security Score: {metrics.securityScore}/100</div>
                </div>
              </div>

              {/* 1. INCIDENT SUMMARY */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> 1. Incident Summary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-sans">
                  On Sep 08, 2026 at 09:40 UTC, ThreatWave continuous detection engine flagged an adversary campaign originating from Tor Exit node 185.220.101.5 targeting DMZ-Nginx-01 and pivoting to production PostgreSQL database Prod-DB-01 (10.0.1.50). Adversary executed stacked SQL commands, elevated privileges, and initiated bulk data exfiltration of 2.84 GB.
                </p>
              </div>

              {/* 2. ATTACK TIMELINE */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-cyan-400" /> 2. Attack Timeline (THR-1042)
                </h4>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono text-xs">
                  {DEMO_ATTACK_STORY.steps.map(st => (
                    <div key={st.id} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">{st.timestamp} UTC</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-white font-bold">{st.title}</span>
                      </div>
                      <span className="text-rose-400 text-[10px] font-bold">{st.severity} ({st.confidence}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. EVIDENCE */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Forensic Evidence Verification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
                  {CORE_THREAT_PROFILES[1].evidencePoints.map((ev, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. THREAT CLASSIFICATION */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> 4. Threat Classification
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Primary Category:</span>
                    <span className="text-white font-bold">SQL Injection (OWASP A03)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Exfiltration Type:</span>
                    <span className="text-rose-400 font-bold">C2 Outbound Stream</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">MITRE Tactic:</span>
                    <span className="text-cyan-300 font-bold">T1059 / T1041</span>
                  </div>
                </div>
              </div>

              {/* 5. RISK ASSESSMENT */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> 5. Risk Assessment (Score: 91/100 CRITICAL)
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {RISK_SCORE_FACTORS.map(f => (
                    <div key={f.factor} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">{f.factor}:</span>
                      <span className="text-rose-400 font-bold">{f.score}/100 ({f.impact})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. AI ANALYSIS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" /> 6. ThreatWave AI Analysis
                </h4>
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 text-xs font-sans text-purple-200 leading-relaxed">
                  {DEMO_ATTACK_STORY.aiAnalysis}
                </div>
              </div>

              {/* 7. RESPONSE ACTIONS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" /> 7. Response Actions Executed
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
                  <div>✓ SOAR Playbook: Null-route rule dispatched for 185.220.101.5</div>
                  <div>✓ Egress firewall filter applied on PostgreSQL egress port 443</div>
                  <div>✓ Analyst approval logged in immutable SIEM audit trail</div>
                </div>
              </div>

              {/* 8. RECOMMENDATIONS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 8. Hardening & Recommendations
                </h4>
                <ul className="list-disc list-inside p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans text-slate-300 space-y-1">
                  <li>Rotate PostgreSQL database master credentials and revoke compromised analyst tokens.</li>
                  <li>Enable parameterized queries and strict input validation on DMZ search endpoint.</li>
                  <li>Implement egress traffic rate-limiting (&lt; 50 MB/hr) on tier-0 database segment.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
