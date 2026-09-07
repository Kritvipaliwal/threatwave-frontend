import React, { useState } from 'react';
import { 
  Brain, Send, Sparkles, Copy, Check, ShieldAlert, Terminal, CornerDownLeft, 
  RotateCcw, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence?: number;
  affectedAsset?: string;
  recommendedAction?: string;
  evidence?: string[];
}

export const AiAssistant: React.FC = () => {
  const { state } = useDemoEngine();
  const [input, setInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Operator. ThreatWave AI SOC Analyst is online. Currently correlating telemetry across ${state.assets.length} production assets and ${state.events.length} active intrusion events. How can I assist your investigation?`,
      timestamp: '20:50 UTC',
      confidence: 0.99
    }
  ]);

  const suggestedPrompts = [
    'Investigate latest critical threat',
    'Why did the risk score drop?',
    'Show attack chain progression',
    'Find highest-risk asset in infrastructure',
    'Summarize today\'s active incidents',
    'Generate executive containment playbook'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toTimeString().substring(0, 5) + ' UTC'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Multi-stage simulated AI reasoning steps
    const stages = [
      'SCANNING REAL-TIME TELEMETRY...',
      'CORRELATING IOCS & MITRE TACTICS...',
      'EVALUATING ASSET VULNERABILITY CONTEXT...',
      'GENERATING ACTIONABLE FORENSIC REPORT...'
    ];

    for (const stage of stages) {
      setProcessingStage(stage);
      await new Promise(r => setTimeout(r, 450));
    }

    // Dynamic AI response based on query
    let responseText = '';
    let sev: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'CRITICAL';
    let conf = 0.96;
    let asset = 'Prod-DB-01 (10.0.1.50)';
    let action = 'BLOCK_IP 185.220.101.5 AND ISOLATE_ASSET Prod-DB-01';
    let evidence = [
      "Inbound HTTP GET with stacked SQL commands: ' OR 1=1--",
      "Tor exit node IP 185.220.101.5 flagged on AbuseIPDB with 98% malicious confidence",
      "Associated CVE-2023-38606 on target database engine"
    ];

    const qLower = query.toLowerCase();
    if (qLower.includes('risk') || qLower.includes('score')) {
      responseText = `The Security Posture Score is currently ${state.metrics.securityScore}/100. It dropped by 6 points following ${state.metrics.criticalThreats} critical threats, including unauthenticated SQL injection probes on Prod-DB-01. Containing active incidents will restore score to 96%.`;
      sev = 'HIGH';
      conf = 0.94;
      action = 'ENFORCE AUTOMATED FIREWALL DROPS';
      evidence = [`Critical threats: ${state.metrics.criticalThreats}`, `Active Incidents: ${state.metrics.activeIncidents}`];
    } else if (qLower.includes('chain') || qLower.includes('attack')) {
      responseText = `Adversary attack chain detected: Tor Exit Node (185.220.101.5) executed stealth TCP port sweeps, pivoted to DMZ-Nginx-01 via port 80, and delivered stacked SQL injection queries aimed at Prod-DB-01. Automated containment successfully intercepted data exfiltration.`;
      sev = 'CRITICAL';
      conf = 0.98;
      action = 'VERIFY DB CREDENTIAL AUDIT & ROTATE SERVICE PASSWORDS';
      evidence = ['MITRE T1595 Reconnaissance', 'MITRE T1190 Exploit Public-Facing App', 'MITRE T1059 SQL Execution'];
    } else if (qLower.includes('asset') || qLower.includes('highest')) {
      const highestRisk = state.assets.reduce((max, a) => a.riskScore > max.riskScore ? a : max, state.assets[0]);
      responseText = `Highest-risk asset is ${highestRisk.hostname} (${highestRisk.ipAddress}) with Risk Score ${highestRisk.riskScore}/100. Status is ${highestRisk.status} due to ${highestRisk.vulnerabilitiesCount} known vulnerabilities and active external ingress.`;
      sev = 'CRITICAL';
      asset = `${highestRisk.hostname} (${highestRisk.ipAddress})`;
      action = 'ISOLATE ASSET & APPLY EMERGENCY OS SECURITY PATCH';
      evidence = [`OS: ${highestRisk.os}`, `Risk: ${highestRisk.riskScore}`, `Vulnerabilities: ${highestRisk.vulnerabilitiesCount}`];
    } else if (qLower.includes('incident') || qLower.includes('summarize')) {
      responseText = `There are currently ${state.metrics.activeIncidents} active incidents in the queue. Leading incident is INC-2048: Distributed SQL Injection targeting customer accounts database. Assigned to ThreatWave SOAR Copilot.`;
      sev = 'HIGH';
      action = 'COMPLETE INCIDENT TRIAGE & RESOLVE TICKETS';
      evidence = state.incidents.map(i => `${i.id}: ${i.title} (${i.status})`);
    } else {
      responseText = `ThreatWave AI correlation complete: Analyzed query "${query}". Identified active adversary IP 185.220.101.5 targeting infrastructure. Recommend executing automated firewall drop and asset quarantine playbooks.`;
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toTimeString().substring(0, 5) + ' UTC',
      severity: sev,
      confidence: conf,
      affectedAsset: asset,
      recommendedAction: action,
      evidence
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);
    setProcessingStage('');
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              AI SOC ANALYST
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
            </span>
            <span>•</span>
            <span className="text-cyan-300">ANALYZING {state.events.length} EVENTS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            ThreatWave AI Cyber Assistant
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Generative cybersecurity copilot for automated incident triage, kill-chain correlation, and defense execution.
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="self-start md:self-auto px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Chat
        </button>
      </div>

      {/* Suggested Prompts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="p-2.5 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-left text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-start gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="line-clamp-2">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col h-[560px] overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold ${
                  isUser
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                }`}>
                  {isUser ? 'OP' : <Brain className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl border space-y-2 relative group ${
                  isUser
                    ? 'bg-cyan-500/10 border-cyan-400/40 text-slate-100 rounded-tr-none'
                    : 'bg-slate-900/90 border-[#1e3a66] text-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400">
                    <span className="font-bold text-white">
                      {isUser ? 'Operator (You)' : 'ThreatWave AI Copilot'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-sans leading-relaxed text-slate-100">
                    {msg.text}
                  </p>

                  {/* AI Structured Evidence Box */}
                  {!isUser && msg.confidence && (
                    <div className="mt-3 p-3 rounded-xl bg-black/40 border border-slate-800 font-mono text-[11px] space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                        {msg.severity && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                            {msg.severity} SEVERITY
                          </span>
                        )}
                        <span className="text-cyan-400 font-bold">
                          AI CONFIDENCE: {Math.round(msg.confidence * 100)}%
                        </span>
                      </div>

                      {msg.affectedAsset && (
                        <div>
                          <span className="text-slate-500">TARGET ASSET: </span>
                          <span className="text-amber-300 font-bold">{msg.affectedAsset}</span>
                        </div>
                      )}

                      {msg.evidence && msg.evidence.length > 0 && (
                        <div>
                          <span className="text-slate-500 block mb-1">CORRELATED EVIDENCE:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[10px]">
                            {msg.evidence.map((ev, i) => (
                              <li key={i}>{ev}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.recommendedAction && (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                            {msg.recommendedAction}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Processing Status */}
          {isProcessing && (
            <div className="flex gap-3 items-center p-3 rounded-xl bg-slate-900/60 border border-cyan-400/30 text-cyan-300 animate-pulse">
              <Brain className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
              <div className="font-mono text-xs font-bold tracking-wider">
                {processingStage}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1e3a66] bg-slate-950/60">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask ThreatWave AI about threats, risk score, incidents, CVEs, or mitigation playbooks..."
                disabled={isProcessing}
                className="w-full py-2.5 pl-3 pr-10 rounded-xl bg-slate-900 border border-[#1e3a66] text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              <span>Query AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
