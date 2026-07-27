import React, { useState } from 'react';
import { Grid, Activity, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function ScrubberHeatmap({ scrubbers, onSelectScrubber, selectedScrubber }) {
  const [hoveredScrubber, setHoveredScrubber] = useState(null);

  // Take top 20 scrubbers to match 20 plant scrubber count requirement
  const displayScrubbers = scrubbers.slice(0, 20);

  return (
    <div className="glass-panel" style={{ padding: '18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={18} color="#2dd4bf" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
            Scrubber Fleet Heatmap
          </h2>
        </div>

        {/* Status Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}></span> &gt;85%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f59e0b' }}></span> 70-85%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }}></span> &lt;70%
          </span>
        </div>
      </div>

      {/* Grid of Scrubber Cells */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        flex: 1,
        alignContent: 'center'
      }}>
        {displayScrubbers.map((scb) => {
          const isSelected = selectedScrubber?.name === scb.name;
          const bg =
            scb.status === 'healthy' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)' :
            scb.status === 'warning' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%)' :
            'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(185, 28, 28, 0.2) 100%)';

          const borderColor =
            scb.status === 'healthy' ? 'rgba(52, 211, 153, 0.4)' :
            scb.status === 'warning' ? 'rgba(251, 191, 36, 0.5)' :
            'rgba(248, 113, 113, 0.8)';

          const textColor =
            scb.status === 'healthy' ? '#6ee7b7' :
            scb.status === 'warning' ? '#fcd34d' :
            '#fca5a5';

          return (
            <div
              key={scb.id}
              onClick={() => onSelectScrubber(scb)}
              onMouseEnter={() => setHoveredScrubber(scb)}
              onMouseLeave={() => setHoveredScrubber(null)}
              style={{
                background: bg,
                border: `1px solid ${isSelected ? '#ffffff' : borderColor}`,
                borderRadius: '8px',
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isSelected ? '0 0 14px rgba(255, 255, 255, 0.4)' : 'none',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.2px' }}>
                {scb.name}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: textColor, marginTop: '2px' }}>
                {scb.health}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover Information Strip */}
      <div style={{
        marginTop: '12px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '11.5px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {hoveredScrubber || selectedScrubber ? (
          <>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>
              {(hoveredScrubber || selectedScrubber).name} ({ (hoveredScrubber || selectedScrubber).fullName })
            </span>
            <span>
              pH: <strong style={{ color: '#2dd4bf' }}>{(hoveredScrubber || selectedScrubber).recent_pH}</strong> | Health: <strong style={{ color: '#5eead4' }}>{(hoveredScrubber || selectedScrubber).health}%</strong>
            </span>
          </>
        ) : (
          <span>Hover or click any scrubber tile for telemetry details</span>
        )}
      </div>

    </div>
  );
}
