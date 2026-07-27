import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, ShieldCheck, Activity, AlertCircle, RefreshCw, Key, HelpCircle } from 'lucide-react';
import campusImg from '../assets/laurus_campus.png';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation and error states
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [shakeError, setShakeError] = useState(false);

  // Focus states for input glows
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setLoginError('');

    let hasError = false;

    if (!username.trim()) {
      setUsernameError('Employee ID / Username is required');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsSubmitting(true);

    // Simulate SCADA / Enterprise Authentication
    setTimeout(() => {
      // Allow general demo credentials or standard checks
      if (username.length >= 3 && password.length >= 4) {
        onLoginSuccess();
      } else {
        setAttempts(prev => prev + 1);
        setLoginError('Invalid Administrator credentials or unauthorized account');
        setIsSubmitting(false);
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
      }
    }, 1500);
  };

  // Determine if sign-in button should be disabled
  const isFormIncomplete = !username.trim() || !password;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      padding: '40px',
      overflow: 'hidden',
      color: '#F8FAFC',
      fontFamily: 'var(--font-body)'
    }} className="login-bg-animated">
      
      {/* Blurred campus image background with 15% opacity */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${campusImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'blur(8px)',
        zIndex: -1
      }} />

      {/* Main Login split container */}
      <div 
        className="login-container-entrance"
        style={{
          maxWidth: '1050px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '40px',
          zIndex: 10,
          alignItems: 'center'
        }}
      >
        
        {/* LEFT SIDE: Information & Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontFamily: 'var(--font-heading)'
            }}>
              L
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.8px',
                color: '#ffffff'
              }}>
                LAURUS <span style={{ color: '#2563EB' }}>Labs</span>
              </span>
              <span style={{
                fontSize: '10px',
                color: '#10B981',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '-2px'
              }}>
                Compliance & Quality Assurance
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: '1.15',
              marginBottom: '10px',
              color: '#ffffff'
            }}>
              Environmental <br/>
              Intelligence Platform
            </h1>
            <h2 style={{
              fontSize: '1.2rem',
              color: '#38BDF8',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)'
            }}>
              Secure Administrator Access
            </h2>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.5',
              color: '#CBD5E1',
              marginTop: '12px',
              maxWidth: '460px'
            }}>
              Sign in to access real-time scrubber pH monitoring, environmental analytics, intelligent alerts, and compliance reports.
            </p>
          </div>

          {/* Feature List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Feature 1: Real-Time Monitoring */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 16px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <ShieldCheck size={16} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#E2E8F0' }}>
                Real-Time Telemetry & CEMS Streams
              </span>
            </div>

            {/* Feature 2: Intelligent Alert System */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 16px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ color: '#38BDF8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <Activity size={16} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#E2E8F0' }}>
                Intelligent Diagnostic Alerts & AI Copilot
              </span>
            </div>

            {/* Feature 3: Environmental Compliance */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 16px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                <ShieldCheck size={16} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#E2E8F0' }}>
                Environmental Regulatory Compliance & Audit Reports
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE: Glassmorphism Login Card */}
        <div 
          className={`login-card ${shakeError ? 'shake-element' : ''}`}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            webkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative'
          }}
        >
          {/* Card Header */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '6px'
            }}>
              Administrator Login
            </h3>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>
              Unit 1 Control Gateway Access
            </span>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              color: '#FCA5A5',
              fontSize: '12px',
              fontWeight: 500
            }}>
              <AlertCircle size={15} color="#EF4444" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Field: Employee ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Employee ID / Username</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.65)',
                border: usernameFocused ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: usernameFocused ? '0 0 10px rgba(37, 99, 235, 0.25)' : 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <User size={16} color={usernameFocused ? '#38BDF8' : '#64748B'} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  placeholder="Enter employee ID"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    width: '100%'
                  }}
                />
              </div>
              {usernameError && (
                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500, marginTop: '2px' }}>
                  {usernameError}
                </span>
              )}
            </div>

            {/* Field: Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Password</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.65)',
                border: passwordFocused ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: passwordFocused ? '0 0 10px rgba(37, 99, 235, 0.25)' : 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}>
                <Lock size={16} color={passwordFocused ? '#38BDF8' : '#64748B'} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    width: '100%'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && (
                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500, marginTop: '2px' }}>
                  {passwordError}
                </span>
              )}
            </div>



            {/* Checkbox: Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#CBD5E1' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: '#2563EB',
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px'
                  }}
                />
                Remember Me
              </label>
              
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38BDF8',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onClick={() => alert('Please contact the IT helpdesk for password reset requests.')}
              >
                Forgot Password?
              </button>
            </div>

            {/* Buttons: Sign In */}
            <button
              type="submit"
              disabled={isFormIncomplete || isSubmitting}
              style={{
                padding: '12px',
                background: isFormIncomplete || isSubmitting ? 'rgba(37, 99, 235, 0.35)' : 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                color: isFormIncomplete || isSubmitting ? 'rgba(255,255,255,0.45)' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isFormIncomplete || isSubmitting ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isFormIncomplete || isSubmitting ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.18s ease-out'
              }}
              className={isFormIncomplete || isSubmitting ? "" : "landing-btn-primary"}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={15} style={{ animation: 'spinRing 1s linear infinite' }} />
                  <span>Authenticating CEMS...</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>

          </form>

          {/* SSL and Security Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '16px',
            fontSize: '11px',
            color: '#64748B'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔒 SSL Encrypted (AES-256)
            </span>
            <span>
              Last Success: Just now
            </span>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer style={{
        position: 'absolute',
        bottom: '24px',
        fontSize: '11.5px',
        color: '#64748B',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: 600,
        zIndex: 10
      }}>
        Authorized Personnel Only • Laurus Labs Environmental Compliance
      </footer>

    </div>
  );
}
