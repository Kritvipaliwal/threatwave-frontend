import React, { useState, useEffect } from 'react';
import { ActivePage } from './types';
import { useDemoEngine } from './demo/useDemoEngine';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';

// Import All 19 Pages
import { SecurityOverview } from './pages/SecurityOverview';
import { AiAssistant } from './pages/AiAssistant';
import { LiveThreatDetection } from './pages/LiveThreatDetection';
import { ThreatHunting } from './pages/ThreatHunting';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { ThreatGraph } from './pages/ThreatGraph';
import { AttackTimeline } from './pages/AttackTimeline';
import { VulnerabilityAnalysis } from './pages/VulnerabilityAnalysis';
import { MalwareAnalysis } from './pages/MalwareAnalysis';
import { PhishingAnalyzer } from './pages/PhishingAnalyzer';
import { IocInvestigation } from './pages/IocInvestigation';
import { AssetMonitor } from './pages/AssetMonitor';
import { SecurityPosture } from './pages/SecurityPosture';
import { IncidentResponse } from './pages/IncidentResponse';
import { AttackSimulator } from './pages/AttackSimulator';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { LiveNetworkMap } from './pages/LiveNetworkMap';
import { AnomalyCenter } from './pages/AnomalyCenter';
import { EvidenceExplorer } from './pages/EvidenceExplorer';
import { SystemFlow } from './pages/SystemFlow';
import { SystemHealth } from './pages/SystemHealth';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const { state, toggleDemoMode, toggleLiveLabMode, markNotificationAsRead } = useDemoEngine();
  const unreadAlertsCount = state.notifications.filter(n => !n.read).length;

  // Global keyboard shortcuts (Ctrl+K or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render current active view
  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <SecurityOverview onNavigate={setActivePage} />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'live-detection':
        return <LiveThreatDetection />;
      case 'anomaly-center':
        return <AnomalyCenter />;
      case 'threat-hunting':
        return <ThreatHunting />;
      case 'threat-intelligence':
        return <ThreatIntelligence />;
      case 'threat-graph':
        return <ThreatGraph />;
      case 'attack-timeline':
        return <AttackTimeline />;
      case 'ioc-investigation':
        return <IocInvestigation />;
      case 'evidence-explorer':
        return <EvidenceExplorer />;
      case 'vulnerabilities':
        return <VulnerabilityAnalysis />;
      case 'malware':
        return <MalwareAnalysis />;
      case 'phishing':
        return <PhishingAnalyzer />;
      case 'network-map':
        return <LiveNetworkMap />;
      case 'assets':
        return <AssetMonitor />;
      case 'security-posture':
        return <SecurityPosture />;
      case 'incident-response':
        return <IncidentResponse />;
      case 'attack-simulator':
        return <AttackSimulator />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications onNavigate={setActivePage} />;
      case 'system-flow':
        return <SystemFlow />;
      case 'system-health':
        return <SystemHealth />;
      case 'settings':
        return <Settings />;
      default:
        return <SecurityOverview onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Fixed Collapsible Sidebar with 19 Navigation Items */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Fixed Top Navbar */}
      <TopNavbar
        collapsed={sidebarCollapsed}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadCount={unreadAlertsCount}
        onNavigate={setActivePage}
        demoMode={state.demoMode}
        liveLabMode={state.liveLabMode}
        onToggleDemoMode={toggleDemoMode}
        onToggleLiveLabMode={toggleLiveLabMode}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-20 px-6 min-h-screen ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <div className="max-w-[1720px] mx-auto">
          {renderActivePage()}
        </div>
      </main>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(page) => {
          setActivePage(page);
          setIsSearchOpen(false);
        }}
      />

      {/* Real-time Toast Notifications */}
      <ToastContainer
        notifications={state.notifications}
        onDismiss={markNotificationAsRead}
      />
    </div>
  );
};

export default App;
