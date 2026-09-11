import React, { useState, useEffect } from 'react';
import { Search, Bell, Radio, Activity, Wifi, WifiOff, Settings as SettingsIcon, X, Check, ShieldCheck } from 'lucide-react';
import { ActivePage } from '../../types';
import { realtimeClient, ConnectionStatus } from '../../api/realtime';

interface TopNavbarProps {
  collapsed: boolean;
  onOpenSearch: () => void;
  unreadCount: number;
  onNavigate: (page: ActivePage) => void;
  demoMode: boolean;
  liveLabMode: boolean;
  onToggleDemoMode: () => void;
  onToggleLiveLabMode: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  collapsed,
  onOpenSearch,
  unreadCount,
  onNavigate,
  demoMode,
  liveLabMode,
  onToggleDemoMode,
  onToggleLiveLabMode
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [connStatus, setConnStatus] = useState<ConnectionStatus>(realtimeClient.getStatus());
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [apiUrlInput, setApiUrlInput] = useState<string>(realtimeClient.getApiBaseUrl());
  const [wsUrlInput, setWsUrlInput] = useState<string>(realtimeClient.getWsUrl());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = realtimeClient.onStatus((status) => {
      setConnStatus(status);
    });
    return unsub;
  }, []);

  const handleSaveConfig = () => {
    realtimeClient.setBackendUrls(apiUrlInput.trim(), wsUrlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowConfigModal(false);
    }, 900);
  };

  const handlePresetLocal = () => {
    setApiUrlInput('http://127.0.0.1:8000/api');
    setWsUrlInput('ws://127.0.0.1:8000/ws');
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-16 z-30 bg-[#080d1a]/95 backdrop-blur-md border-b border-[#1e3a66]/60 flex items-center justify-between px-6 transition-all duration-300 ${
          collapsed ? 'left-20' : 'left-72'
        }`}
      >
        {/* Left: Status Badges & Search */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2.5 text-[11px] font-mono">
            {/* System Online Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">SOC ENGINE ONLINE</span>
            </div>

            {/* Live Backend Connection Pill */}
            <button
              onClick={() => setShowConfigModal(true)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-mono transition-all hover:brightness-125 ${
                connStatus === 'CONNECTED'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : connStatus === 'CONNECTING'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title="Click to configure backend connection URL"
            >
              {connStatus === 'CONNECTED' ? (
                <Wifi className="w-3 h-3 text-emerald-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-slate-500" />
              )}
              <span className="font-semibold">
                {connStatus === 'CONNECTED'
                  ? 'BACKEND: LIVE'
                  : connStatus === 'CONNECTING'
                  ? 'CONNECTING...'
                  : 'BACKEND: OFFLINE'}
              </span>
              <SettingsIcon className="w-2.5 h-2.5 opacity-60 ml-0.5" />
            </button>
          </div>

          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-[#1e3a66] text-slate-400 hover:text-slate-200 hover:border-cyan-400/50 transition-all text-xs font-mono"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search IP, Hash, CVE, Incident...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Mode Toggles, Clock, Alerts, Profile */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher Group */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900/90 border border-[#1e3a66]/80 text-xs font-mono">
            {/* LIVE LAB MODE Button */}
            <button
              onClick={onToggleLiveLabMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all ${
                liveLabMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Real Passive Lab Detection (Receives live telemetry from FastAPI sensor)"
            >
              <Activity className={`w-3.5 h-3.5 ${liveLabMode ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span>LIVE LAB</span>
              {liveLabMode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
            </button>

            {/* DEMO MODE Button */}
            <button
              onClick={onToggleDemoMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all ${
                demoMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Synthetic Autonomous Demo Ticker"
            >
              <Radio className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <span>DEMO MODE</span>
            </button>
          </div>

          {/* Real-time Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-300 px-2 py-1 bg-slate-900/50 rounded border border-[#1e3a66]/40">
            <span className="text-cyan-400">⏱</span>
            <span>{timeStr}</span>
          </div>

          {/* Notifications Icon */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-lg bg-slate-900/80 border border-[#1e3a66] text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Operator Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#1e3a66]/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-black font-mono shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              SOC
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-bold text-slate-200">SecOps Lead</div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Passive Guard
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backend Connection Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-xl w-full max-w-md p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a66]">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold">
                <SettingsIcon className="w-4 h-4 text-cyan-400" />
                <span>Backend Telemetry Gateway</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 my-3 leading-relaxed">
              Connect this ThreatWeave SOC console directly to your local FastAPI detector or tunnel URL for real-time passive packet telemetry.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  API Base URL:
                </label>
                <input
                  type="text"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-[#1e3a66] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  placeholder="http://127.0.0.1:8000/api"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  WebSocket URL:
                </label>
                <input
                  type="text"
                  value={wsUrlInput}
                  onChange={(e) => setWsUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-[#1e3a66] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  placeholder="ws://127.0.0.1:8000/ws"
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Quick Preset:</span>
                <button
                  type="button"
                  onClick={handlePresetLocal}
                  className="text-cyan-400 hover:underline"
                >
                  Local Lab (127.0.0.1:8000)
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Current Status:</span>
                <span
                  className={`font-bold ${
                    connStatus === 'CONNECTED'
                      ? 'text-emerald-400'
                      : connStatus === 'CONNECTING'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  ● {connStatus}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save & Reconnect</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
