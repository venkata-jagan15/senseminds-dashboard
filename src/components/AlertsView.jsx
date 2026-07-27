import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  ShieldAlert,
  Check,
  ArrowUpDown
} from 'lucide-react';
import { getStatusColor } from '../data/scrubberData';

export default function AlertsView({ alerts, onToggleAlertStatus, onSelectScrubber }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtering & Sorting
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      const matchSearch =
        alt.scrubberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alt.possibleCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alt.recommendedAction.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLevel = levelFilter === 'All' || alt.alertLevel.toLowerCase() === levelFilter.toLowerCase();
      const matchStatus = statusFilter === 'All' || alt.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchLevel && matchStatus;
    }).sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time}`).getTime();
      const timeB = new Date(`${b.date}T${b.time}`).getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    });
  }, [alerts, searchTerm, levelFilter, statusFilter, sortAsc]);

  const openCount = alerts.filter(a => a.status === 'Open').length;
  const criticalCount = alerts.filter(a => a.alertLevel === 'Critical' && a.status === 'Open').length;
  const warningCount = alerts.filter(a => a.alertLevel === 'Warning' && a.status === 'Open').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
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
            <ShieldAlert size={24} color="var(--accent-danger)" className="icon-hover-scale" />
            <span>pH Telemetry Safety & Alarm Log</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Automated anomaly detection alerts based on plant pH safety thresholds
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            className={criticalCount > 0 ? 'status-badge-critical' : ''}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(220, 38, 38, 0.12)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--accent-danger)',
              fontSize: '12.5px',
              fontWeight: 700
            }}
          >
            Critical Open: {criticalCount}
          </div>

          <div
            className={warningCount > 0 ? 'status-badge-warning' : ''}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(217, 119, 6, 0.12)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              color: 'var(--accent-warning)',
              fontSize: '12.5px',
              fontWeight: 700
            }}
          >
            Warning Open: {warningCount}
          </div>

          <div style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(21, 101, 192, 0.12)',
            border: '1px solid rgba(21, 101, 192, 0.3)',
            color: 'var(--primary)',
            fontSize: '12.5px',
            fontWeight: 700
          }}>
            Total Active: {openCount}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '16px 20px',
        borderRadius: '14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '8px 14px',
          minWidth: '280px',
          flex: '1 max-content'
        }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search alerts by Scrubber ID, Cause, or Action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>

        {/* Level Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginRight: '2px' }}>Alert Level:</span>
          {['All', 'Critical', 'Warning', 'Healthy'].map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className="btn-interactive"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: levelFilter === level ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: levelFilter === level ? 'rgba(21, 101, 192, 0.15)' : 'transparent',
                color: levelFilter === level ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginRight: '2px' }}>Status:</span>
          {['All', 'Open', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn-interactive"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: statusFilter === st ? '1px solid var(--secondary)' : '1px solid var(--border-subtle)',
                background: statusFilter === st ? 'rgba(46, 125, 50, 0.15)' : 'transparent',
                color: statusFilter === st ? 'var(--secondary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="btn-interactive"
            title="Toggle Sort Order"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <ArrowUpDown size={14} />
            <span>{sortAsc ? 'Oldest' : 'Newest'}</span>
          </button>
        </div>
      </div>

      {/* Main Alerts Table */}
      <div style={{
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)'
      }}>
        {filteredAlerts.length > 0 ? (
          <div style={{ overflowX: 'auto', maxHeight: '700px' }}>
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
                  <th style={{ padding: '14px 16px' }}>Date</th>
                  <th style={{ padding: '14px 16px' }}>Time</th>
                  <th style={{ padding: '14px 16px' }}>Scrubber ID</th>
                  <th style={{ padding: '14px 16px' }}>Current pH</th>
                  <th style={{ padding: '14px 16px' }}>Alert Level</th>
                  <th style={{ padding: '14px 16px' }}>Alert Description</th>
                  <th style={{ padding: '14px 16px' }}>Possible Cause</th>
                  <th style={{ padding: '14px 16px' }}>Recommended Action</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alt, index) => {
                  const levelColor = getStatusColor(alt.alertLevel);
                  return (
                    <tr
                      key={alt.id}
                      className="animate-row"
                      style={{
                        '--row-index': index,
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-main)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {alt.date}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {alt.time}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => onSelectScrubber(alt.scrubberId)}
                          className="btn-interactive"
                          style={{
                            background: 'rgba(21, 101, 192, 0.12)',
                            border: '1px solid rgba(21, 101, 192, 0.3)',
                            borderRadius: '6px',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          {alt.scrubberId}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: levelColor.text, fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
                        {alt.currentPh.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: levelColor.bg,
                          color: levelColor.text,
                          border: `1px solid ${levelColor.border}`
                        }}>
                          {alt.alertLevel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600, maxWidth: '240px' }}>
                        {alt.description}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                        {alt.possibleCause}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--primary)', fontSize: '12.5px', fontWeight: 600 }}>
                        {alt.recommendedAction}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => onToggleAlertStatus(alt.id)}
                          className="btn-interactive"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: alt.status === 'Open' ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(46, 125, 50, 0.4)',
                            background: alt.status === 'Open' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(46, 125, 50, 0.12)',
                            color: alt.status === 'Open' ? 'var(--accent-danger)' : 'var(--secondary)',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {alt.status === 'Open' ? (
                            <>
                              <AlertTriangle size={13} />
                              <span>Open</span>
                            </>
                          ) : (
                            <>
                              <Check size={13} />
                              <span>Resolved</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <ShieldAlert size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--text-main)', margin: '0 0 4px 0' }}>No Matching Alerts</h3>
            <p style={{ fontSize: '13px', margin: 0 }}>Try clearing search criteria or modifying filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
