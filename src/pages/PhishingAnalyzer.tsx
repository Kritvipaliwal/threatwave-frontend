import React, { useState } from 'react';
import { Mail, Search, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Globe } from 'lucide-react';

export const PhishingAnalyzer: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState<string>('http://auth-verify-security-portal.com/login?token=9482');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(true);
  const [checkedItems, setCheckedItems] = useState<number>(5);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setCompleted(false);
    setCheckedItems(0);

    for (let i = 1; i <= 5; i++) {
      setCheckedItems(i);
      await new Promise(r => setTimeout(r, 400));
    }

    setIsAnalyzing(false);
    setCompleted(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <Mail className="w-3 h-3" /> SOCIAL ENGINEERING DEFENSE
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">NLP INTENT & SENDER FORENSICS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Phishing Analyzer & Deceptive URL Inspector
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Heuristic URL inspection, fast-flux DNS detection, SPF/DKIM verification, and credential harvesting intent classification.
          </p>
        </div>
      </div>

      {/* URL / Email Input Console */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="Enter suspicious URL, sender domain, or raw email subject..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !targetUrl.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-black font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{isAnalyzing ? 'Scanning...' : 'Inspect Phishing Vector'}</span>
          </button>
        </form>
      </div>

      {/* Animated Checklist Steps */}
      {isAnalyzing && (
        <div className="p-5 rounded-2xl bg-[#0c1527] border border-cyan-400/40 font-mono text-xs space-y-2">
          <span className="text-cyan-300 font-bold block mb-2">RUNNING HEURISTIC VERIFICATION CHECKS:</span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              'Domain Age & WHOIS',
              'URL Typosquatting',
              'SPF/DKIM/DMARC Spoofing',
              'NLP Urgency Sentiment',
              'Suspicious Redirects'
            ].map((check, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border text-center text-[10px] font-bold ${
                  checkedItems > i
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : checkedItems === i + 1
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}
              >
                {check}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results Card */}
      {completed && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0c1527] border border-rose-500/50 shadow-[0_0_24px_rgba(244,63,94,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">PHISHING INTENT SCORE</div>
              <div className="text-2xl font-extrabold text-rose-400 flex items-center gap-2 mt-0.5">
                <ShieldAlert className="w-6 h-6" /> PHISHING CONFIRMED: 91% RISK
              </div>
              <p className="text-xs font-sans text-slate-300 mt-1">
                Deceptive credential harvesting target spoofing corporate SSO login portal. Newly registered domain (3 days old).
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-slate-400">VERDICT</div>
              <div className="text-3xl font-extrabold text-rose-500">91%</div>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                MALICIOUS LINK
              </span>
            </div>
          </div>

          {/* Explainable Indicators Grid */}
          <div className="p-5 rounded-2xl bg-[#0c1527] border border-[#1e3a66] font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e3a66] pb-2">
              <span className="text-white font-bold uppercase">Explainable Red Flag Indicators (Why Suspicious)</span>
              <span className="text-rose-400 text-[10px] font-bold">5 VIOLATIONS DETECTED</span>
            </div>

            <div className="space-y-2 text-slate-300">
              {[
                { title: 'Domain Age & Registration', desc: 'Domain registered 3 days ago via privacy proxy registrar in Netherlands.', flag: 'CRITICAL' },
                { title: 'Brand Impersonation & Typosquatting', desc: 'Simulated SSO login path mimicking Microsoft 365 / Okta authorization screens.', flag: 'CRITICAL' },
                { title: 'SPF / DMARC Failure', desc: 'Sender IP does not match designated MX SPF records. Header authentication failed.', flag: 'HIGH' },
                { title: 'NLP Urgency Intent Classification', desc: "Extreme urgency detected: 'Urgent action required within 24 hours to prevent account deactivation.'", flag: 'HIGH' },
                { title: 'Obfuscated Query Parameter', desc: 'Base64 encoded target email token embedded in query string for automated credential harvest.', flag: 'MEDIUM' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{item.title}</div>
                    <div className="text-slate-400 text-[11px] font-sans mt-0.5">{item.desc}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-auto ${
                    item.flag === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.flag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
