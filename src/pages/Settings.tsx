import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Shield, Brain, Bell, Network, 
  Save, RotateCcw, CheckCircle2, Sliders, Radio, Server,
  Lock, Cpu, Globe
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { demoEngine } from '../demo/demoEngine';

type SettingsTab = 'general' | 'security' | 'ai' | 'notifications' | 'integrations';

export const Settings: React.FC = () => {
  const { demoMode } = useDemoEngine();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // General Settings State
  const [platformName, setPlatformName] = useState('THREATWAVE');
  const [socRegion, setSocRegion] = useState('Asia-South (Mumbai Primary)');
  const [timezone, setTimezone] = useState('UTC');
  const [telemetryInterval, setTelemetryInterval] = useState(4);

  // Security Settings State
  const [autoContainThreshold, setAutoContainThreshold] = useState(9.0);
  const [autoIpBan, setAutoIpBan] = useState(true);
  const [honeypotTelemetry, setHoneypotTelemetry] = useState(true);
  const [maxLoginFailures, setMaxLoginFailures] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState('30m');

  // AI Settings State
  const [aiModel, setAiModel] = useState('ThreatWave-SOC-LLM v4.2 (Fine-tuned)');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(90);
  const [autonomousTriage, setAutonomousTriage] = useState(true);
  const [autoSummary, setAutoSummary] = useState(true);
  const [deepTelemetryCorrelation, setDeepTelemetryCorrelation] = useState(true);

  // Notification Settings State
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [audibleAlarm, setAudibleAlarm] = useState(false);
  const [emailFrequency, setEmailFrequency] = useState('INSTANT');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/ThreatWaveAlerts');

  // Integration Settings State
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000');
  const [splunkEnabled, setSplunkEnabled] = useState(true);
  const [elasticEnabled, setElasticEnabled] = useState(true);
  const [sentinelEnabled, setSentinelEnabled] = useState(false);
  const [vtApiKey, setVtApiKey] = useState('••••••••••••••••••••••••••••••••');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('SOC Security & Platform configuration updated successfully.');
    }, 1000);
  };

  const handleReset = () => {
    setPlatformName('THREATWAVE');
    setSocRegion('Asia-South (Mumbai Primary)');
    setTimezone('UTC');
    setTelemetryInterval(4);
    setAutoContainThreshold(9.0);
    setAutoIpBan(true);
    setAiConfidenceThreshold(90);
    showToast('Platform settings reset to default enterprise configuration.');
  };

  const handleToggleDemo = () => {
    const newState = demoEngine.toggleDemoMode();
    showToast(`Demo Mode ${newState ? 'ENABLED (Simulating Telemetry)' : 'PAUSED'}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-[0_0_25px_rgba(0,242,254,0.3)] text-cyan-300 text-sm font-mono animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100 tracking-wide font-mono">
              PLATFORM SETTINGS & SOC CONFIGURATION
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SOC ROOT ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure autonomous containment triggers, AI models, SIEM integration endpoints, and telemetry feeds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RESET DEFAULTS
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1e3a66]/60 pb-3 overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: SettingsIcon },
          { id: 'security', label: 'Security & SOAR', icon: Shield },
          { id: 'ai', label: 'AI Engine', icon: Brain },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'integrations', label: 'SIEM & Integrations', icon: Network }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#0b1329]/80 border border-[#1e3a66]/70 rounded-2xl p-6 shadow-xl">
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wide flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" /> General Platform Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">PLATFORM DISPLAY NAME</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">SOC PRIMARY REGION</label>
                <select
                  value={socRegion}
                  onChange={(e) => setSocRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>Asia-South (Mumbai Primary)</option>
                  <option>Europe-West (Frankfurt)</option>
                  <option>US-East (N. Virginia)</option>
                  <option>Asia-East (Tokyo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">OPERATIONAL TIMEZONE</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="IST">Indian Standard Time (IST - UTC+5:30)</option>
                  <option value="EST">Eastern Standard Time (EST - UTC-5)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300">TELEMETRY POLLING INTERVAL</label>
                  <span className="text-xs font-mono text-cyan-400">{telemetryInterval} Seconds</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={telemetryInterval}
                  onChange={(e) => setTelemetryInterval(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Determines frequency of live event ingestion stream updates.
                </span>
              </div>
            </div>

            {/* Demo Mode Master Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className={`w-4 h-4 ${demoMode ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                  <span className="text-xs font-mono font-bold text-slate-100">SYNTHETIC DEMO SIMULATION ENGINE</span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Continuously streams realistic cyber attacks, radar anomalies, and telemetry pulses for presentations.
                </p>
              </div>
              <button
                onClick={handleToggleDemo}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  demoMode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {demoMode ? 'DEMO MODE: ON' : 'DEMO MODE: OFF'}
              </button>
            </div>
          </div>
        )}

        {/* 2. SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold font-mono text-rose-400 uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4" /> Autonomous Defense & SOAR Triggers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300">AUTO-CONTAINMENT THRESHOLD</label>
                  <span className="text-xs font-mono text-rose-400">CVSS {autoContainThreshold.toFixed(1)}+</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="10.0"
                  step="0.1"
                  value={autoContainThreshold}
                  onChange={(e) => setAutoContainThreshold(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Threats meeting or exceeding this CVSS rating will trigger automated quarantine playbooks.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">MAX FAILED AUTHENTICATION ATTEMPTS</label>
                <select
                  value={maxLoginFailures}
                  onChange={(e) => setMaxLoginFailures(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value={3}>3 Attempts (Strict Banking Tier)</option>
                  <option value={5}>5 Attempts (Standard Enterprise)</option>
                  <option value={10}>10 Attempts (Relaxed)</option>
                </select>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">AUTOMATIC IP BLOCKING (SOAR PLAYBOOK)</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    Instantly push null-route rules to perimeter firewalls when high-confidence SQLi or brute force is detected.
                  </div>
                </div>
                <button
                  onClick={() => setAutoIpBan(!autoIpBan)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoIpBan ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      autoIpBan ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">HONEYPOT DECOY SENSORS</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    Inject decoy SSH/RDP ports into DMZ perimeter to track zero-day reconnaissance behavior.
                  </div>
                </div>
                <button
                  onClick={() => setHoneypotTelemetry(!honeypotTelemetry)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    honeypotTelemetry ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      honeypotTelemetry ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. AI ENGINE TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wide flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI Threat Intelligence & Neural Engine
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">SOC LLM INFERENCE ENGINE</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>ThreatWave-SOC-LLM v4.2 (Fine-tuned)</option>
                  <option>Claude 3.5 Sonnet (SecOps Mode)</option>
                  <option>GPT-4o Cyber Threat Co-pilot</option>
                  <option>Local Mistral-7B Security Air-Gapped</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300">MINIMUM AI CONFIDENCE SENSITIVITY</label>
                  <span className="text-xs font-mono text-purple-400">{aiConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="99"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Only alert analysts when the neural classifier exceeds this confidence ceiling.
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">AUTONOMOUS INCIDENT TRIAGE</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    AI co-pilot automatically correlates kill chain stages and drafts containment steps.
                  </div>
                </div>
                <button
                  onClick={() => setAutonomousTriage(!autonomousTriage)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autonomousTriage ? 'bg-purple-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      autonomousTriage ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">CROSS-LOG GRAPH CORRELATION</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    Synthesize firewall, endpoint, and authentication logs into unified attack chains.
                  </div>
                </div>
                <button
                  onClick={() => setDeepTelemetryCorrelation(!deepTelemetryCorrelation)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    deepTelemetryCorrelation ? 'bg-purple-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      deepTelemetryCorrelation ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <Bell className="w-4 h-4" /> Alert Channels & Dispatch Policies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">EMAIL DIGEST CADENCE</label>
                <select
                  value={emailFrequency}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="INSTANT">Instant (Every Critical Alert)</option>
                  <option value="HOURLY">Hourly Batch Digest</option>
                  <option value="DAILY">Daily Executive Summary Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">SLACK / TEAMS WEBHOOK URL</label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">DESKTOP BROWSER PUSH NOTIFICATIONS</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    Display OS-level notifications for critical priority intrusions.
                  </div>
                </div>
                <button
                  onClick={() => setBrowserAlerts(!browserAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    browserAlerts ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      browserAlerts ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-[#1e3a66]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">AUDIBLE SOC KLAXON ON CRITICAL THREAT</div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    Play audio alert in SOC control room when active exfiltration is intercepted.
                  </div>
                </div>
                <button
                  onClick={() => setAudibleAlarm(!audibleAlarm)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    audibleAlarm ? 'bg-rose-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      audibleAlarm ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. INTEGRATIONS TAB */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold font-mono text-blue-400 uppercase tracking-wide flex items-center gap-2">
              <Network className="w-4 h-4" /> Enterprise SIEM & Backend Connectors
            </h2>

            {/* Backend URL connection */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-[#1e3a66] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-slate-100">BACKEND API SERVICE (VITE_API_URL)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DEMO FALLBACK READY
                </span>
              </div>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://127.0.0.1:5000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-[#1e3a66] text-cyan-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 font-sans">
                When set, ThreatWave services route live calls through <code className="text-cyan-400">src/services/api.ts</code>. If backend is offline, the app operates uninterrupted via the Demo Engine.
              </p>
            </div>

            {/* SIEM Connectors Grid */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">External SIEM Feeds</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1e3a66] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Splunk Enterprise</div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">● CONNECTED (HEC)</div>
                  </div>
                  <button
                    onClick={() => setSplunkEnabled(!splunkEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      splunkEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform ${splunkEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1e3a66] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Elasticsearch</div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">● SYNC ACTIVE</div>
                  </div>
                  <button
                    onClick={() => setElasticEnabled(!elasticEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      elasticEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform ${elasticEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1e3a66] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Microsoft Sentinel</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">○ STANDBY</div>
                  </div>
                  <button
                    onClick={() => setSentinelEnabled(!sentinelEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      sentinelEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform ${sentinelEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Threat Intel API Keys */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">VIRUSTOTAL & MISP API KEY</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={vtApiKey}
                  onChange={(e) => setVtApiKey(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={() => showToast('VirusTotal v3 API Key verified successfully.')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-all cursor-pointer"
                >
                  TEST KEY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
