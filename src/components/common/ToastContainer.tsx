import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { NotificationItem } from '../../types';

interface ToastContainerProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss
}) => {
  // Show recent unread notifications as toasts
  const activeToasts = notifications.filter(n => !n.read).slice(0, 3);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {activeToasts.map(toast => {
        const isCritical = toast.severity === 'CRITICAL';
        const isSuccess = toast.type === 'RESPONSE_SUCCESS';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-bounce-short ${
              isCritical
                ? 'bg-[#0c1527]/95 border-rose-500/70 shadow-[0_0_24px_rgba(244,63,94,0.35)] text-white'
                : isSuccess
                ? 'bg-[#0c1527]/95 border-emerald-500/70 shadow-[0_0_24px_rgba(16,185,129,0.3)] text-white'
                : 'bg-[#0c1527]/95 border-amber-500/70 shadow-[0_0_24px_rgba(245,158,11,0.25)] text-white'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCritical ? (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              ) : isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Info className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0 font-mono text-xs">
              <div className="font-bold truncate">{toast.title}</div>
              <div className="text-[11px] text-slate-300 font-sans mt-0.5 leading-snug">
                {toast.message}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{toast.timestamp} UTC</div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
