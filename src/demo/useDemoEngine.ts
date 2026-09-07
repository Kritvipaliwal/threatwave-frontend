import { useState, useEffect } from 'react';
import { demoEngine, DemoState } from './demoEngine';

export function useDemoEngine(): DemoState & {
  state: DemoState;
  simulateAttack: (threatType: string) => Promise<void>;
  executeResponseAction: (action: string, target: string) => void;
  toggleDemoMode: (enabled?: boolean) => boolean;
  markNotificationAsRead: (id: string) => void;
} {
  const [state, setState] = useState<DemoState>(demoEngine.getState());

  useEffect(() => {
    const unsubscribe = demoEngine.subscribe(() => {
      setState({ ...demoEngine.getState() });
    });
    return unsubscribe;
  }, []);

  return {
    state,
    ...state,
    simulateAttack: (threatType: string) => demoEngine.simulateAttack(threatType),
    executeResponseAction: (action: string, target: string) => demoEngine.executeResponseAction(action, target),
    toggleDemoMode: (enabled?: boolean) => demoEngine.toggleDemoMode(enabled),
    markNotificationAsRead: (id: string) => demoEngine.markNotificationAsRead(id)
  };
}
