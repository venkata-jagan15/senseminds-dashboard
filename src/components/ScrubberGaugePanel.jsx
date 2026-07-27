import React, { useState } from 'react';
import { Gauge, ShieldCheck, AlertCircle, Info, ChevronRight, Droplet } from 'lucide-react';

export default function ScrubberGaugePanel({ scrubbers, selectedScrubber, onSelectScrubber }) {
  // Calculate average health across scrubbers
  const overallHealth = Math.round(
    scrubbers.reduce((acc, curr) => acc + curr.health, 0) / (scrubbers.length || 1)
  );

  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallHealth / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={18} color="#2dd4bf" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
            Scrubber Health Index
          </h2>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '10px',
          background: 'rgba(20, 184, 166, 0.15)',
          color: '#2dd4bf',
          border: '1px solid rgba(20, 184, 166, 0.3)'
        }}>
          Real-Time
        </span>
      </div>

      {/* Main Circular Health Gauge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 0',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, rgba(3, 10, 22, 0.4) 70%)',
        borderRadius: '12px',
        border: '1px solid rgba(20, 184, 166, 0.15)',
        marginBottom: '16px',
        position: 'relative'
      }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="rgba(15, 23, 42, 0.8)"
            strokeWidth={strokeWidth}
          />

          {/* Glowing Animated gauge stroke */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 75 75)"
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />

          {/* Gauge Center Text */}
          <text x="75" y="68" textAnchor="middle" fill="#ffffff" fontSize="26" fontWeight="700" fontFamily="Outfit">
            {overallHealth}%
          </text>
          <text x="75" y="86" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" letterSpacing="1">
            PLANT HEALTH
          </text>
        </svg>

        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px' }}>
          <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
            18 Normal
          </span>
          <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }}></span>
            1 Warning
          </span>
          <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f87171' }}></span>
            1 Critical
          </span>
        </div>
      </div>

      {/* Scrubber Telemetry Breakdown List */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
        Scrubber Unit Telemetry
      </div>

      <div style={{
        flex: 1,
        maxHeight: '230px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingRight: '4px'
      }}>
        {scrubbers.map((scb) => {
          const isSelected = selectedScrubber?.name === scb.name;
          const statusColor =
            scb.status === 'healthy' ? '#34d399' :
            scb.status === 'warning' ? '#fbbf24' : '#f87171';
          const statusBg =
            scb.status === 'healthy' ? 'rgba(52, 211, 153, 0.12)' :
            scb.status === 'warning' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(248, 113, 113, 0.18)';

          return (
            <div
              key={scb.id}
              onClick={() => onSelectScrubber(scb)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: isSelected ? 'rgba(20, 184, 166, 0.18)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${isSelected ? 'rgba(45, 212, 191, 0.5)' : 'rgba(255, 255, 255, 0.04)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(15, 34, 64, 0.6)';
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplet size={14} color={statusColor} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#f1f5f9' }}>
                    {scb.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                    pH: <span style={{ color: statusColor, fontWeight: 600 }}>{scb.recent_pH}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Mini progress bar */}
                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${scb.health}%`,
                    height: '100%',
                    background: statusColor,
                    borderRadius: '2px'
                  }}></div>
                </div>

                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: statusColor,
                  minWidth: '32px',
                  textAlign: 'right'
                }}>
                  {scb.health}%
                </span>

                <ChevronRight size={14} color="var(--text-dim)" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
