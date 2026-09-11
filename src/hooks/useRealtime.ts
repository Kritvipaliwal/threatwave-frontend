import { useState, useEffect } from 'react';
import { realtimeService, TelemetryStats } from '../services/realtime';
import { SecurityEvent } from '../types';
import { ThreatProfile, CORE_THREAT_PROFILES } from '../data/demoData';

export function useRealtime() {
  const [stats, setStats] = useState<TelemetryStats>(realtimeService.getStats());
  const [latestEvent, setLatestEvent] = useState<SecurityEvent | null>(null);
  const [latestThreat, setLatestThreat] = useState<ThreatProfile | null>(CORE_THREAT_PROFILES[0]);
  const [connectionState, setConnectionState] = useState<{ connected: boolean; mode: string }>({
    connected: true,
    mode: 'LIVE_TELEMETRY'
  });

  useEffect(() => {
    const unsubEvent = realtimeService.on('new_security_event', (ev: SecurityEvent) => {
      setLatestEvent(ev);
      setStats(realtimeService.getStats());
    });

    const unsubThreat = realtimeService.on('new_threat', (thr: ThreatProfile) => {
      setLatestThreat(thr);
      setStats(realtimeService.getStats());
    });

    const unsubRisk = realtimeService.on('risk_score_update', () => {
      setStats(realtimeService.getStats());
    });

    const unsubConn = realtimeService.on('connection_change', (conn) => {
      setConnectionState(conn);
    });

    return () => {
      unsubEvent();
      unsubThreat();
      unsubRisk();
      unsubConn();
    };
  }, []);

  return {
    stats,
    latestEvent,
    latestThreat,
    connectionState,
    emitEvent: realtimeService.emit.bind(realtimeService)
  };
}

export default useRealtime;
