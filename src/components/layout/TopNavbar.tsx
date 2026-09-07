import React, { useState, useEffect } from 'react';
import { Search, Bell, Radio, User } from 'lucide-react';
import { ActivePage } from '../../types';

interface TopNavbarProps {
  collapsed: boolean;
  onOpenSearch: () => void;
  unreadCount: number;
  onNavigate: (page: ActivePage) => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  collapsed,
  onOpenSearch,
  unreadCount,
  onNavigate,
  demoMode,
  onToggleDemoMode
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-30 bg-[#080d1a]/90 backdrop-blur-md border-b border-[#1e3a66]/60 flex items-center justify-between px-6 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Left: Status Badges */}
      <div className="flex items-center gap-4">
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold">AI ENGINE ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-semibold">THREATS LIVE</span>
          </div>
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

      {/* Right: Demo Mode, Clock, Alerts, Profile */}
      <div className="flex items-center gap-4">
        {/* Demo Mode Toggle */}
        <button
          onClick={onToggleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
            demoMode
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
          title="Toggle autonomous synthetic attack feed"
        >
          <Radio className={`w-3.5 h-3.5 ${demoMode ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          <span>DEMO MODE: {demoMode ? 'ON' : 'PAUSED'}</span>
        </button>

        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-300">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-black font-mono">
            SA
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <div className="font-bold text-slate-200">SecOps Lead</div>
            <div className="text-[10px] text-slate-400 font-mono">Tier-3 Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
