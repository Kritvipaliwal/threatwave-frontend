import React, { useState } from 'react';
import { 
  FileText, Download, Eye, Share2, RefreshCw, CheckCircle2, Clock, 
  ShieldCheck, AlertTriangle, Printer, X, Sparkles, Filter
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

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

export const Reports: React.FC = () => {
  const { metrics, incidents, vulnerabilities } = useDemoEngine();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const templates: ReportTemplate[] = [
    {
      id: 'daily-soc',
      title: 'Daily Security Report',
      category: 'OPERATIONAL',
      frequency: 'Daily (00:00 UTC)',
      description: 'Comprehensive 24-hour SOC operational review detailing threat spikes, blocked adversaries, and firewall telemetry.',
      lastGenerated: 'Today, 00:05 UTC',
      fileSize: '3.4 MB',
      format: 'PDF / CSV',
      accent: 'cyan',
      sections: ['Threat Telemetry Breakdown', 'Top 10 Blocked Autonomous Systems', 'Perimeter Ingress Anomalies', 'Firewall Rule Performance']
    },
    {
      id: 'incident-forensics',
      title: 'Incident Post-Mortem Report',
      category: 'FORENSICS',
      frequency: 'Per Incident / On-Demand',
      description: 'In-depth forensic audit of critical security events, MITRE ATT&CK mapping, IOC chains, and remediation actions.',
      lastGenerated: '2 hours ago',
      fileSize: '5.1 MB',
      format: 'PDF / JSON',
      accent: 'rose',
      sections: ['Attack Vector Replay', 'Adversary Infrastructure IOCs', 'Containment Timeline', 'Root Cause & Hardening Recommendations']
    },
    {
      id: 'threat-intel-digest',
      title: 'Threat Intelligence Report',
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
      id: 'vulnerability-audit',
      title: 'Vulnerability Assessment Report',
      category: 'COMPLIANCE',
      frequency: 'Bi-Weekly',
      description: 'Infrastructure vulnerability scan results, CVSS v3.1 scoring, remediation SLAs, and asset exposure mapping.',
      lastGenerated: '3 days ago',
      fileSize: '2.9 MB',
      format: 'PDF / XLSX',
      accent: 'amber',
      sections: ['CVSS 9.0+ Critical Exploit Catalog', 'Unpatched Asset Inventory', 'Patch Priority Roadmap', 'CIS Benchmark Compliance']
    },
    {
      id: 'executive-briefing',
      title: 'Executive Security Report',
      category: 'EXECUTIVE',
      frequency: 'Monthly / Board Level',
      description: 'High-level CISO and Board briefing covering organizational cyber risk posture, compliance scores, and threat trends.',
      lastGenerated: 'Sep 01, 2026',
      fileSize: '6.2 MB',
      format: 'PDF Presentation',
      accent: 'purple',
      sections: ['Enterprise Security Posture Index', 'Financial Risk Exposure Estimation', 'SOC SLA & MTTD/MTTR Trends', 'Strategic Security Investments']
    },
    {
      id: 'soc-summary',
      title: 'SOC Operational Summary',
      category: 'OPERATIONAL',
      frequency: 'Per Shift / 8 Hours',
      description: 'Shift handoff intelligence, queue latency metrics, automated SOAR playbook execution logs, and analyst response scores.',
      lastGenerated: '1 hour ago',
      fileSize: '1.8 MB',
      format: 'PDF / HTML',
      accent: 'emerald',
      sections: ['Shift Alert Queue Velocity', 'Automated Containment Success Rate', 'Escalated Tier-3 Triage Logs', 'Analyst Performance Index']
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerate = (id: string, title: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
      showToast(`Report "${title}" generated successfully with latest SOC telemetry.`);
    }, 1800);
  };

  const handleDownload = (title: string, format: string) => {
    showToast(`Downloading "${title}.${format.split(' ')[0].toLowerCase()}"...`);
  };

  const handleShare = (title: string) => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast(`Encrypted SOC link for "${title}" copied to clipboard.`);
  };

  const filtered = templates.filter(t => activeFilter === 'ALL' || t.category === activeFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-[0_0_25px_rgba(0,242,254,0.3)] text-cyan-300 text-sm font-mono">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 tracking-wide font-mono">REPORTS & INTELLIGENCE ARCHIVE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AUDIT READY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated cryptographic threat reports, executive briefings, and compliance audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleGenerate('all', 'Consolidated SOC Archive')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-xs font-mono shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            GENERATE ALL REPORTS
          </button>
        </div>
      </div>

      {/* Top Stat Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-[#1e3a66]/60">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Reports Generated (30D)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">184</div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Cryptographically Signed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-[#1e3a66]/60">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Templates</div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">6 Enterprise</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> NIST CSF & ISO 27001 Aligned
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-[#1e3a66]/60">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Security Score Baseline</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{metrics.securityScore} / 100</div>
          <div className="text-[11px] font-mono text-cyan-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Current SOC Posture
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-[#1e3a66]/60">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Scheduled Dispatches</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">8 Recurrent</div>
          <div className="text-[11px] font-mono text-purple-300 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Next dispatch in 3h 54m
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {['ALL', 'OPERATIONAL', 'FORENSICS', 'INTELLIGENCE', 'COMPLIANCE', 'EXECUTIVE'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all uppercase whitespace-nowrap cursor-pointer ${
              activeFilter === cat 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border border-[#1e3a66]/40 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(report => {
          const isGenerating = generatingId === report.id;
          return (
            <div 
              key={report.id}
              className="p-5 rounded-xl bg-[#0b1329]/80 border border-[#1e3a66]/70 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                        {report.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 font-mono leading-tight">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-300">
                    {report.format}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  {report.description}
                </p>

                {/* Sections List */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-[#1e3a66]/40 mb-4">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> Key Sections Included:
                  </div>
                  <ul className="space-y-1">
                    {report.sections.map((sec, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                        <span className="truncate">{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-[#1e3a66]/40 pt-3 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">FREQUENCY</span>
                    <span className="text-slate-300">{report.frequency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">LAST RUN / SIZE</span>
                    <span className="text-slate-300">{report.lastGenerated} • {report.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1e3a66]/40">
                <button
                  onClick={() => handleGenerate(report.id, report.title)}
                  disabled={isGenerating}
                  className="col-span-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  title="Generate Fresh Report"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isGenerating ? 'GENERATING...' : 'GENERATE'}</span>
                </button>

                <button
                  onClick={() => setPreviewReport(report)}
                  className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all cursor-pointer"
                  title="Preview Report"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">VIEW</span>
                </button>

                <button
                  onClick={() => handleDownload(report.title, report.format)}
                  className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">GET</span>
                </button>

                <button
                  onClick={() => handleShare(report.title)}
                  className="col-span-4 mt-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono border border-slate-800 transition-all cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  SHARE ENCRYPTED AUDIT LINK
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.25)] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1e3a66] flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-mono text-slate-100">
                    REPORT PREVIEW: {previewReport.title}
                  </h2>
                  <p className="text-[11px] font-mono text-slate-400">
                    Cryptographic Signature: SHA-256: 7f83b165... Verified ThreatWave SOC Node
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPreviewReport(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content / Rendered Report Preview */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-200 font-sans bg-[#091122]">
              {/* Document Letterhead */}
              <div className="border-b border-[#1e3a66] pb-6 flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                    THREATWAVE AI CYBER DEFENSE PLATFORM
                  </div>
                  <h1 className="text-2xl font-bold font-mono text-white mt-1">
                    {previewReport.title}
                  </h1>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Generated: {new Date().toISOString()} | Classification: RESTRICTED / SOC ONLY
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" /> NIST COMPLIANT
                  </div>
                  <div className="text-slate-400">Score: {metrics.securityScore}/100</div>
                  <div className="text-slate-500 text-[10px]">Ref: TW-AUDIT-{Date.now().toString().slice(-6)}</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 1. Executive Summary & Posture Baseline
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-[#1e3a66]/50">
                  During this reporting period, ThreatWave autonomous detection engine intercepted and correlated {metrics.totalThreats.toLocaleString()} network events across {metrics.assetsMonitored} monitored infrastructure assets. High-risk attack activity concentrated primarily on SQL injection probing and brute force credential stuffing. Autonomous defense mechanisms contained {metrics.blockedIps} malicious IP ranges, sustaining a composite organizational security score of {metrics.securityScore}/100.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#1e3a66]">
                  <div className="text-[10px] font-mono text-slate-400">TOTAL TELEMETRY</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">{metrics.totalThreats}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#1e3a66]">
                  <div className="text-[10px] font-mono text-slate-400">CRITICAL ATTACKS</div>
                  <div className="text-lg font-bold font-mono text-rose-400">{metrics.criticalThreats}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#1e3a66]">
                  <div className="text-[10px] font-mono text-slate-400">BLOCKED HOSTS</div>
                  <div className="text-lg font-bold font-mono text-amber-400">{metrics.blockedIps}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#1e3a66]">
                  <div className="text-[10px] font-mono text-slate-400">AI DETECTIONS</div>
                  <div className="text-lg font-bold font-mono text-purple-400">{metrics.aiDetections}</div>
                </div>
              </div>

              {/* Active Incident Section */}
              <div>
                <h4 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> 2. High-Severity Incidents Under Investigation
                </h4>
                <div className="overflow-x-auto rounded-xl border border-[#1e3a66]/60">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-[#1e3a66]">
                      <tr>
                        <th className="p-3">INCIDENT ID</th>
                        <th className="p-3">TITLE</th>
                        <th className="p-3">SEVERITY</th>
                        <th className="p-3">TARGET ASSET</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3a66]/40 bg-slate-900/40">
                      {incidents.slice(0, 3).map(inc => (
                        <tr key={inc.id}>
                          <td className="p-3 text-cyan-400 font-bold">{inc.id}</td>
                          <td className="p-3 text-slate-200">{inc.title}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{inc.targetAsset}</td>
                          <td className="p-3 text-emerald-400">{inc.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Infrastructure Exposure Summary */}
              <div>
                <h4 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Vulnerabilities & Remediation Priorities
                </h4>
                <div className="space-y-2">
                  {vulnerabilities.slice(0, 2).map(v => (
                    <div key={v.id} className="p-3 rounded-lg bg-slate-900/60 border border-[#1e3a66] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-rose-400">{v.cveId}</span>
                          <span className="text-slate-300">• {v.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Affected: {v.affectedAsset} | CVSS Score: {v.cvssScore}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                        ACTION REQUIRED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#1e3a66] bg-slate-950/80 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400">
                ThreatWave SIEM & SOAR Certified Automated Export
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(previewReport.title, previewReport.format)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD {previewReport.format.split(' ')[0]}
                </button>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
