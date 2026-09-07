import React, { useState } from 'react';
import { 
  Bell, AlertCircle, CheckCircle2, ShieldAlert, 
  Trash2, CheckCheck, Clock, ExternalLink, Zap
} from 'lucide-react';
import { useDemoEngine } from '../demo/useDemoEngine';
import { demoEngine } from '../demo/demoEngine';
import { ActivePage } from '../types';

interface NotificationsProps {
  onNavigate?: (page: ActivePage) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const { notifications } = useDemoEngine();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'ANOMALY' | 'RESPONSE'>('ALL');
  const [clearedIds, setClearedIds] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.read && !clearedIds.includes(n.id)).length;

  const handleMarkAllRead = () => {
    demoEngine.markNotificationAsRead('all');
  };

  const handleMarkRead = (id: string) => {
    demoEngine.markNotificationAsRead(id);
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClearedIds(prev => [...prev, id]);
  };

  const filtered = notifications
    .filter(n => !clearedIds.includes(n.id))
    .filter(n => {
      if (activeFilter === 'UNREAD') return !n.read;
      if (activeFilter === 'CRITICAL') return n.severity === 'CRITICAL' || n.type === 'CRITICAL_THREAT';
      if (activeFilter === 'ANOMALY') return n.type === 'AI_ANOMALY';
      if (activeFilter === 'RESPONSE') return n.type === 'RESPONSE_SUCCESS';
      return true;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100 tracking-wide font-mono">
              NOTIFICATION & ALERT DISPATCH CENTER
            </h1>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                {unreadCount} UNREAD
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                ALL CAUGHT UP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time critical telemetry triggers, AI anomaly alerts, and automated SOAR response logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-[#1e3a66] text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs font-mono transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-cyan-400" />
            MARK ALL READ
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'ALL NOTIFICATIONS', count: notifications.length - clearedIds.length },
          { id: 'UNREAD', label: 'UNREAD ONLY', count: unreadCount },
          { id: 'CRITICAL', label: '🔴 CRITICAL THREATS' },
          { id: 'ANOMALY', label: '🟡 AI ANOMALIES' },
          { id: 'RESPONSE', label: '🟢 SOAR RESPONSES' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeFilter === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border border-[#1e3a66]/40 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0b1329]/60 border border-[#1e3a66]/40 text-slate-400 font-mono">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
            <div className="text-sm font-semibold text-slate-300">No alerts found in this view</div>
            <div className="text-xs text-slate-500 mt-1">SOC alert pipeline is normal and operating within healthy bounds</div>
          </div>
        ) : (
          filtered.map(item => {
            const isCritical = item.type === 'CRITICAL_THREAT' || item.severity === 'CRITICAL';
            const isAnomaly = item.type === 'AI_ANOMALY';
            const isResponse = item.type === 'RESPONSE_SUCCESS';

            return (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`p-4 rounded-xl transition-all cursor-pointer border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  item.read
                    ? 'bg-[#0b1329]/50 border-[#1e3a66]/40 opacity-75 hover:opacity-100 hover:border-[#1e3a66]'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:border-rose-500/70'
                    : isAnomaly
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70'
                    : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCritical
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : isAnomaly
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  }`}>
                    {isCritical && <ShieldAlert className="w-5 h-5 animate-pulse" />}
                    {isAnomaly && <AlertCircle className="w-5 h-5" />}
                    {isResponse && <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isAnomaly
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {isCritical ? '🔴 CRITICAL THREAT' : isAnomaly ? '🟡 AI ANOMALY' : '🟢 RESPONSE EXECUTED'}
                      </span>
                      
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" title="Unread" />
                      )}

                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {item.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-mono text-slate-100 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {isCritical && onNavigate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('incident-response');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-mono font-semibold transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-rose-400" />
                      VIEW INCIDENT
                    </button>
                  )}

                  {isAnomaly && onNavigate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('threat-hunting');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      INVESTIGATE
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDismiss(item.id, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Retention Policy Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1e3a66]/50 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>Retention Policy: Active alerts stored for 30 days in SOC immutable log stream.</span>
        </div>
        <span className="text-cyan-400">ENCRYPTION: AES-256 GCM</span>
      </div>
    </div>
  );
};
