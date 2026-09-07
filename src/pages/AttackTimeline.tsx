import React, { useState } from 'react';
import { GitCommit, ShieldAlert, CheckCircle2, ChevronRight, Clock, AlertTriangle, Eye } from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';

export const AttackTimeline: React.FC = () => {
  const { state } = useDemoEngine();
  const [selectedStage, setSelectedStage] = useState<number>(2); // EXPLOITATION active

  const stages = [
    { id: 0, code: 'T1595', name: 'RECONNAISSANCE', time: '20:45 UTC', desc: 'Stealth TCP SYN sweeps and service enumeration across perimeter firewalls.', status: 'COMPLETED', sev: 'MEDIUM' },
    { id: 1, code: 'T1190', name: 'INITIAL ACCESS', time: '20:48 UTC', desc: 'Reverse proxy parameter tampering targeting public authentication endpoints.', status: 'COMPLETED', sev: 'HIGH' },
    { id: 2, code: 'T1059', name: 'EXPLOITATION', time: '20:52 UTC', desc: "Stacked SQL injection syntax `' OR 1=1--` injected into database backend query.", status: 'ACTIVE', sev: 'CRITICAL' },
    { id: 3, code: 'T1078', name: 'PERSISTENCE', time: 'Pending', desc: 'Attempted creation of rogue service account in auth LDAP directory.', status: 'PENDING', sev: 'HIGH' },
    { id: 4, code: 'T1068', name: 'PRIVILEGE ESCALATION', time: 'Pending', desc: 'Exploit attempted against unpatched kernel vulnerability on host.', status: 'PENDING', sev: 'CRITICAL' },
    { id: 5, code: 'T1021', name: 'LATERAL MOVEMENT', time: 'Pending', desc: 'Pivoting from DMZ web host to internal customer database subnet.', status: 'PENDING', sev: 'HIGH' },
    { id: 6, code: 'T1041', name: 'EXFILTRATION', time: 'Contained', desc: 'ThreatWave automated egress firewall rule intercepted bulk outbound data stream.', status: 'CONTAINED', sev: 'LOW' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-[#1e3a66] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <GitCommit className="w-3 h-3" /> MITRE ATT&CK PROGRESSION
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">CHRONOLOGICAL FORENSICS RECONSTRUCTION</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Attack Timeline & Kill Chain Sequence
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Step-by-step reconstruction of adversary intrusion vectors, dwell time, and automated containment actions.
          </p>
        </div>
      </div>

      {/* Kill Chain Stage Stepper */}
      <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66]/60">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 font-mono text-xs">
          {stages.map((st, i) => {
            const isActive = st.status === 'ACTIVE';
            const isDone = st.status === 'COMPLETED';
            const isContained = st.status === 'CONTAINED';

            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => setSelectedStage(st.id)}
                  className={`flex-1 min-w-[125px] p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    isActive
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.35)]'
                      : isDone
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      : isContained
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] text-cyan-400 font-bold">{st.code}</div>
                  <div className="text-xs font-bold truncate mt-0.5">{st.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />}
                    <span>{st.status}</span>
                  </div>
                </div>
                {i < stages.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Chronological Vertical Timeline with Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-[#0c1527] border border-[#1e3a66] space-y-6">
            <div className="flex items-center justify-between font-mono text-xs border-b border-[#1e3a66] pb-3">
              <span className="font-bold text-white uppercase">Adversary Intrusion Event Sequence</span>
              <span className="text-cyan-300">INCIDENT #TW-2048 RECONSTRUCTION</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/30">
              {stages.map(st => {
                const isSelected = selectedStage === st.id;
                const isAct = st.status === 'ACTIVE';

                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStage(st.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400/60 shadow-[0_0_16px_rgba(0,242,254,0.15)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Circle badge on line */}
                    <div className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 border-[#0c1527] ${
                      isAct ? 'bg-rose-500 animate-ping' : (st.status === 'COMPLETED' ? 'bg-cyan-400' : 'bg-slate-700')
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {st.code}
                        </span>
                        <span className="font-bold text-white text-sm">{st.name}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {st.time}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans mt-2">
                      {st.desc}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">AFFECTED HOST: <strong className="text-cyan-400">Prod-DB-01</strong></span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        st.sev === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {st.sev}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage AI Forensic Evidence Drawer */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0c1527] border border-[#1e3a66] space-y-4 font-mono text-xs">
          <div className="border-b border-[#1e3a66] pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase">AI Forensic Synthesis</span>
            <span className="text-cyan-300">{stages[selectedStage].code}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase">SELECTED KILL CHAIN STAGE</div>
            <div className="text-lg font-bold text-white">{stages[selectedStage].name}</div>
            <div className="text-slate-400 text-xs font-sans leading-relaxed">
              {stages[selectedStage].desc}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase">RECOMMENDED CONTAINMENT ACTION</div>
            <p className="text-xs font-sans text-emerald-400 font-bold leading-relaxed">
              Enforce WAF request validation filter and rotate PostgreSQL database connection strings across cluster.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div>TARGET HOST: <strong className="text-white">Prod-DB-01 (10.0.1.50)</strong></div>
            <div>ADVERSARY IP: <strong className="text-rose-400">185.220.101.5</strong></div>
            <div>INCIDENT STATUS: <strong className="text-cyan-300">INVESTIGATING</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
