import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listings as staticListings } from '../data/listings';
import { useApp } from '../context/AppContext';
import { queryGeminiForVibeMatch } from '../services/geminiService';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import './AiAgent.css';

export default function AiAgent() {
  const { ownerListings, t, formatPrice, language } = useApp();
  const allListings = [...staticListings, ...ownerListings];
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  // Initialize/Update welcome message when language changes
  useEffect(() => {
    if (messages.length === 0 || (messages.length > 0 && messages[0].isWelcome)) {
      setMessages([{ 
        type: 'ai', 
        isWelcome: true,
        text: t('ai.welcome'),
        matches: [],
        suggestedFollowUps: ['🏖️ Beach vibes', '🏔️ Mountain escape', '💎 Luxury stay', '🏙️ City adventure', '🕊️ Peaceful retreat'],
      }]);
    }
  }, [language, t]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const [pulseAgent, setPulseAgent] = useState(true);
  
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const { 
    isListening, 
    transcript, 
    isSupported: voiceSupported, 
    error: voiceError, 
    volume,
    startListening, 
    stopListening 
  } = useVoiceSearch();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Fill input with voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Remove pulse after first open
  useEffect(() => {
    if (isOpen) setPulseAgent(false);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async (overrideText) => {
    const userText = overrideText || input.trim();
    if (!userText || isThinking) return;

    // Add user message
    const userMsg = { type: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Query Gemini AI with conversation history
      const conversationForContext = messages.filter(m => m.type === 'user' || m.type === 'ai');
      const aiResult = await queryGeminiForVibeMatch(userText, allListings, conversationForContext);

      setDetectedLang(aiResult.detectedLanguage);

      // Build the AI message
      const aiMsg = {
        type: 'ai',
        text: aiResult.response,
        matches: aiResult.matches || [],
        suggestedFollowUps: aiResult.suggestedFollowUps || [],
        detectedLanguage: aiResult.detectedLanguage,
        isAI: aiResult.isAI,
        rawAI: aiResult,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Agent error:', err);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: "Oops! Something went wrong. Let me try again — please rephrase your request! 🔄",
        matches: [],
        suggestedFollowUps: ['🏖️ Beach vibes', '🏔️ Mountain escape', '💎 Luxury stay'],
      }]);
    } finally {
      setIsThinking(false);
    }
  }, [input, isThinking, allListings, messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((finalText) => {
        // Auto-send after voice recognition completes
        handleSend(finalText);
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Extract the text after the emoji
    const text = suggestion.replace(/^[^\s]+\s*/, '');
    setInput(text);
    handleSend(text);
  };

  const getVibeScoreColor = (score) => {
    if (score >= 85) return 'vibe-score--excellent';
    if (score >= 70) return 'vibe-score--great';
    if (score >= 50) return 'vibe-score--good';
    return 'vibe-score--fair';
  };

  return (
    <div className="ai-agent-wrapper">
      {isOpen && (
        <div className="ai-agent-window">
          {/* HEADER */}
          <div className="ai-agent-header">
            <div className="ai-agent-header__info">
              <div className="ai-agent-header__avatar">
                <span className="ai-agent-header__avatar-icon">🤵</span>
                <span className="ai-agent-header__pulse" />
              </div>
              <div>
                <div className="ai-agent-header__title">
                  xRentz Guru
                  <span className="ai-agent-header__ai-badge">AI</span>
                </div>
                <div className="ai-agent-header__status">
                  {isThinking ? (
                    <><span className="status-dot status-dot--thinking" />{t('ai.thinking')}</>
                  ) : (
                    <><span className="status-dot status-dot--online" />Online • {t('ai.gemini')}</>
                  )}
                </div>
              </div>
            </div>
            <div className="ai-agent-header__actions">
              {detectedLang && detectedLang !== 'English' && (
                <span className="ai-agent-header__lang-badge">{detectedLang}</span>
              )}
              <button className="ai-agent-header__close" onClick={() => setIsOpen(false)} aria-label="Close AI Agent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="ai-agent-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message message--${m.type}`}>
                {/* Message text */}
                <div className="message__text">
                  {m.text.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </div>

                {/* Vibe Score Match Cards */}
                {m.matches && m.matches.length > 0 && (
                  <div className="vibe-matches">
                    {m.matches.map((match, idx) => (
                      <div key={idx} className="vibe-match-card">
                        <div className="vibe-match-card__header">
                          <img 
                            src={match.listing?.images?.[0]} 
                            alt={match.listing?.title} 
                            className="vibe-match-card__image"
                            loading="lazy"
                          />
                          <div className={`vibe-score ${getVibeScoreColor(match.vibeScore)}`}>
                            <svg className="vibe-score__ring" viewBox="0 0 36 36">
                              <path
                                className="vibe-score__ring-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="vibe-score__ring-fill"
                                strokeDasharray={`${match.vibeScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="vibe-score__value">{match.vibeScore}%</span>
                          </div>
                        </div>
                        <div className="vibe-match-card__body">
                          <h4 className="vibe-match-card__title">{match.listing?.title}</h4>
                          <p className="vibe-match-card__location">📍 {match.listing?.location}</p>
                          <p className="vibe-match-card__reason">{match.reason}</p>
                           <div className="vibe-match-card__footer">
                            <span className="vibe-match-card__price">
                              {formatPrice(match.listing?.price)}<small>/{t('common.night')}</small>
                            </span>
                            <Link 
                              to={`/listing/${match.id}`} 
                              className="vibe-match-card__btn"
                              onClick={() => setIsOpen(false)}
                            >
                              {t('common.view_property') || 'View →'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Badge */}
                {m.type === 'ai' && m.isAI && (
                  <div className="message__ai-tag">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {t('ai.gemini')}
                  </div>
                )}

                {/* Suggested Follow-ups */}
                {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && i === messages.length - 1 && !isThinking && (
                  <div className="message__suggestions">
                    {m.suggestedFollowUps.map((s, idx) => (
                      <button 
                        key={idx} 
                        className="suggestion-chip" 
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Animation */}
            {isThinking && (
              <div className="message message--ai message--thinking">
                <div className="thinking-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="thinking-text">{t('ai.analyze')}</span>
              </div>
            )}
          </div>

          {/* VOICE OVERLAY */}
          {isListening && (
            <div className="voice-overlay">
              <div className="voice-overlay__content">
                <div className="voice-waves" style={{ '--vol': volume }}>
                  <div className="voice-wave voice-wave--1" />
                  <div className="voice-wave voice-wave--2" />
                  <div className="voice-wave voice-wave--3" />
                  <div className="voice-wave voice-wave--4" />
                  <div className="voice-wave voice-wave--5" />
                </div>
                <div className="voice-mic-ring" style={{ transform: `scale(${1 + volume * 0.4})` }}>
                  <button className="voice-mic-btn voice-mic-btn--active" onClick={handleVoice}>
                    🎤
                  </button>
                </div>
                <p className="voice-overlay__text">
                  {transcript || 'Listening... Speak in any language'}
                </p>
                <button className="voice-overlay__cancel" onClick={stopListening}>Cancel</button>
              </div>
            </div>
          )}

          {/* FOOTER INPUT */}
          <div className="ai-agent-footer">
            {voiceError && (
              <div className="voice-error">{voiceError}</div>
            )}
            <form className="ai-agent-form" onSubmit={handleSubmit}>
              {voiceSupported && (
                <button 
                  type="button" 
                  className={`ai-agent-voice-btn ${isListening ? 'ai-agent-voice-btn--active' : ''}`}
                  onClick={handleVoice}
                  aria-label="Voice search"
                  title="Voice search — speak in any language"
                >
                  🎤
                </button>
              )}
              <input 
                ref={inputRef}
                type="text" 
                className="ai-agent-input" 
                placeholder={t('ai.placeholder')} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
              />
              <button 
                type="submit" 
                className="ai-agent-send" 
                disabled={!input.trim() || isThinking}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button 
        className={`ai-agent-btn ${isOpen ? 'ai-agent-btn--open' : ''} ${pulseAgent ? 'ai-agent-btn--pulse' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Agent' : 'Open AI Agent'}
      >
        <span className="ai-agent-btn__icon">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : '🤵'}
        </span>
        {!isOpen && (
          <>
            <div className="ai-agent-badge">AI</div>
            <div className="ai-agent-btn__label">{t('ai.ask_guru')}</div>
          </>
        )}
      </button>
    </div>
  );
}
