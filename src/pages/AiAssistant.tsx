import React, { useState } from 'react';
import { 
  Brain, Send, Sparkles, Copy, Check, ShieldAlert, Terminal, CornerDownLeft, 
  RotateCcw, AlertTriangle, ShieldCheck, ArrowRight, GitCommit, Zap
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { ActionApprovalModal } from '../components/security/ActionApprovalModal';
import { aiService } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence?: number;
  riskScore?: number;
  attackPattern?: string;
  evidence?: string[];
  recommendation?: string;
  affectedAsset?: string;
}

export const AiAssistant: React.FC = () => {
  const { state, executeResponseAction } = useDemoEngine();
  const [input, setInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvalAction, setApprovalAction] = useState<{
    title: string;
    target: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    reason: string;
    actionType: string;
  } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'ThreatWave AI Investigator initialized. Correlated 7 intrusion events across 4 network segments. I am actively monitoring live packet metadata and anomalous baseline drifts.',
      timestamp: '09:42 UTC',
      confidence: 96,
      riskScore: 91,
      attackPattern: 'Reconnaissance → Exploitation → Account Compromise → Database Access → Data Transfer',
      evidence: [
        '5 correlated security events within 6 minutes',
        '2 abnormal behavior signals on database egress channel',
        '1 critical asset affected (Prod-DB-01 / 10.0.1.50)'
      ],
      recommendation: 'Contain the affected asset after analyst approval.'
    }
  ]);

  const suggestedPrompts = [
    'Why is this incident critical?',
    'Show the attack chain.',
    'What evidence supports this threat?',
    'What changed from the baseline?',
    'What should I investigate next?',
    'Summarize this incident.'
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
      'QUERYING STREAMING FEATURE STORE...',
      'EVALUATING ISOLATION FOREST ANOMALY SCORES...',
      'CORRELATING TOPOLOGY GRAPH & MITRE TACTICS...',
      'SYNTHESIZING FORENSIC INVESTIGATION REPORT...'
    ];

    // Concurrently trigger stages and query backend AI Copilot
    const apiPromise = aiService.chatCopilot(query, 'THR-1042').catch(() => null);

    for (const stage of stages) {
      setProcessingStage(stage);
      await new Promise(r => setTimeout(r, 300));
    }

    const apiResult = await apiPromise;

    // Dynamic AI response based on query
    let responseText = '';
    let attackPattern: string | undefined = undefined;
    let riskScore: number = 91;
    let confidence: number = 96;
    let evidence: string[] = [];
    let recommendation: string = 'Contain the affected asset after analyst approval.';

    const qLower = query.toLowerCase();

    if (apiResult?.reply) {
      responseText = apiResult.reply;
      if (apiResult.suggestions && apiResult.suggestions.length > 0) {
        // suggestions can enrich next steps
      }
    }

    if (qLower.includes('critical') || qLower.includes('why')) {
      if (!responseText) responseText = 'Incident THR-1042 is flagged as CRITICAL because adversary pivoted directly from perimeter DMZ web server to production PostgreSQL database, exfiltrating sensitive credential tables.';
      riskScore = 93;
      confidence = 97;
      attackPattern = 'Port Scan → SQL Injection → Privilege Escalation → Database Access → Exfiltration';
      evidence = [
        'High-confidence SQL injection payload (`UNION SELECT...`) verified',
        'Unauthorized 2.84 GB bulk outbound transfer to foreign C2 IP',
        'Privilege escalation to superuser role on Prod-DB-01'
      ];
      recommendation = 'Execute firewall drop on adversary IP 185.220.101.5 and isolate Prod-DB-01.';
    } else if (qLower.includes('chain') || qLower.includes('attack')) {
      if (!responseText) responseText = 'Adversary intrusion chain reconstructed across 7 temporal stages. Attack originated from Tor Exit node 185.220.101.5 and concluded with encrypted TLS data transfer.';
      riskScore = 91;
      confidence = 96;
      attackPattern = 'Reconnaissance → Exploitation → Account Compromise → Database Access → Data Transfer';
      evidence = [
        '09:40 - Reconnaissance ping sweep across subnet',
        '09:41 - Port scanning ports 21-8080 on DMZ-Nginx-01',
        '09:42 - Stacked SQL injection query on search API',
        '09:44 - Unauthorized role elevation',
        '09:46 - Egress volume anomaly (+1,400% above baseline)'
      ];
      recommendation = 'Isolate compromised host 10.0.1.50 from internal subnet.';
    } else if (qLower.includes('evidence')) {
      if (!responseText) responseText = 'ThreatWave tri-engine fusion confirms malicious intent with 96% confidence based on 6 independent forensic indicators:';
      riskScore = 91;
      confidence = 96;
      evidence = [
        'Abnormal connection frequency (1,024 SYN probes in 1.8s)',
        'Multiple destination ports sequential sweep (21, 22, 80, 443, 445)',
        'Traffic deviation from baseline (+840% above subnet nominal)',
        'Known CVE-2023-38606 exploit signature pattern match',
        'ML Isolation Forest anomaly outlier score: 0.978',
        'JA3 fingerprint matches Cobalt Strike malleable C2'
      ];
      recommendation = 'Verify DB audit logs and rotate service credentials.';
    } else if (qLower.includes('baseline') || qLower.includes('changed')) {
      if (!responseText) responseText = '30-day baseline comparison indicates severe anomalies on asset Prod-DB-01: outbound traffic volume spiked +1,400% (normally < 15 MB/hr, reached 2.84 GB). Auth failure rate surged +420% on LDAP directory.';
      riskScore = 88;
      confidence = 94;
      evidence = [
        'Egress volume: 2.84 GB vs baseline 14.2 MB',
        'Auth failures: 48 attempts in 30s vs baseline 0.4/hr',
        'New unseen destination IP: 194.26.29.112 (Foreign bulletproof ASN)'
      ];
      recommendation = 'Apply immediate outbound network egress restrictions.';
    } else if (qLower.includes('next') || qLower.includes('investigate')) {
      if (!responseText) responseText = 'Priority Next Steps: 1. Contain Prod-DB-01 to prevent lateral spread. 2. Null-route adversary 185.220.101.5 at edge gateway. 3. Audit PostgreSQL query logs for accessed tables. 4. Check workstation 10.0.4.88 for dormant C2 beacons.';
      riskScore = 91;
      confidence = 95;
      evidence = [
        'Adversary actively maintains established TCP session',
        'Potential dormant persistence in Auth-LDAP-01 accounts'
      ];
      recommendation = 'Authorize automated SOAR containment playbook.';
    } else {
      if (!responseText) responseText = 'Incident Summary THR-1042: Coordinated multi-vector intrusion against core enterprise database infrastructure. Detection engines flagged initial reconnaissance progressing to database compromise and bulk exfiltration. Containment ready for analyst approval.';
      riskScore = 91;
      confidence = 96;
      attackPattern = 'Reconnaissance → Exploitation → Account Compromise → Database Access → Data Transfer';
      evidence = [
        '5 correlated events across DMZ, Auth, and DB layers',
        '2 abnormal behavior signals on data egress channels',
        '1 tier-0 production database affected'
      ];
      recommendation = 'Contain the affected asset after analyst approval.';
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toTimeString().substring(0, 5) + ' UTC',
      confidence,
      riskScore,
      attackPattern,
      evidence,
      recommendation,
      affectedAsset: 'Prod-DB-01 (10.0.1.50)'
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);
    setProcessingStage('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              THREATWAVE AI INVESTIGATOR
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ● ANALYZING SECURITY DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            AI Cyber Defense Copilot & Forensic Analyst
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Autonomous multi-vector reasoning engine correlating packet telemetry, MITRE ATT&CK kill chains, and automated containment playbooks.
          </p>
        </div>

        {/* Real-time reasoning badge */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-cyan-300 font-extrabold text-sm">NEURAL MODEL v4.8</div>
          <div className="text-[10px] text-slate-400">Context Window: 64k Telemetry Events</div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-[#091224] border border-[#1e3a66] shadow-2xl overflow-hidden flex flex-col h-[640px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map(msg => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi 
                    ? 'bg-purple-600/30 border border-purple-400/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                    : 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300'
                }`}>
                  {isAi ? <Brain className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-3 p-4 rounded-2xl ${
                  isAi 
                    ? 'bg-[#060c18] border border-[#1e3a66] shadow-xl text-slate-200' 
                    : 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-500/40 text-white'
                }`}>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-2 text-[10px] text-slate-400">
                    <span className="font-extrabold text-white">
                      {isAi ? 'THREATWAVE AI ANALYST' : 'SOC OPERATOR'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                  {/* AI Structured Outputs if present */}
                  {isAi && msg.attackPattern && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-[#1e3a66]/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                          <span>ATTACK PATTERN:</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold border border-purple-500/30">
                          [INFERRED]
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        {msg.attackPattern}
                      </div>

                      {/* Score & Confidence Badges */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500">Risk Score:</span>
                          <span className="text-rose-400 font-extrabold flex items-center gap-1">
                            <span>{msg.riskScore} / 100</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">[PREDICTED]</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500">Confidence:</span>
                          <span className="text-emerald-400 font-extrabold">{msg.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Evidence Bullets */}
                  {isAi && msg.evidence && msg.evidence.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          CORRELATED FORENSIC EVIDENCE:
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30">
                          [OBSERVED]
                        </span>
                      </div>
                      {msg.evidence.map((evItem, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 font-sans">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{evItem}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Playbook Recommendation */}
                  {isAi && msg.recommendation && (
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] text-rose-400 font-mono block uppercase font-bold">
                            PLAYBOOK RECOMMENDATION:
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                            [RECOMMENDED]
                          </span>
                        </div>
                        <span className="text-xs font-sans text-rose-200 font-bold">
                          {msg.recommendation}
                        </span>
                      </div>
                      <button
                        onClick={() => setApprovalAction({
                          title: 'Contain Affected Host & Null-Route Adversary',
                          target: 'Prod-DB-01 (10.0.1.50)',
                          priority: 'CRITICAL',
                          reason: 'Adversary SQL injection and bulk data exfiltration verified by ThreatWave AI.',
                          actionType: 'CONTAIN_HOST'
                        })}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] shrink-0 transition-colors cursor-pointer"
                      >
                        [REVIEW ACTION]
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-cyan-400/50 text-xs font-mono text-cyan-300 animate-pulse">
              <Brain className="w-4 h-4 animate-spin" />
              <span>{processingStage || 'ANALYZING SECURITY DATA...'}</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts Ribbon */}
        <div className="p-3 bg-slate-950/90 border-t border-[#1e3a66]/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">SUGGESTED:</span>
          {suggestedPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-300 hover:text-white hover:border-cyan-400 text-[10px] whitespace-nowrap transition-all cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-[#1e3a66] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask ThreatWave AI Investigator (e.g. Why is this incident critical? Show the attack chain)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-[#1e3a66] text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isProcessing || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Analyst Action Approval Modal */}
      {approvalAction && (
        <ActionApprovalModal
          action={approvalAction}
          onApprove={() => {
            executeResponseAction(approvalAction.actionType, approvalAction.target);
            setApprovalAction(null);
          }}
          onReject={() => setApprovalAction(null)}
          onClose={() => setApprovalAction(null)}
        />
      )}
    </div>
  );
};

export default AiAssistant;
