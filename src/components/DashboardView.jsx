import React, { useState, useMemo } from 'react';
import ScrubberCard from './ScrubberCard';
import { Search, Filter, RefreshCw, CheckCircle2, AlertTriangle, AlertOctagon, Layers } from 'lucide-react';
import { evaluateStatus } from '../data/scrubberData';

export default function DashboardView({ scrubbers, onSelectScrubber, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle refresh click with spinning feedback
  const handleSyncClick = () => {
    setIsSyncing(true);
    onRefresh();
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Calculate status counts
  const stats = useMemo(() => {
    let healthy = 0;
    let warning = 0;
    let critical = 0;

    scrubbers.forEach((s) => {
      const st = evaluateStatus(s.currentPh);
      if (st === 'Healthy') healthy++;
      else if (st === 'Warning') warning++;
      else if (st === 'Critical') critical++;
    });

    return { total: scrubbers.length, healthy, warning, critical };
  }, [scrubbers]);

  // Filter scrubbers list
  const filteredScrubbers = useMemo(() => {
    return scrubbers.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const status = evaluateStatus(s.currentPh);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [scrubbers, searchTerm, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner & Control Header */}
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
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>Scrubber pH Telemetry Dashboard</span>
            <span style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(21, 101, 192, 0.12)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 101, 192, 0.3)',
              fontWeight: 700
            }}>
              LIVE CEMS
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Continuous pH monitoring for pharmaceutical wet scrubber systems
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSyncClick}
            className="btn-interactive"
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid var(--primary)',
              background: 'rgba(21, 101, 192, 0.08)',
              color: 'var(--primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={isSyncing ? 'spin-fast' : ''} />
            <span>{isSyncing ? 'Syncing Telemetry...' : 'Sync Live Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Summary Status Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Scrubbers */}
        <div
          onClick={() => setStatusFilter('All')}
          className="btn-interactive"
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: statusFilter === 'All' ? 'rgba(21, 101, 192, 0.12)' : 'var(--bg-card)',
            border: statusFilter === 'All' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Monitored</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {stats.total}
            </div>
          </div>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(21, 101, 192, 0.1)', color: 'var(--primary)' }}>
            <Layers size={22} className="icon-hover-scale" />
          </div>
        </div>

        {/* Healthy Count */}
        <div
          onClick={() => setStatusFilter('Healthy')}
          className="btn-interactive"
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: statusFilter === 'Healthy' ? 'rgba(46, 125, 50, 0.15)' : 'var(--bg-card)',
            border: statusFilter === 'Healthy' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Healthy (pH ≥ 9.0)</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
              {stats.healthy}
            </div>
          </div>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(46, 125, 50, 0.12)', color: 'var(--secondary)' }}>
            <CheckCircle2 size={22} className="icon-hover-scale" />
          </div>
        </div>

        {/* Warning Count */}
        <div
          onClick={() => setStatusFilter('Warning')}
          className="btn-interactive"
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: statusFilter === 'Warning' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
            border: statusFilter === 'Warning' ? '2px solid var(--accent-warning)' : '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Warning (8.5 - 8.99)</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-warning)', fontFamily: 'var(--font-mono)' }}>
              {stats.warning}
            </div>
          </div>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent-warning)' }}>
            <AlertTriangle size={22} className="icon-hover-scale" />
          </div>
        </div>

        {/* Critical Count */}
        <div
          onClick={() => setStatusFilter('Critical')}
          className="btn-interactive"
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: statusFilter === 'Critical' ? 'rgba(220, 38, 38, 0.15)' : 'var(--bg-card)',
            border: statusFilter === 'Critical' ? '2px solid var(--accent-danger)' : '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Critical (pH &lt; 8.5)</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-danger)', fontFamily: 'var(--font-mono)' }}>
              {stats.critical}
            </div>
          </div>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(220, 38, 38, 0.12)', color: 'var(--accent-danger)' }}>
            <AlertOctagon size={22} className="icon-hover-scale" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
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
          minWidth: '200px',
          flex: '1 max-content'
        }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search by Scrubber ID (e.g. SCB-101, SCB-301)..."
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

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)', marginRight: '4px' }}>
            <Filter size={14} />
            <span>Filter Status:</span>
          </div>

          {['All', 'Healthy', 'Warning', 'Critical'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="btn-interactive"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: statusFilter === f ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: statusFilter === f ? 'rgba(21, 101, 192, 0.15)' : 'transparent',
                color: statusFilter === f ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scrubber Cards Grid */}
      {filteredScrubbers.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {filteredScrubbers.map((scrubber, index) => (
            <ScrubberCard
              key={scrubber.id}
              scrubber={scrubber}
              index={index}
              onClick={onSelectScrubber}
            />
          ))}
        </div>
      ) : (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          color: 'var(--text-muted)'
        }}>
          <AlertTriangle size={36} color="var(--accent-warning)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '16px', color: 'var(--text-main)', margin: '0 0 6px 0' }}>No Scrubbers Found</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>Try clearing your search query or switching the status filter.</p>
        </div>
      )}

    </div>
  );
}
