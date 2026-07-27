import React, { useState } from 'react';
import { Settings, Shield, Bell, Save, Check } from 'lucide-react';
import { ALERTS_RULES } from '../data/scrubberData';

export default function SettingsView() {
  const [healthyMin, setHealthyMin] = useState(ALERTS_RULES.HEALTHY_MIN_PH);
  const [warningMin, setWarningMin] = useState(ALERTS_RULES.WARNING_MIN_PH);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
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
          <Settings size={24} color="var(--primary)" />
          <span>System & Telemetry Settings</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Configure pH threshold boundaries, alert triggering rules, and system telemetry rates
        </p>
      </div>

      {/* Safety Threshold Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        <div style={{
          padding: '22px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={18} color="var(--secondary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Scrubber pH Threshold Configuration
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
                Healthy Minimum Threshold (pH)
              </label>
              <input
                type="number"
                step="0.1"
                value={healthyMin}
                onChange={(e) => setHealthyMin(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Readings ≥ {healthyMin} pH will be flagged as <strong>Healthy (Green)</strong>.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
                Warning Minimum Threshold (pH)
              </label>
              <input
                type="number"
                step="0.1"
                value={warningMin}
                onChange={(e) => setWarningMin(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Readings between {warningMin} and {(healthyMin - 0.01).toFixed(2)} pH trigger <strong>Warning (Yellow)</strong>. Readings &lt; {warningMin} pH trigger <strong>Critical (Red)</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div style={{
          padding: '22px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Alarm & Dispatch Preferences
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
              <span>Trigger instant dashboard notification toast on Critical pH alerts</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
              <span>Log continuous low pH events (&gt;3 consecutive low readings)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
              <span>Automated alkali dosing recommendation assistant</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(21, 101, 192, 0.3)'
            }}
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            <span>{saved ? 'Settings Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
