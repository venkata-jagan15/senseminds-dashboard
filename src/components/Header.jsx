import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Cpu, RefreshCw, Zap, Bell, Sliders } from 'lucide-react';

export default function Header({ onSimulate, activeAlerts, onRefresh }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC+5:30');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel" style={{ padding: '14px 24px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(20, 184, 166, 0.5)',
            border: '1px solid rgba(45, 212, 191, 0.4)'
          }}>
            <Cpu size={26} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #ffffff 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                SenseMinds
              </h1>
              <span style={{
                color: 'var(--accent-teal)',
                fontSize: '18px',
                fontWeight: 300,
                opacity: 0.8
              }}>|</span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 500,
                color: '#e2e8f0',
                letterSpacing: '0.3px'
              }}>
                Environmental Intelligence Platform
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-dot pulse-dot-green"></span>
                Laurus Labs Unit 1 • Operations Center
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {timeStr || '13:30:11 UTC+5:30'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Active Alerts Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontSize: '12.5px',
            fontWeight: 600
          }}>
            <Bell size={15} color="#ef4444" className="pulse-dot-red" />
            <span>{activeAlerts} Active Alerts</span>
          </div>

          {/* Telemetry Live Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(20, 184, 166, 0.12)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            color: '#2dd4bf',
            fontSize: '12.5px',
            fontWeight: 500
          }}>
            <Activity size={15} color="#2dd4bf" />
            <span>AI Telemetry Active</span>
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={onSimulate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1px solid var(--border-cyan-bright)',
              color: '#5eead4',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(20, 184, 166, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Zap size={14} color="#5eead4" />
            Simulate SCB-301 Anomaly
          </button>

          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-cyan)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Refresh Data"
            onMouseOver={(e) => e.currentTarget.style.color = '#2dd4bf'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <RefreshCw size={15} />
          </button>
        </div>

      </div>
    </header>
  );
}
