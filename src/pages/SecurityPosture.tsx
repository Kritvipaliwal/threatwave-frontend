import React from 'react';
import { Award, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle2, Lock } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

export const SecurityPosture: React.FC = () => {
  const { state } = useDemoEngine();

  const categories = [
    { name: 'Network Perimeter Defense', score: 92, status: 'EXCELLENT', detail: 'Edge firewalls enforcing zero-trust ingress drops' },
    { name: 'Endpoint Protection (EDR)', score: 84, status: 'GOOD', detail: '100% agent coverage across workstations and servers' },
    { name: 'Identity & Access (IAM)', score: 79, status: 'MODERATE', detail: 'SSH MFA enforced; PAM rate-limiting active' },
    { name: 'Application Security (WAF)', score: 86, status: 'GOOD', detail: 'Web application firewall intercepting SQLi patterns' },
    { name: 'Data Protection & Encryption', score: 95, status: 'EXCELLENT', detail: 'AES-256 encrypted at rest; TLS 1.3 enforced in transit' },
    { name: 'Vulnerability Management', score: 76, status: 'NEEDS_ATTENTION', detail: `${state.vulnerabilities.length} tracked CVEs pending maintenance window` },
    { name: 'Incident Response Readiness', score: 89, status: 'EXCELLENT', detail: 'Automated SOAR playbooks mean time to contain < 3 mins' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
              <Award className="w-3 h-3" /> NIST CSF & CIS BENCHMARK
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">CONTINUOUS POSTURE ASSESSMENT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Risk & Security Posture Score
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Enterprise cyber resilience index calculated dynamically from live incident volume, vulnerability backlog, and firewall drops.
          </p>
        </div>
      </div>

      {/* Central Large Gauge Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0c1527] via-[#0f1e3d] to-[#080d1a] border border-cyan-400/40 shadow-[0_0_30px_rgba(0,242,254,0.15)] flex flex-col md:flex-row items-center justify-between gap-8 font-mono">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-emerald-400/40 flex flex-col items-center justify-center bg-[#050811] shadow-[0_0_24px_rgba(16,185,129,0.3)] shrink-0">
            <span className="text-5xl font-extrabold text-emerald-400 tracking-tight leading-none">
              {state.metrics.securityScore}
            </span>
            <span className="text-xs text-slate-400 mt-1">/ 100</span>
          </div>
          <div>
            <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">OVERALL POSTURE INDEX</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">GRADE: A- (RESILIENT)</div>
            <p className="text-xs font-sans text-slate-300 max-w-md mt-1 leading-relaxed">
              Enterprise attack surface is actively hardened. Zero zero-day exploits detected. Dynamic score drops during uncontained critical incidents and recovers upon automated SOAR playbooks.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 text-xs">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <span className="text-slate-400">Threat Containment:</span>
            <strong className="text-emerald-400">{state.metrics.blockedIps} Blocked IPs</strong>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <span className="text-slate-400">Critical Threat Exposure:</span>
            <strong className="text-rose-400">{state.metrics.criticalThreats} Active</strong>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <span className="text-slate-400">Open Incidents:</span>
            <strong className="text-amber-400">{state.metrics.activeIncidents} In Queue</strong>
          </div>
        </div>
      </div>

      {/* 7 Category Breakdown */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
          <span className="font-bold text-white uppercase tracking-wider">NIST CSF Security Domain Breakdown</span>
          <span className="text-cyan-300">7 KEY SECURITY CONTROLS</span>
        </div>

        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{cat.name}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    cat.score >= 90 ? 'bg-emerald-500/20 text-emerald-300' : (cat.score >= 80 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300')
                  }`}>
                    {cat.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">{cat.detail}</div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${cat.score >= 90 ? 'bg-emerald-400' : (cat.score >= 80 ? 'bg-cyan-400' : 'bg-amber-400')}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-10 text-right">{cat.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
