import React, { useState } from 'react';
import { Skull, Play, ShieldAlert, CheckCircle2, Zap, Check, Sparkles, Activity } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

export const AttackSimulator: React.FC = () => {
  const { state, simulateAttack } = useDemoEngine();
  const [selectedThreat, setSelectedThreat] = useState<string>('FULL_ATTACK_STORY');

  const attackTypes = [
    { 
      id: 'FULL_ATTACK_STORY', 
      name: 'FULL ATTACK STORY CHAIN', 
      tag: 'SIH LIVE DEMO',
      desc: 'Recon → Port Scan → Botnet C2 → DGA → Encrypted Session → Exfiltration → AI Correlation → Story → Incident → Resolution', 
      icon: '⚡', 
      color: 'border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40 bg-cyan-950/20' 
    },
    { 
      id: 'DDOS', 
      name: '1. DDoS / SYN Flood', 
      tag: 'SIH CORE #1',
      desc: 'High-volume 60,000 pps bandwidth exhaustion & abnormal traffic anomaly', 
      icon: '🌊', 
      color: 'border-blue-400 text-blue-300' 
    },
    { 
      id: 'BOTNET_C2', 
      name: '2. Botnet C2 Beaconing', 
      tag: 'SIH CORE #2',
      desc: 'Cobalt Strike malleable C2 heartbeat communication to foreign drop host', 
      icon: '🤖', 
      color: 'border-purple-400 text-purple-300' 
    },
    { 
      id: 'DGA_DNS_TUNNEL', 
      name: '3. DGA / DNS Tunnelling', 
      tag: 'SIH CORE #3',
      desc: 'Domain Generation Algorithm query bursts & covert DNS TXT data exfiltration', 
      icon: '📡', 
      color: 'border-amber-400 text-amber-300' 
    },
    { 
      id: 'MALICIOUS_ENCRYPTED_SESSION', 
      name: '4. Malicious Encrypted Sessions', 
      tag: 'SIH CORE #4',
      desc: 'Anomalous TLS handshake with mismatched JA3/JA3S client fingerprint', 
      icon: '🔐', 
      color: 'border-rose-400 text-rose-300' 
    },
    { 
      id: 'RECON_PORT_SCAN', 
      name: '5. Reconnaissance / Port Scan', 
      tag: 'SIH CORE #5',
      desc: 'Stealth TCP SYN sweeps against DMZ perimeter services & exposed ports', 
      icon: '🔍', 
      color: 'border-emerald-400 text-emerald-300' 
    },
    { 
      id: 'DATA_EXFILTRATION', 
      name: '6. Data Exfiltration', 
      tag: 'SIH CORE #6',
      desc: 'Unauthorized 2.4 GB egress stream intercepted on edge gateway', 
      icon: '💾', 
      color: 'border-red-500 text-red-300' 
    },
    { 
      id: 'SQL_INJECTION', 
      name: 'SQL Injection Attack', 
      tag: 'WEB THREAT',
      desc: 'Stacked SQL queries targeting customer credential database dump', 
      icon: '💉', 
      color: 'border-orange-400 text-orange-300' 
    },
    { 
      id: 'BRUTE_FORCE', 
      name: 'SSH Brute Force', 
      tag: 'AUTH THREAT',
      desc: 'High-speed automated credential stuffing against PAM auth layer', 
      icon: '🔑', 
      color: 'border-amber-500 text-amber-300' 
    }
  ];

  const handleStartSimulation = (threatId?: string) => {
    if (state.activeSimulation.isSimulating) return;
    simulateAttack(threatId || selectedThreat);
  };

  const currentSimulation = state.activeSimulation;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Hero Banner with Master Start Live Demo */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1527] via-[#0d1f3d] to-[#080d1a] border border-cyan-500/40 shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-cyan-400" /> ADVERSARY EMULATION & SIH DEMO ENGINE
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 100% SAFE LOCAL SIMULATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
            Attack Simulator & Unified Threat Pipeline
          </h1>
          <p className="text-slate-300 text-xs font-sans mt-1 leading-relaxed">
            Trigger individual SIH core threat vectors or launch the coordinated 10-stage ThreatWave Attack Story. 
            Events propagate seamlessly throughout telemetry feeds, radar blips, global attack arcs, AI correlation, and SOAR response actions.
          </p>
        </div>

        {/* Master Live Demo Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => handleStartSimulation('FULL_ATTACK_STORY')}
            disabled={currentSimulation.isSimulating}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{currentSimulation.isSimulating && currentSimulation.threatType === 'FULL_ATTACK_STORY' ? 'DEMO IN PROGRESS...' : 'START LIVE DEMO (FULL ATTACK STORY)'}</span>
          </button>
        </div>
      </div>

      {/* Select Attack Vector Scenario */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 uppercase tracking-wider text-[11px] block font-bold">
            1. SELECT ATTACK SCENARIO (6 SIH CORE THREATS + MASTER CHAIN)
          </span>
          <span className="text-cyan-400 text-[11px]">
            {attackTypes.length} SCENARIOS CONFIGURED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {attackTypes.map(att => {
            const isSelected = selectedThreat === att.id;
            return (
              <div
                key={att.id}
                onClick={() => !currentSimulation.isSimulating && setSelectedThreat(att.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${att.color} bg-slate-900 shadow-[0_0_20px_rgba(0,242,254,0.2)] font-bold`
                    : 'bg-[#0c1527] border-[#1e3a66]/70 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{att.icon}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                      {att.tag}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{att.name}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1 leading-snug">{att.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Launch Action Bar */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-cyan-400/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">SELECTED SCENARIO:</div>
          <div className="text-lg font-bold text-cyan-300">
            {attackTypes.find(a => a.id === selectedThreat)?.name}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Demonstrates detection, risk score adjustment, AI correlation, incident triage, and automated resolution.
          </div>
        </div>

        <button
          onClick={() => handleStartSimulation()}
          disabled={currentSimulation.isSimulating}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(244,63,94,0.5)] transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{currentSimulation.isSimulating ? 'SIMULATION RUNNING...' : 'START SIMULATION'}</span>
        </button>
      </div>

      {/* Live Pipeline Step Visualization */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] space-y-4 font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1e3a66] pb-3">
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>
              {currentSimulation.threatType === 'FULL_ATTACK_STORY' 
                ? 'THREATWAVE 10-STAGE ATTACK STORY CORRELATION PIPELINE' 
                : 'UNIFIED 12-STAGE AUTONOMOUS DETECTION PIPELINE'}
            </span>
          </div>
          <span className="text-cyan-300 text-[11px]">
            {currentSimulation.isSimulating ? (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                <Activity className="w-3.5 h-3.5" /> STAGE {currentSimulation.currentStepIndex + 1} OF {currentSimulation.pipeline.length}
              </span>
            ) : (
              'PIPELINE READY'
            )}
          </span>
        </div>

        {/* Pipeline Steps List */}
        <div className="space-y-2">
          {currentSimulation.pipeline.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isCurrent = step.status === 'RUNNING';

            return (
              <div
                key={step.step}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                    : isCompleted
                    ? 'bg-[#080d1a] border-emerald-500/40 text-slate-300'
                    : 'bg-[#080d1a]/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono border ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isCurrent
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.step}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold tracking-wide flex items-center gap-2">
                      <span>{step.name}</span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          EXECUTING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5 truncate">
                      {step.detail}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-[11px] font-mono">
                  {isCompleted && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-rose-400 font-bold animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                  {step.status === 'PENDING' && (
                    <span className="text-slate-600">PENDING</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
