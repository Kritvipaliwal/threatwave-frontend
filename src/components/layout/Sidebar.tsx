import React from 'react';
import { 
  Shield, Brain, Activity, Crosshair, Globe, GitFork, GitCommit, Fingerprint,
  Bug, FileCode2, Mail, Server, Award, Zap, Skull, BarChart3, FileText, Bell,
  Settings, ChevronLeft, ChevronRight, TrendingUp, Network, HardDrive, Cpu, HeartPulse
} from 'lucide-react';
import { ActivePage } from '../../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  unreadAlertsCount: number;
}

interface NavSection {
  title: string;
  items: {
    id: ActivePage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    color?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  unreadAlertsCount
}) => {
  const sections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'overview', label: 'Security Overview', icon: Shield, color: 'text-cyan-400' },
        { id: 'ai-assistant', label: 'AI Assistant', icon: Brain, color: 'text-purple-400' }
      ]
    },
    {
      title: 'DETECTION',
      items: [
        { id: 'live-detection', label: 'Live Threat Detection', icon: Activity, color: 'text-rose-400' },
        { id: 'anomaly-center', label: 'Anomaly Center', icon: TrendingUp, color: 'text-amber-400' },
        { id: 'threat-hunting', label: 'Threat Hunting', icon: Crosshair, color: 'text-amber-400' }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'threat-intelligence', label: 'Threat Intelligence', icon: Globe, color: 'text-blue-400' },
        { id: 'threat-graph', label: 'Threat Graph', icon: GitFork, color: 'text-cyan-400' },
        { id: 'attack-timeline', label: 'Attack Timeline', icon: GitCommit, color: 'text-amber-400' },
        { id: 'ioc-investigation', label: 'IOC Investigation', icon: Fingerprint, color: 'text-rose-400' },
        { id: 'evidence-explorer', label: 'Evidence Explorer', icon: HardDrive, color: 'text-cyan-400' }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { id: 'vulnerabilities', label: 'Vulnerability Analysis', icon: Bug, color: 'text-rose-400' },
        { id: 'malware', label: 'Malware Analysis', icon: FileCode2, color: 'text-red-400' },
        { id: 'phishing', label: 'Phishing Analyzer', icon: Mail, color: 'text-amber-400' }
      ]
    },
    {
      title: 'INFRASTRUCTURE',
      items: [
        { id: 'network-map', label: 'Live Network Map', icon: Network, color: 'text-emerald-400' },
        { id: 'assets', label: 'Asset Monitor', icon: Server, color: 'text-sky-400' },
        { id: 'security-posture', label: 'Risk & Security Posture', icon: Award, color: 'text-emerald-400' }
      ]
    },
    {
      title: 'RESPONSE',
      items: [
        { id: 'incident-response', label: 'Incident Response', icon: Zap, color: 'text-amber-400' },
        { id: 'attack-simulator', label: 'Attack Simulator', icon: Skull, color: 'text-rose-400' }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-blue-400' },
        { id: 'reports', label: 'Reports', icon: FileText, color: 'text-cyan-400' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, color: 'text-amber-400' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'system-flow', label: 'System Flow Pipeline', icon: Cpu, color: 'text-purple-400' },
        { id: 'system-health', label: 'System Health & Engine', icon: HeartPulse, color: 'text-teal-400' },
        { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-400' }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#080d1a] border-r border-[#1e3a66]/60 flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1e3a66]/60 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,242,254,0.35)]">
            <Shield className="w-5 h-5 text-black" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent truncate">
                THREATWAVE
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider truncate uppercase">
                AI CYBER SOC
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            {!collapsed && (
              <h2 className="text-[10px] font-bold font-mono tracking-wider text-slate-400 px-3 mb-2 uppercase">
                {section.title}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-white border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : (item.color || 'text-slate-400')}`} />
                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer DEFCON indicator */}
      <div className="p-3 border-t border-[#1e3a66]/60 bg-black/30">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow inline-block" />
            <span className="font-bold text-slate-200">{collapsed ? 'D4' : 'DEFCON 4'}</span>
          </div>
          {!collapsed && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              AI ACTIVE
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
