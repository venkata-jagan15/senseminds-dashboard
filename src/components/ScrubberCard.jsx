import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ArrowRight,
  Droplet
} from 'lucide-react';
import { evaluateStatus, getStatusColor } from '../data/scrubberData';
import graphData from '../data/cems_knowledge_graph.json';

export default function ScrubberCard({ scrubber, index = 0, onClick }) {
  const status = evaluateStatus(scrubber.currentPh);
  const colorStyle = getStatusColor(status);

  // Search if this scrubber column has an active ML anomaly projected in the graph
  const mlAnomaly = React.useMemo(() => {
    if (!graphData || !graphData.relationships) return null;
    const rel = graphData.relationships.find(
      r => r.source === scrubber.name && r.type === 'HAS_ANOMALY'
    );
    if (rel) {
      const node = graphData.nodes.find(n => n.name === rel.target);
      return node ? node.properties : null;
    }
    return null;
  }, [scrubber.name]);

  // Status Badge Animation Class getter
  const getBadgeAnimClass = () => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'status-badge-healthy';
      case 'warning':
        return 'status-badge-warning';
      case 'critical':
        return 'status-badge-critical';
      default:
        return '';
    }
  };

  // Small status icon getter
  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckCircle2 size={16} color="var(--secondary)" className="icon-hover-scale" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--accent-warning)" className="icon-hover-scale" />;
      case 'critical':
        return <AlertOctagon size={16} color="var(--accent-danger)" className="icon-hover-scale" />;
      default:
        return <CheckCircle2 size={16} color="var(--text-muted)" className="icon-hover-scale" />;
    }
  };

  return (
    <div
      onClick={() => onClick(scrubber.id)}
      className="stagger-card btn-interactive"
      style={{
        '--stagger': index,
        background: 'var(--bg-card)',
        border: `1px solid ${colorStyle.border}`,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '190px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
        e.currentTarget.style.borderColor = colorStyle.text;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
        e.currentTarget.style.borderColor = colorStyle.border;
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(21, 101, 192, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplet size={18} color="var(--primary)" className="icon-hover-scale" />
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: 0,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.3px'
            }}>
              {scrubber.name}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>
              {scrubber.location ? scrubber.location.split('-')[1] || scrubber.location : 'Pharmaceutical Scrubber'}
            </span>
          </div>
        </div>

        {/* Badges Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Health Status Badge */}
          <div
            className={getBadgeAnimClass()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: colorStyle.bg,
              border: `1px solid ${colorStyle.border}`,
              color: colorStyle.text,
              fontSize: '12px',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            {getStatusIcon()}
            <span>{status}</span>
          </div>

          {/* ML Anomaly Badge */}
          {mlAnomaly && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '20px',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#c084fc',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'help'
              }}
              title={mlAnomaly.explanation}
            >
              <span>🧠 Outlier</span>
            </div>
          )}
        </div>
      </div>

      {/* Center pH Metric Row */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: '12px',
        background: 'var(--bg-main)',
        border: '1px solid var(--border-subtle)',
        margin: '6px 0 14px 0'
      }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current pH
          </span>
          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: colorStyle.text,
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.1',
            marginTop: '2px',
            transition: 'color 0.3s ease'
          }}>
            {scrubber.currentPh.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>Target Range</span>
          <div style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            ≥ 9.00 pH
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: 'var(--text-dim)',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} color="var(--text-dim)" />
          <span>Updated {scrubber.lastUpdated || 'Just now'}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--primary)',
          fontWeight: 700
        }}>
          <span>View Details</span>
          <ArrowRight size={13} className="icon-hover-scale" />
        </div>
      </div>
    </div>
  );
}
