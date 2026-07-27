import React, { useState } from 'react';
import { Cpu, ArrowRight, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function AIRootCausePanel({ onActionExecute }) {
  const [remediating, setRemediating] = useState(false);
  const [remediated, setRemediated] = useState(false);

  const handleRemediate = () => {
    setRemediating(true);
    setTimeout(() => {
      setRemediating(false);
      setRemediated(true);
      if (onActionExecute) onActionExecute();
    }, 2000);
  };

  return (
    <div className="glass-panel scanline-box" style={{
      padding: '18px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(15, 34, 64, 0.8) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.35)'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#38bdf8" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
            AI Root Cause Analysis
          </h2>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Cpu size={12} /> 94.8% AI Confidence
        </span>
      </div>

      {/* Cause and Effect Node Flow Chain */}
      {/* Target prompt exact string: VOC Rising → SCB-301 pH Decreasing → Possible Low Alkali Dosing */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 12px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '10px',
        border: '1px solid rgba(20, 184, 166, 0.25)',
        marginBottom: '14px',
        gap: '6px'
      }}>
        
        {/* Node 1: VOC Rising */}
        <div style={{
          flex: 1,
          padding: '10px 8px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            TRIGGER
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
            VOC Rising
          </div>
          <div style={{ fontSize: '10.5px', color: '#fcd34d' }}>
            +3.8 µg/m³ / hr
          </div>
        </div>

        <ArrowRight size={16} color="#38bdf8" style={{ flexShrink: 0 }} />

        {/* Node 2: SCB-301 pH Decreasing */}
        <div style={{
          flex: 1,
          padding: '10px 8px',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CORRELATED ANOMALY
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
            SCB-301 pH Decreasing
          </div>
          <div style={{ fontSize: '10.5px', color: '#fca5a5' }}>
            11.2 → 8.12 pH
          </div>
        </div>

        <ArrowRight size={16} color="#38bdf8" style={{ flexShrink: 0 }} />

        {/* Node 3: Possible Low Alkali Dosing */}
        <div style={{
          flex: 1,
          padding: '10px 8px',
          borderRadius: '8px',
          background: 'rgba(20, 184, 166, 0.2)',
          border: '1px solid rgba(45, 212, 191, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ROOT CAUSE
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
            Possible Low Alkali Dosing
          </div>
          <div style={{ fontSize: '10.5px', color: '#5eead4' }}>
            Pump P-301 flow low
          </div>
        </div>

      </div>

      {/* AI Telemetry Explanation text */}
      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        marginBottom: '14px',
        background: 'rgba(3, 10, 22, 0.5)',
        padding: '10px 12px',
        borderRadius: '8px',
        borderLeft: '3px solid var(--accent-cyan)'
      }}>
        <strong style={{ color: '#ffffff' }}>AI Insight:</strong> Multi-sensor correlation identified an alkali depletion in SCB-301 primary scrubber column, reducing gaseous VOC neutralization efficiency by 24%.
      </div>

      {/* Remediation Action Button */}
      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleRemediate}
          disabled={remediating || remediated}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            background: remediated ? 'rgba(16, 185, 129, 0.25)' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            border: `1px solid ${remediated ? '#34d399' : 'rgba(45, 212, 191, 0.6)'}`,
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: remediated ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          {remediating ? (
            <>
              <RefreshCw size={15} className="pulse-dot" style={{ animation: 'spin 1s linear infinite' }} />
              Calibrating Pump P-301 Dosing...
            </>
          ) : remediated ? (
            <>
              <CheckCircle size={15} color="#34d399" />
              Alkali Dosing Corrected (+15% Rate)
            </>
          ) : (
            <>
              <Cpu size={15} />
              Auto-Calibrate SCB-301 Alkali Dosing Pump
            </>
          )}
        </button>
      </div>

    </div>
  );
}
