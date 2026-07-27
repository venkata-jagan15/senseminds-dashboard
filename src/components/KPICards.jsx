import React from 'react';
import { Wind, TestTube, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

export default function KPICards({ summaryData }) {
  // Use exact prompt values as defaults, or fallback to passed data
  const avgVOC = summaryData?.avg_voc ?? 24;
  const avgPH = summaryData?.avg_scrubber_ph ?? 10.8;
  const healthyScrubbers = `${summaryData?.healthy_count ?? 18}/${summaryData?.total_count ?? 20}`;
  const activeAlerts = summaryData?.active_alerts ?? 2;

  const cards = [
    {
      id: 'voc',
      title: 'Average VOC',
      value: `${avgVOC} µg/m³`,
      subtext: 'Safety limit < 50 µg/m³',
      trend: '-1.4% past 24h',
      trendType: 'good',
      icon: Wind,
      iconColor: '#2dd4bf',
      gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
      borderColor: 'rgba(20, 184, 166, 0.35)',
      badge: 'Normal Range'
    },
    {
      id: 'ph',
      title: 'Average Scrubber pH',
      value: `${avgPH}`,
      subtext: 'Optimal alkali band 10.2 - 11.5',
      trend: 'SCB-301 dip detected',
      trendType: 'warning',
      icon: TestTube,
      iconColor: '#38bdf8',
      gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      badge: 'Optimal Target'
    },
    {
      id: 'healthy',
      title: 'Healthy Scrubbers',
      value: healthyScrubbers,
      subtext: '90% Operational Readiness',
      trend: '18 Units Active & Safe',
      trendType: 'good',
      icon: CheckCircle2,
      iconColor: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      badge: '90% Healthy'
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: `${activeAlerts}`,
      subtext: 'SCB-301 pH drop & VOC warning',
      trend: 'Action Recommended',
      trendType: 'danger',
      icon: AlertTriangle,
      iconColor: '#f87171',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(245, 158, 11, 0.08) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      badge: 'Attention Needed'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            className="glass-panel"
            style={{
              padding: '18px 20px',
              background: c.gradient,
              borderColor: c.borderColor,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Row: Title & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.2px' }}>
                {c.title}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '12px',
                background: c.id === 'alerts' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(20, 184, 166, 0.15)',
                color: c.id === 'alerts' ? '#fca5a5' : '#5eead4',
                border: `1px solid ${c.id === 'alerts' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(45, 212, 191, 0.3)'}`
              }}>
                {c.badge}
              </span>
            </div>

            {/* Middle Row: Main Metric Value & Icon */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}>
                {c.value}
              </span>

              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${c.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={22} color={c.iconColor} />
              </div>
            </div>

            {/* Bottom Row: Subtext & Trend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-dim)' }}>
                {c.subtext}
              </span>

              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
                color: c.trendType === 'danger' ? '#f87171' : c.trendType === 'warning' ? '#fbbf24' : '#34d399'
              }}>
                {c.trendType === 'danger' || c.trendType === 'warning' ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                {c.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
