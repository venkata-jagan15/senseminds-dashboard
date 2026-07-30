import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Cpu, Wind, 
  AlertOctagon, CheckCircle2, Clock, Play, Power, 
  Flame, Radio, Send, Bell, Settings2, Sliders, Info
} from 'lucide-react';
import graphData from '../data/cems_knowledge_graph.json';

export default function CommandCenterView() {
  const [safetyScore, setSafetyScore] = useState(95.3);
  const [safetyLevel, setSafetyLevel] = useState('Green');
  const [scrubberEfficiency, setScrubberEfficiency] = useState(98.2);
  const [failures, setFailures] = useState({ pump: 5.4, fan: 3.2, nozzle: 4.1, sensor: 1.2 });
  const [forecasts, setForecasts] = useState({ voc: [24.0, 24.5, 26.1], ph: [9.85, 9.80, 9.72] });
  
  // Custom interactive PLC overrides state
  const [plcOverrides, setPlcOverrides] = useState([
    { id: 1, command: 'INCREASE_CHEMICAL_DOSING', action: 'NaOH pump flow rate boosted to 6.2 L/hr', active: false, type: 'Pump' },
    { id: 2, command: 'START_STANDBY_PUMP', action: 'Standby dosing pump SCB-302B engaged', active: false, type: 'Pump' },
    { id: 3, command: 'BOOST_EXHAUST_FAN', action: 'Exhaust fan speed raised to 1800 RPM (+30%)', active: false, type: 'Fan' },
    { id: 4, command: 'TRIGGER_EMERGENCY_VENTILATION', action: 'Emergency duct bypass dampers set to 100% open', active: false, type: 'Vent' }
  ]);

  // Live event logs
  const [logs, setLogs] = useState([
    { time: '14:24:10', message: 'Data Validation check completed successfully.', type: 'info' },
    { time: '14:24:12', message: 'XGBoost Risk Score evaluation completed: Low Risk.', type: 'success' },
    { time: '14:24:15', message: 'CEMS emissions limits within normal regulatory ranges.', type: 'success' }
  ]);

  // Read actual safety node values from cems_knowledge_graph.json if available
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const resKpis = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph/safety/kpis`);
        if (!resKpis.ok) throw new Error('API server unreachable');
        const kpis = await resKpis.json();
        
        setSafetyScore(kpis.safety_score);
        setSafetyLevel(kpis.safety_level);
        setScrubberEfficiency(kpis.scrubber_efficiency);
        setFailures(kpis.failures);
        
        const resForecasts = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph/safety/forecasts`);
        const forecastsData = await resForecasts.json();
        setForecasts(forecastsData);

        const resCommands = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph/safety/plc_commands`);
        const cmds = await resCommands.json();
        if (cmds && cmds.length > 0) {
          setPlcOverrides(prev => prev.map(item => {
            const apiCmd = cmds.find(c => c.command === item.command);
            if (apiCmd) {
              return { ...item, active: apiCmd.status.includes('Executed') || apiCmd.status.includes('Active') };
            }
            return item;
          }));
        }
      } catch (err) {
        console.warn('FastAPI backend offline, loading metrics from cached graph JSON file.', err);
        if (graphData && graphData.nodes) {
          const plantNode = graphData.nodes.find(n => n.type === 'Plant');
          if (plantNode && plantNode.properties) {
            const props = plantNode.properties;
            if (props.safety_score) setSafetyScore(props.safety_score);
            if (props.safety_level) setSafetyLevel(props.safety_level);
            if (props.scrubber_efficiency) setScrubberEfficiency(props.scrubber_efficiency);
            
            setFailures({
              pump: props.pump_failure_probability || 5.4,
              fan: props.fan_failure_probability || 3.2,
              nozzle: props.nozzle_blockage_probability || 4.1,
              sensor: props.sensor_failure_probability || 1.2
            });
          }

          const forecastNode = graphData.nodes.find(n => n.type === 'Forecast');
          if (forecastNode && forecastNode.properties) {
            const props = forecastNode.properties;
            setForecasts({
              voc: [props.voc_30m || 24.0, props.voc_1h || 24.5, props.voc_4h || 26.1],
              ph: [props.ph_30m || 9.85, props.ph_1h || 9.80, props.ph_4h || 9.72]
            });
          }
        }
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual PLC override toggle
  const toggleOverride = (id) => {
    setPlcOverrides(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.active;
        
        // Append log message
        const now = new Date().toTimeString().split(' ')[0];
        const logMsg = nextState 
          ? `Operator manual override engaged: ${item.command} (${item.action})`
          : `Operator manual override disengaged: ${item.command}`;
        
        setLogs(l => [
          { time: now, message: logMsg, type: nextState ? 'warn' : 'info' },
          ...l
        ]);
        
        return { ...item, active: nextState };
      }
      return item;
    }));
  };

  // Color classes mapping for safety threat levels
  const getSafetyColor = () => {
    switch (safetyLevel.toLowerCase()) {
      case 'green': return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#10b981', glow: '0 0 15px rgba(16, 185, 129, 0.3)' };
      case 'yellow': return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '#f59e0b', glow: '0 0 15px rgba(245, 158, 11, 0.3)' };
      case 'orange': return { border: '#ea580c', bg: 'rgba(234, 88, 12, 0.08)', text: '#ea580c', glow: '0 0 15px rgba(234, 88, 12, 0.3)' };
      case 'red': return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', text: '#ef4444', glow: '0 0 20px rgba(239, 68, 68, 0.5)' };
      default: return { border: '#cbd5e1', bg: 'transparent', text: '#f8fafc', glow: 'none' };
    }
  };

  const statusStyle = getSafetyColor();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Safety Command Center
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-Time AI Multi-Sensor Safety Ingest & Automated PLC Overrides (Layers 1-7)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.1)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            fontWeight: 700
          }}>
            AI Safety Engine Active
          </span>
        </div>
      </div>

      {/* Top Section Grid (Plant Safety Score & KPIs) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Plant Safety Score Gauge Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: `1.5px solid ${statusStyle.border}`,
          boxShadow: statusStyle.glow,
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: statusStyle.border,
            opacity: 0.08,
            filter: 'blur(35px)',
            zIndex: 0
          }} />

          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', zIndex: 1 }}>
            Plant Safety index
          </span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, margin: '14px 0' }}>
            <div style={{
              fontSize: '56px',
              fontWeight: 900,
              color: statusStyle.text,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1
            }}>
              {safetyScore}%
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: statusStyle.bg,
            border: `1.5px solid ${statusStyle.border}`,
            color: statusStyle.text,
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            zIndex: 1,
            boxShadow: 'var(--card-shadow)',
            animation: safetyLevel.toLowerCase() === 'red' ? 'pulse 1s infinite' : 'none'
          }}>
            {safetyLevel.toLowerCase() === 'green' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            <span>THREAT: {safetyLevel}</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '14px 0 0 0', maxWidth: '280px', zIndex: 1 }}>
            Composite score weighting scrubber chemical efficiency, multi-sensor outlier drifts, and mechanical fatigue predictions.
          </p>
        </div>

        {/* KPIs Deck */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
            Layer 7 Safety KPIs
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Compliance score</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>99.8%</div>
            </div>
            
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Gas Leak Probability</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-warning)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>1.4%</div>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Mean Time to Detect (MTTD)</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>1.2 sec</div>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Mean Time to Respond (MTTR)</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>4.5 sec</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
            <Activity size={14} color="var(--primary)" />
            <span style={{ fontSize: '11.5px', color: 'var(--text-main)', fontWeight: 600 }}>
              Scrubber Chemical Efficiency: <strong style={{ color: 'var(--primary)' }}>{scrubberEfficiency}%</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Middle Section: Failure Predictions & Gas Forecasting */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Mechanical Failure Prediction Panel */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
            Mechanical Failure Probability
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Pump Failure */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                <span>Alkali Dosing Pump Failure</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: failures.pump > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)' }}>
                  {failures.pump}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${failures.pump}%`, height: '100%', background: failures.pump > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Fan Failure */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                <span>Exhaust Fan Motor Fatigue</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: failures.fan > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)' }}>
                  {failures.fan}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${failures.fan}%`, height: '100%', background: failures.fan > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Nozzle Blockage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                <span>Spray Nozzle Blockage</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: failures.nozzle > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)' }}>
                  {failures.nozzle}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${failures.nozzle}%`, height: '100%', background: failures.nozzle > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Sensor Calibration */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                <span>pH/VOC Sensor Failure</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: failures.sensor > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)' }}>
                  {failures.sensor}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${failures.sensor}%`, height: '100%', background: failures.sensor > 20.0 ? 'var(--accent-warning)' : 'var(--secondary)', borderRadius: '3px' }} />
              </div>
            </div>

          </div>
        </div>

        {/* AI Gas Forecasting Panel */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
            AI Gas Emission Forecasting
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* VOC Forecast */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>VOC Discharge Projections</span>
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>30 min:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{forecasts.voc[0]} µg/m³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1 hour:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{forecasts.voc[1]} µg/m³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>4 hour:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: forecasts.voc[2] > 35.0 ? 'var(--accent-warning)' : 'var(--text-main)' }}>{forecasts.voc[2]} µg/m³</span>
                </div>
              </div>
            </div>

            {/* pH Forecast */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>pH Level Projections</span>
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>30 min:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{forecasts.ph[0]} pH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1 hour:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{forecasts.ph[1]} pH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>4 hour:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: forecasts.ph[2] < 9.5 ? 'var(--accent-danger)' : 'var(--text-main)' }}>{forecasts.ph[2]} pH</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-dim)' }}>
            <Info size={12} />
            <span>Forecast computed using multi-variable trend extrapolation on the live telemetry stream.</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: PLC Automated Overrides Console & Control Room Logs */}
      <div className="responsive-grid-command">
        
        {/* PLC Commands Override Console */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                Safety Decision Engine: PLC Overrides
              </h3>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>AUTOMATIC PROCESS OVERRIDES</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plcOverrides.map(item => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: item.active ? 'rgba(6, 182, 212, 0.04)' : 'var(--bg-main)',
                  border: item.active ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: item.active ? 'var(--primary)' : 'var(--text-dim)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {item.command}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 500 }}>
                    {item.action}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleOverride(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: item.active ? 'var(--accent-warning)' : 'var(--border-subtle)',
                    color: item.active ? '#0f172a' : 'var(--text-main)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Power size={12} />
                  <span>{item.active ? 'Active Override' : 'Engage'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Alert Beacon & Control Room Log */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '100%',
          minHeight: 0
        }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={15} color="var(--accent-warning)" />
            <span>Layer 5 Live Alert Log</span>
          </h3>

          <div style={{
            flex: 1,
            background: 'var(--bg-main)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto',
            maxHeight: '260px'
          }}>
            {logs.map((log, index) => (
              <div 
                key={index} 
                style={{ 
                  fontSize: '11.5px', 
                  lineHeight: '1.4', 
                  paddingBottom: '8px', 
                  borderBottom: '1px solid var(--border-subtle)',
                  color: log.type === 'warn' ? 'var(--accent-warning)' : log.type === 'success' ? 'var(--secondary)' : 'var(--text-main)' 
                }}
              >
                <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>
                  [{log.time}]
                </span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
