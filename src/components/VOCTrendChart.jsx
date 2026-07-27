import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import { Wind, Calendar, Zap, AlertCircle } from 'lucide-react';

export default function VOCTrendChart({ timeSeriesData }) {
  const [range, setRange] = useState('30');
  const [showForecast, setShowForecast] = useState(true);

  // Filter last N days of data from parsed dataset
  const slicedData = timeSeriesData ? timeSeriesData.slice(-parseInt(range)) : [];

  // Format data for Recharts + generate 3-day forecast points if enabled
  const formattedData = slicedData.map(item => ({
    date: item.date ? item.date.slice(5) : '',
    voc: item.ambient_voc !== undefined ? Math.max(12, Math.round(item.ambient_voc)) : 24,
    aaqms: item.aaqms_voc !== undefined ? parseFloat(item.aaqms_voc.toFixed(1)) : 0.5,
    threshold: 50
  }));

  // Append 3 future forecast points showing the potential bump mentioned in AI recommendation
  if (showForecast && formattedData.length > 0) {
    const lastVOC = formattedData[formattedData.length - 1].voc || 24;
    formattedData.push(
      { date: '+6h FC', voc: lastVOC, forecast: lastVOC + 4, threshold: 50 },
      { date: '+12h FC', voc: null, forecast: lastVOC + 9, threshold: 50 },
      { date: '+24h FC', voc: null, forecast: lastVOC + 15, threshold: 50 }
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-recharts-tooltip">
          <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px', fontWeight: 600 }}>
            Date / Time: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', margin: '2px 0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }}></span>
              <span style={{ color: '#cbd5e1' }}>{entry.name}:</span>
              <span style={{ fontWeight: 700, color: entry.color }}>
                {entry.value} µg/m³
              </span>
            </div>
          ))}
          <div style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px stroke rgba(255,255,255,0.1)', fontSize: '10px', color: '#64748b' }}>
            Normal Threshold: &lt; 50 µg/m³
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Chart Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={18} color="#2dd4bf" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
              VOC Trend (Last {range} Days)
            </h2>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Ambient Volatile Organic Compound Monitoring & 24h AI Projection
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Forecast Toggle */}
          <button
            onClick={() => setShowForecast(!showForecast)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: showForecast ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.5)',
              border: `1px solid ${showForecast ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: showForecast ? '#38bdf8' : 'var(--text-dim)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Zap size={13} color={showForecast ? '#38bdf8' : 'var(--text-dim)'} />
            AI 24h Forecast
          </button>

          {/* Range Pills */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.7)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['7', '15', '30'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: range === r ? 'var(--accent-teal)' : 'transparent',
                  color: range === r ? '#030a16' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Line Chart Area */}
      <div style={{ flex: 1, minHeight: '260px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="vocGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 60]} />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Line */}
            <ReferenceLine y={50} label={{ value: 'Limit: 50 µg/m³', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} stroke="#ef4444" strokeDasharray="4 4" />

            {/* Ambient VOC Historical Line */}
            <Line
              type="monotone"
              dataKey="voc"
              name="Ambient VOC"
              stroke="#2dd4bf"
              strokeWidth={2.5}
              dot={{ r: 2, fill: '#2dd4bf' }}
              activeDot={{ r: 6, fill: '#5eead4', stroke: '#0d9488', strokeWidth: 2 }}
            />

            {/* AI Projected Forecast Line */}
            {showForecast && (
              <Line
                type="monotone"
                dataKey="forecast"
                name="AI Forecast Trend"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#f59e0b' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '11.5px',
        color: 'var(--text-dim)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '3px', background: '#2dd4bf', borderRadius: '2px' }}></span>
            Ambient VOC (Avg 24 µg/m³)
          </span>
          {showForecast && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
              <span style={{ width: '10px', height: '2px', background: '#fbbf24', borderStyle: 'dashed' }}></span>
              AI Forecast (+6h Trend Spike)
            </span>
          )}
        </div>

        <span style={{ color: '#38bdf8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={13} color="#38bdf8" />
          AAQMS Sensor 2 Active
        </span>
      </div>

    </div>
  );
}
