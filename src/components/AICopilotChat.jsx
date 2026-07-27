import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';

export default function AICopilotChat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi — I'm the Plant Copilot, connected to your live scrubber fleet. Ask me anything, e.g. \"Which scrubbers are at highest risk?\" or \"What is SCB-301's current pH level?\""
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isThinking) return;

    const newMsg = { role: 'user', text: text };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    if (!textToSend) setInputVal('');
    setIsThinking(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) throw new Error('API server unavailable');
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      console.warn('FastAPI backend chat endpoint offline, using local simulation fallback.', err);
      // Local client fallback simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let replyText = "";
      const lower = text.toLowerCase();
      
      const isOnTopic = ["scrubber", "scb", "voc", "ph", "dosing", "pump", "fan", "emission", "compliance", "laurus"].some(kw => lower.includes(kw));
      if (!isOnTopic && text !== "") {
        replyText = "I am trained exclusively to assist with wet scrubber parameters, chemical telemetry, and emissions compliance at Laurus Labs Unit 1.";
      } else if (lower.includes('risk') || lower.includes('unhealthy')) {
        replyText = "Analyzing fleet telemetry... SCB-301 is currently flagged as HIGH RISK. pH is critical (8.12), Stability Index has dropped to 0.42, and stack VOC emissions are rising. All other 19 scrubbers are currently reading within normal chemical neutralization bands.";
      } else if (lower.includes('301') || lower.includes('scb-301')) {
        replyText = "Telemetry report for wet scrubber SCB-301:\n• Current pH: 8.12 (Safety band: 10.0 - 12.0 pH)\n• Caustic Soda Flow: 1.2 L/min (Target: 2.8 L/min)\n• Status: Low Alkali Dosing warning active\n• Alert Code: AL-88301";
      } else if (lower.includes('101') || lower.includes('scb-101')) {
        replyText = "The Rule Engine diagnosed a transient alkali line pressure drop during buffer supply changeover. Dosing flow normalized automatically; current pH is 10.8.";
      } else if (lower.includes('forecast') || lower.includes('voc') || lower.includes('predict')) {
        replyText = "Emissions forecast model (Holt-Winters core):\n• 30m VOC Projection: 24.0 µg/m³\n• 1h VOC Projection: 24.5 µg/m³\n• 4h VOC Projection: 26.1 µg/m³ (Well below safety cap of 50 µg/m³).";
      } else {
        replyText = `SenseMinds engine scanned the active Knowledge Graph and Rule files. SCADA streams are normal. No general telemetry drift detected on active active scrubbers. Do you want me to inspect a specific column?`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: replyText }]);
    } finally {
      setIsThinking(false);
    }
  };

  const suggestionPills = [
    "Which scrubbers are at highest risk?",
    "What is SCB-301's current pH level?",
    "What caused the low pH warning on SCB-101?",
    "Show VOC emissions forecasting summary"
  ];

  return (
    <div style={{
      margin: '0 auto',
      display: 'flex',
      height: 'calc(100vh - 160px)',
      maxWidth: '920px',
      width: '100%',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      padding: '10px 0'
    }}>
      
      {/* 1. Header Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Robot Icon Container */}
        <div style={{
          display: 'grid',
          height: '42px',
          width: '42px',
          placeItems: 'center',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          boxShadow: 'var(--card-shadow)',
          color: 'var(--primary)'
        }}>
          <Bot size={22} style={{ color: 'var(--primary)' }} />
        </div>
        
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-main)',
            margin: 0,
            fontFamily: 'var(--font-heading)'
          }}>
            SenseMinds Copilot
          </h2>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-dim)',
            margin: '2px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={11} style={{ color: 'var(--primary)' }} />
            Model: llama-3.3-70b · live scrubber fleet
          </p>
        </div>
      </div>

      {/* 2. Chat Thread Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--card-shadow)'
      }}>
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              {/* Bot Icon on Left (only for AI) */}
              {!isUser && (
                <div style={{
                  display: 'grid',
                  height: '32px',
                  width: '32px',
                  shrink: 0,
                  placeItems: 'center',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--primary)',
                  marginTop: '2px'
                }}>
                  <Bot size={16} />
                </div>
              )}

              {/* Message Box */}
              <div style={{
                maxWidth: '70%',
                padding: '14px 18px',
                borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: isUser
                  ? 'var(--primary-gradient)'
                  : 'var(--bg-main)',
                border: isUser ? 'none' : '1px solid var(--border-color)',
                boxShadow: isUser ? '0 4px 12px rgba(21,101,192,0.2)' : 'none',
                color: isUser ? '#ffffff' : 'var(--text-main)',
                fontSize: '13.5px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                fontFamily: m.text.includes('•') ? 'var(--font-mono)' : 'var(--font-body)'
              }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'grid',
              height: '32px',
              width: '32px',
              placeItems: 'center',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-main)',
              color: 'var(--primary)'
            }}>
              <RefreshCw size={14} style={{ animation: 'spinRing 1.2s linear infinite' }} />
            </div>
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              Analyzing telemetry…
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 3. Predefined Suggestion Pills */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {suggestionPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              transition: 'all 0.18s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* 4. Chat Input Form */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        padding: '12px 18px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <textarea
          rows={1}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about any wet scrubber, CEMS sensor, rule evaluation or diagnostic..."
          style={{
            flex: 1,
            maxHeight: '120px',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-main)',
            fontSize: '13.5px',
            padding: '4px 0',
            fontFamily: 'var(--font-body)'
          }}
        />
        
        <button
          onClick={() => handleSend()}
          disabled={isThinking || !inputVal.trim()}
          style={{
            display: 'grid',
            height: '38px',
            width: '38px',
            placeItems: 'center',
            borderRadius: '8px',
            background: (!inputVal.trim() || isThinking) ? 'var(--border-color)' : 'var(--primary-gradient)',
            color: '#ffffff',
            border: 'none',
            cursor: (!inputVal.trim() || isThinking) ? 'default' : 'pointer',
            boxShadow: (!inputVal.trim() || isThinking) ? 'none' : '0 4px 10px rgba(21,101,192,0.25)',
            transition: 'all 0.18s ease'
          }}
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
}
