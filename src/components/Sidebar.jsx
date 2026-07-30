import {
  LayoutDashboard,
  Layers,
  AlertTriangle,
  FileBarChart,
  Settings,
  Activity,
  Bot,
  Network,
  ShieldAlert,
  X
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Sidebar({ activeTab, setActiveTab, activeAlertsCount, scrubbersCount, isOpen, onClose }) {
  const navItems = [
    { id: 'center', label: 'Command Center', icon: ShieldAlert },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scrubbers', label: 'Scrubbers', icon: Layers, badge: scrubbersCount },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: activeAlertsCount, badgeColor: 'var(--accent-danger)' },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside
        className={`sidebar-container ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          minWidth: '260px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '24px 16px',
          zIndex: 100,
          userSelect: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 24px 8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={logoImg}
              alt="SenseMinds Logo"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                objectFit: 'contain',
                boxShadow: '0 8px 24px rgba(21, 101, 192, 0.5)',
                background: '#ffffff'
              }}
            />
            <div>
              <div style={{
                fontSize: '17px',
                fontWeight: 800,
                letterSpacing: '0.3px',
                color: 'var(--primary)',
                fontFamily: 'var(--font-heading)'
              }}>
                SenseMinds
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--secondary)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                pH Sentinel CEMS
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className="mobile-header-btn btn-interactive"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1
        }}>
          <div style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            padding: '0 12px 6px 12px'
          }}>
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="btn-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isActive
                    ? 'rgba(21, 101, 192, 0.1)'
                    : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} className="icon-hover-scale" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: item.badgeColor ? 'rgba(220, 38, 38, 0.15)' : 'rgba(21, 101, 192, 0.15)',
                    color: item.badgeColor ? 'var(--accent-danger)' : 'var(--primary)',
                    border: item.badgeColor ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(21, 101, 192, 0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System Status Footer Box */}
        <div style={{
          marginTop: 'auto',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot pulse-dot-green"></span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>CEMS Telemetry</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--secondary)', fontWeight: 800 }}>ONLINE</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            Pharma Unit 1 • Scrubber Monitoring
          </div>
        </div>
      </aside>
    </>
  );
}
