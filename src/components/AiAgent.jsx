import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listings as staticListings } from '../data/listings';
import { useApp } from '../context/AppContext';
import './AiAgent.css';

export default function AiAgent() {
  const { ownerListings } = useApp();
  const allListings = [...staticListings, ...ownerListings];
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hello! I'm xRentz Guru. What type of vibe are you looking for today? (e.g. Beach, Mountain, City, Luxury, Peaceful)" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null); // Track the currently suggested listing for follow-up details
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let response = "";
      let foundListing = null;

      // 1. Check if user is asking for specific details about the PREVIOUS match
      if (currentMatch && (lowerMsg.includes('detail') || lowerMsg.includes('more') || lowerMsg.includes('info') || lowerMsg.includes('about'))) {
        foundListing = currentMatch;
        response = `Here are the details for "${foundListing.title}":
💰 Price: $${foundListing.price}/night
📍 Location: ${foundListing.location}
👥 Capacity: Up to ${foundListing.guests} guests
🛏️ Rooms: ${foundListing.bedrooms} Bed, ${foundListing.bathrooms} Bath
✨ Top Amenities: ${foundListing.amenities.slice(0, 4).join(', ')}
⭐ Rating: ${foundListing.rating} (${foundListing.reviews} reviews)

"${foundListing.description}"`;
        
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: response,
          link: { label: 'View Propery Details', to: `/listing/${foundListing.id}` }
        }]);
      } 
      // 2. Predict Location Based on Vibe
      else {
        let matched = [];
        
        if (lowerMsg.includes('beach') || lowerMsg.includes('ocean') || lowerMsg.includes('water')) {
          matched = allListings.filter(l => l.category === 'villa' || l.location.includes('Malibu') || l.description.toLowerCase().includes('beach'));
        } else if (lowerMsg.includes('mountain') || lowerMsg.includes('peace') || lowerMsg.includes('quiet') || lowerMsg.includes('cabin')) {
          matched = allListings.filter(l => l.category === 'cabin' || l.location.includes('Aspen') || l.description.toLowerCase().includes('mountain'));
        } else if (lowerMsg.includes('luxury') || lowerMsg.includes('gold') || lowerMsg.includes('expensive') || lowerMsg.includes('mansion')) {
          matched = allListings.sort((a, b) => b.price - a.price).slice(0, 3);
        } else if (lowerMsg.includes('city') || lowerMsg.includes('downtown') || lowerMsg.includes('work') || lowerMsg.includes('apartment')) {
          matched = allListings.filter(l => l.category === 'apartment' || l.category === 'penthouse' || l.location.includes('City') || l.location.includes('district'));
        } else if (lowerMsg.includes('creative') || lowerMsg.includes('art') || lowerMsg.includes('studio')) {
          matched = allListings.filter(l => l.category === 'studio');
        } else {
          // General search
          matched = allListings.filter(l => 
            l.location.toLowerCase().includes(lowerMsg) || 
            l.title.toLowerCase().includes(lowerMsg) || 
            l.description.toLowerCase().includes(lowerMsg)
          );
        }

        if (matched.length > 0) {
          const top = matched[0];
          setCurrentMatch(top);
          response = `Based on your vibe, I highly recommend "${top.title}" in ${top.location}.\nIt costs around $${top.price}/night.\n\nWould you like to know more details?`;
          
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: response,
            link: { label: 'Go to Listing →', to: `/listing/${top.id}` }
          }]);
        } else {
          response = "I couldn't find a perfect match for that vibe. Tell me more, or try 'Beach', 'Luxury', or 'Peaceful'.";
          setMessages(prev => [...prev, { type: 'ai', text: response }]);
          setCurrentMatch(null);
        }
      }
      setIsTyping(false);
    }, 1000);
  };

  const suggestions = ["🏖️ Beach", "🏔️ Mountain", "💎 Luxury", "✨ Peaceful", "🏢 City"];

  return (
    <div className="ai-agent-wrapper">
      {isOpen && (
        <div className="ai-agent-window">
          <div className="ai-agent-header">
            <div className="ai-agent-header__info">
              <div className="ai-agent-header__avatar">🛡️</div>
              <div>
                <div className="ai-agent-header__title">xRentz Guru</div>
                <div className="ai-agent-header__status"><span>●</span> Online Agent</div>
              </div>
            </div>
            <button className="ai-agent-header__close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="ai-agent-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message message--${m.type}`}>
                {m.text.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
                {m.link && (
                  <Link 
                    to={m.link.to} 
                    className="ai-agent-link-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    {m.link.label}
                  </Link>
                )}
              </div>
            ))}
            {isTyping && <div className="message message--ai">Looking into our latest listings...</div>}
          </div>

          <div className="ai-agent-footer">
            <div className="suggestion-chips">
              {suggestions.map(s => (
                <span key={s} className="chip" onClick={() => {
                  setInput(s.split(' ')[1]);
                }}>{s}</span>
              ))}
            </div>
            <form className="ai-agent-form" onSubmit={handleSend}>
              <input 
                type="text" 
                className="ai-agent-input" 
                placeholder="Message your agent..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="ai-agent-send">➤</button>
            </form>
          </div>
        </div>
      )}

      <button className="ai-agent-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="ai-agent-btn__icon">{isOpen ? '💬' : '🤵'}</span>
        <div className="ai-agent-badge"></div>
      </button>
    </div>
  );
}
