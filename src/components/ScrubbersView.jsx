import React, { useState } from 'react';
import ScrubberCard from './ScrubberCard';
import { Search, Layers, LayoutGrid, List } from 'lucide-react';
import { evaluateStatus, getStatusColor } from '../data/scrubberData';

export default function ScrubbersView({ scrubbers, onSelectScrubber }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filtered = scrubbers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--text-main)',
            margin: '0 0 4px 0',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Layers size={24} color="var(--primary)" />
            <span>Pharmaceutical Scrubber Fleet</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Complete registry and real-time status of all unit scrubbers
          </p>
        </div>

        {/* View mode toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: viewMode === 'grid' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: viewMode === 'grid' ? 'rgba(21, 101, 192, 0.15)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <LayoutGrid size={15} />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: viewMode === 'table' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: viewMode === 'table' ? 'rgba(21, 101, 192, 0.15)' : 'transparent',
              color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <List size={15} />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '450px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <Search size={18} color="var(--text-dim)" />
        <input
          type="text"
          placeholder="Filter scrubbers by ID or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '14px',
            width: '100%'
          }}
        />
      </div>

      {/* Content Rendering */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {filtered.map(s => (
            <ScrubberCard key={s.id} scrubber={s} onClick={onSelectScrubber} />
          ))}
        </div>
      ) : (
        <div style={{
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          overflowX: 'auto',
          boxShadow: 'var(--card-shadow)',
          maxHeight: '700px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{
                position: 'sticky',
                top: 0,
                zIndex: 5,
                background: 'var(--bg-main)',
                color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                <th style={{ padding: '14px 18px' }}>Scrubber ID</th>
                <th style={{ padding: '14px 18px' }}>Location</th>
                <th style={{ padding: '14px 18px' }}>Current pH</th>
                <th style={{ padding: '14px 18px' }}>24h Avg pH</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Sensor Model</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const status = evaluateStatus(s.currentPh);
                const colorStyle = getStatusColor(status);
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectScrubber(s.id)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-main)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                      {s.location}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: colorStyle.text, fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
                      {s.currentPh.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                      {s.avgPh ? s.avgPh.toFixed(2) : '-'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: colorStyle.bg,
                        color: colorStyle.text,
                        border: `1px solid ${colorStyle.border}`
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-dim)', fontSize: '12px' }}>
                      {s.sensor ? s.sensor.model : 'Standard Probe'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectScrubber(s.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(21, 101, 192, 0.12)',
                          border: '1px solid rgba(21, 101, 192, 0.3)',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
