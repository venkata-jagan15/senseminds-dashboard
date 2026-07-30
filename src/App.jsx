import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ScrubbersView from './components/ScrubbersView';
import ScrubberDetailView from './components/ScrubberDetailView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AICopilotChat from './components/AICopilotChat';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import CommandCenterView from './components/CommandCenterView';
import { Activity, Menu } from 'lucide-react';

import { INITIAL_SCRUBBERS, INITIAL_ALERTS } from './data/scrubberData';

export default function App() {
  const [activeTab, setActiveTab] = useState('center');
  const [previousTab, setPreviousTab] = useState('center');
  const [selectedScrubberId, setSelectedScrubberId] = useState(null);

  const [scrubbers, setScrubbers] = useState(INITIAL_SCRUBBERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [toast, setToast] = useState(null);
  
  // Landing Page & Login State Machine: 'landing' | 'login' | 'dashboard'
  const [viewState, setViewState] = useState('landing');
  const [isExiting, setIsExiting] = useState(false);

  // Mobile navigation drawer state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Theme state: 'light' (default) | 'dark'
  const [theme, setTheme] = useState('light');

  const handleEnterDashboard = () => {
    setIsExiting(true);
    setTimeout(() => {
      setViewState('login');
      setIsExiting(false);
    }, 450);
  };

  const handleLoginSuccess = () => {
    setIsExiting(true);
    setTimeout(() => {
      setViewState('dashboard');
      setIsExiting(false);
      showToast('🔑 Administrator Session Authorized', 'success');
    }, 450);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast notification helper with 4s auto-dismiss
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Select a scrubber to open Detail page
  const handleSelectScrubber = (id) => {
    setSelectedScrubberId(id);
    if (activeTab !== 'detail') {
      setPreviousTab(activeTab);
    }
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go back from Detail page
  const handleBackFromDetail = () => {
    setActiveTab(previousTab || 'dashboard');
  };

  // Toggle Alert Status (Open <-> Resolved)
  const handleToggleAlertStatus = (alertId) => {
    setAlerts(prev => prev.map(alt => {
      if (alt.id === alertId) {
        const nextStatus = alt.status === 'Open' ? 'Resolved' : 'Open';
        showToast(
          nextStatus === 'Resolved'
            ? `Alert ${alt.id} marked as Resolved.`
            : `Alert ${alt.id} reopened.`,
          nextStatus === 'Resolved' ? 'success' : 'warning'
        );
        return { ...alt, status: nextStatus };
      }
      return alt;
    }));
  };

  // Refresh / Sync Live Telemetry
  const handleRefreshTelemetry = () => {
    setScrubbers(prev => prev.map(s => {
      const delta = (Math.random() * 0.2 - 0.1);
      const newPh = Math.max(7.2, Math.min(13.5, +(s.currentPh + delta).toFixed(2)));
      return {
        ...s,
        currentPh: newPh,
        lastUpdated: 'Just now'
      };
    }));
    showToast('🔄 Live telemetry synced with plant CEMS sensors', 'success');
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'Open').length;
  const currentScrubber = scrubbers.find(s => s.id === selectedScrubberId) || scrubbers[0];

  // Render Landing Page
  if (viewState === 'landing') {
    return (
      <div className={isExiting ? "landing-exit-active" : ""} style={{ transition: 'opacity 0.45s ease-out' }}>
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      </div>
    );
  }

  // Render Admin Login Page
  if (viewState === 'login') {
    return (
      <div className={isExiting ? "landing-exit-active" : ""} style={{ transition: 'opacity 0.45s ease-out' }}>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* 1. Sidebar Navigation (Supports Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab === 'detail' ? previousTab : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail') setSelectedScrubberId(null);
        }}
        activeAlertsCount={activeAlertsCount}
        scrubbersCount={scrubbers.length}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* 2. Main Content Container */}
      <main style={{
        flex: 1,
        padding: '0 32px 40px 32px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Top Header Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="mobile-header-btn btn-interactive"
            aria-label="Open menu"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Menu size={18} color="var(--primary)" />
            <span>Menu</span>
          </button>

          <div style={{ marginLeft: 'auto' }}>
            <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Floating Toast Notification */}
        {toast && (
          <div className="toast-slide-in" style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '10px',
            background: toast.type === 'warning' ? 'var(--accent-warning)' : toast.type === 'danger' ? 'var(--accent-danger)' : 'var(--primary)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {toast.message}
          </div>
        )}

        {/* View Routing with Smooth Page Transitions */}
        <div key={activeTab + (selectedScrubberId || '')} className="page-transition">
          {activeTab === 'dashboard' && (
            <DashboardView
              scrubbers={scrubbers}
              onSelectScrubber={handleSelectScrubber}
              onRefresh={handleRefreshTelemetry}
            />
          )}

          {activeTab === 'scrubbers' && (
            <ScrubbersView
              scrubbers={scrubbers}
              onSelectScrubber={handleSelectScrubber}
            />
          )}

          {activeTab === 'detail' && (
            <ScrubberDetailView
              scrubber={currentScrubber}
              alerts={alerts}
              onBack={handleBackFromDetail}
              onResolveAlert={(id) => handleToggleAlertStatus(id)}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onToggleAlertStatus={handleToggleAlertStatus}
              onSelectScrubber={handleSelectScrubber}
            />
          )}

          {activeTab === 'center' && (
            <CommandCenterView />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              scrubbers={scrubbers}
              alerts={alerts}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'graph' && (
            <KnowledgeGraphView />
          )}

          {activeTab === 'copilot' && (
            <AICopilotChat />
          )}
        </div>

        {/* Universal Footer */}
        <footer style={{
          marginTop: 'auto',
          paddingTop: '30px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--text-dim)',
          gap: '10px'
        }}>
          <span>SenseMinds Industrial Environmental Intelligence v5.0 • Scrubber pH CEMS</span>
          <span>Laurus Labs Pharmaceutical Unit 1 Operations</span>
          <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>pH Telemetry Engine: Active</span>
        </footer>

      </main>

    </div>
  );
}
