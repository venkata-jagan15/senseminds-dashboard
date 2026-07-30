import React, { useState } from 'react';
import { Activity, Clock, ShieldCheck, Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import campusImg from '../assets/laurus_campus.png';
import logoImg from '../assets/logo.png';

export default function LandingPage({ onEnterDashboard }) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Render Learn More as a full page layout, not as a modal card
  if (showLearnMore) {
    return (
      <div className="landing-learn-more-container">
        {/* Full campus image background blurred */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${campusImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(8px)',
          zIndex: -1
        }} />

        {/* Top Header Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '20px'
        }}>
          {/* Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={logoImg}
              alt="Logo"
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '16px',
                objectFit: 'contain',
                boxShadow: '0 6px 20px rgba(2, 132, 199, 0.5)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                background: '#ffffff'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '15px',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #14B8A6 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Knowledge. Innovation. Excellence
              </span>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setShowLearnMore(false)}
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            className="landing-btn-secondary"
          >
            <ArrowLeft size={16} />
            <span>Back to Portal</span>
          </button>
        </header>

        {/* Title Block */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '8px'
          }}>
            SenseMinds Environmental Intelligence Platform
          </h1>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#38bdf8'
          }}>
            Technical Specifications, Architecture & Regulatory Audits
          </h3>
        </div>

        {/* Content Columns */}
        <div className="responsive-grid-2col">
          {/* Left Column: Extensive Documentation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Overview */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                Platform Overview
              </h3>
              <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#cbd5e1' }}>
                The Laurus Labs Environmental Intelligence Platform is an advanced, enterprise-grade environmental management system built to monitor chemical scrubbers, exhaust telemetry, and emission channels in real-time. By integrating continuous telemetry sensors directly from plant operations, the platform helps operators identify scrubber degradation, perform predictive AI anomaly isolation, and maintain strict environmental compliance.
              </p>
            </div>

            {/* Core Monitoring Modules */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                1. Core Telemetry Modules
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • Scrubber Neutralization Loop
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    Wet scrubbers neutralize gaseous process effluents by passing them through a packed column irrigated with alkaline solution. Sensors collect pH metrics at 1 Hz intervals. CA-dosing pump flows are auto-regulated to maintain buffer solutions within the optimal <code>10.0 - 12.0 pH</code> band.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • VOC Stack Discharge Monitoring
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    Continuous Ambient and AQMS stack sensors monitor Volatile Organic Compounds (VOCs) to satisfy pollution abatement criteria. Alarms trigger if measurements approach the statutory threshold limit of <code>50 µg/m³</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Diagnostics */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                2. AI Copilot & Root Cause Analysis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • Real-Time Anomaly Reasoning Engine
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    Cross-references sensor streams using localized correlation rules (e.g. tracking a falling pH level coupled with elevated VOC discharge). Instantly detects alkali dosing pump failures and valve blocks to issue preemptive warnings.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • Natural Language Copilot Chat
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    An interactive, specialized control assistant allows system operators to query sensor details, simulate pump rate adjustments, and draft maintenance requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                3. Security & Compliance Standards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • CEMS Guidelines Compliance
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    Fulfills Central Pollution Control Board (CPCB) continuous monitoring and data integrity standards. Automated logs record alert history and resolutions for environmental auditor reviews.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    • Secure SCADA Access Controls
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#cbd5e1', paddingLeft: '12px' }}>
                    Features secure session authentication, SSL encryption, and detailed administrator credentials verification for critical manufacturing control operations.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Parameters and Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '40px' }}>
            
            {/* Quick Specs Table Card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                System Quick Specs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Sampling Frequency</span>
                  <span style={{ fontWeight: 600 }}>1 Hz Real-Time</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Scrubber Fleet</span>
                  <span style={{ fontWeight: 600 }}>20 Wet Scrubbers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Neutralization Target</span>
                  <span style={{ fontWeight: 600 }}>10.0 - 12.0 pH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>VOC Discharge Cap</span>
                  <span style={{ fontWeight: 600 }}>50 µg/m³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Encryption Standard</span>
                  <span style={{ fontWeight: 600 }}>AES-256 SSL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Compliance Body</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>CPCB Guidelines</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 118, 110, 0.15) 100%)',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Operational Gateway
              </h4>
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Ready to review real-time emissions data and adjust caustic dosing rates?
              </p>
              <button
                onClick={onEnterDashboard}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0F766E 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)'
                }}
                className="landing-btn-primary"
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '11.5px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.5px'
        }}>
          Authorized Personnel Only • Environmental Compliance
        </footer>

      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      backgroundColor: '#08131F',
      overflow: 'hidden',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      padding: '40px'
    }}>
      {/* Background with Ken Burns zoom effect */}
      <div 
        className="ken-burns-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${campusImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
          transition: 'transform 20s ease-out'
        }}
      />

      {/* Dark blue-black overlay (55% opacity) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(8, 19, 31, 0.65)',
        zIndex: -1
      }} />

      {/* TOP BAR: Logo and Brand */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        animation: 'fadeInTitle 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={logoImg}
            alt="Logo"
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '16px',
              objectFit: 'contain',
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              background: '#ffffff'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '15px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #14B8A6 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Knowledge. Innovation. Excellence
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)'
        }}>
          SECURE OPERATIONS GATEWAY
        </div>
      </header>

      {/* CENTER MAIN HERO CONTENT */}
      <div style={{
        maxWidth: '820px',
        margin: 'auto 0',
        zIndex: 10
      }}>
        {/* Title */}
        <h1 
          className="fade-in-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '4.2rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #14B8A6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900
          }}>
            Environmental Intelligence Platform
          </span>
        </h1>

        {/* Subtitle */}
        <h3 
          className="fade-in-subtitle"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 500,
            color: '#38bdf8',
            marginBottom: '16px',
            opacity: 0.95
          }}
        >
          Real-Time Environmental Monitoring & Scrubber pH Analytics
        </h3>

        {/* Description */}
        <p 
          className="fade-in-desc"
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: '#cbd5e1',
            marginBottom: '32px',
            maxWidth: '700px',
            fontWeight: 400
          }}
        >
          Monitor scrubber pH levels, detect environmental anomalies, receive intelligent alerts, and ensure environmental compliance across pharmaceutical manufacturing operations.
        </p>

        {/* Action Buttons */}
        <div 
          className="slide-up-buttons"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <button
            onClick={onEnterDashboard}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #0284C7 0%, #0F766E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="landing-btn-primary"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setShowLearnMore(true)}
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="landing-btn-secondary"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: Live System Status & Info Cards */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap',
        gap: '24px',
        zIndex: 10
      }}>
        {/* Bottom Left: Live System Status */}
        <div 
          className="fade-in-status"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(8, 19, 31, 0.45)',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>
            Live System Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ color: '#10B981' }}>🟢</span>
            <span>Environmental Monitoring Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ color: '#10B981' }}>🟢</span>
            <span>All Sensors Connected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ color: '#10B981' }}>🟢</span>
            <span>Real-Time Telemetry Enabled</span>
          </div>
        </div>

        {/* Bottom Right: Information Cards */}
        <div className="responsive-card-grid">
          {/* Card 1: 20 Scrubbers */}
          <div 
            className="stagger-card-0"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(2, 132, 199, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Layers size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>20 Scrubbers</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Fleet Monitoring</span>
            </div>
          </div>

          {/* Card 2: Live pH Analytics */}
          <div 
            className="stagger-card-1"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(15, 118, 110, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14b8a6'
            }}>
              <Activity size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>pH Analytics</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Real-Time Stream</span>
            </div>
          </div>

          {/* Card 3: Environmental Compliance */}
          <div 
            className="stagger-card-2"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Compliance</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>CEMS Audited</span>
            </div>
          </div>

          {/* Card 4: 24/7 Monitoring */}
          <div 
            className="stagger-card-3"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Clock size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>24×7 Stream</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Continuous Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
