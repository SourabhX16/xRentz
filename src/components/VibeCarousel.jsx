import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listings } from '../data/listings';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './VibeCarousel.css';

const VIBES = [
  { id: 'all', label: 'All Vibes', icon: '✨' },
  { id: 'mountain', label: 'Mountain', icon: '🏔️', keywords: ['cabin', 'manali', 'aspen', 'mountain'] },
  { id: 'beach', label: 'Coastal', icon: '🌊', keywords: ['villa', 'beach', 'malibu', 'goa', 'miami'] },
  { id: 'city', label: 'Metropolis', icon: '🏙️', keywords: ['penthouse', 'manhattan', 'chicago', 'loft'] },
];

export default function VibeCarousel() {
  const { formatPrice, t } = useApp();
  const [activeVibe, setActiveVibe] = useState('all');
  const scrollRef = useRef(null);

  const filteredItems = activeVibe === 'all' 
    ? listings.slice(0, 8)
    : listings.filter(l => {
        const vibe = VIBES.find(v => v.id === activeVibe);
        const text = (l.category + l.location + l.title).toLowerCase();
        return vibe.keywords.some(k => text.includes(k));
      });

  return (
    <section className="vibe-section">
      <div className="container">
        <div className="vibe-header">
          <div className="vibe-titles">
            <span className="vibe-badge">{t('vibe.badge') || 'Experience xRentz'}</span>
            <h2 className="vibe-title">{t('vibe.title') || 'Explore by Vibe'}</h2>
          </div>
          
          <div className="vibe-filters">
            {VIBES.map(v => (
              <button
                key={v.id}
                className={`vibe-filter-btn ${activeVibe === v.id ? 'active' : ''}`}
                onClick={() => setActiveVibe(v.id)}
              >
                <span className="vibe-filter-icon">{v.icon}</span>
                <span className="vibe-filter-label">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="vibe-carousel-wrapper">
        <motion.div 
          className="vibe-carousel"
          drag="x"
          dragConstraints={{ right: 0, left: -((filteredItems.length * 360) - window.innerWidth + 100) }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="vibe-card"
              >
                <Link to={`/listing/${item.id}`} className="vibe-card__inner">
                  <div className="vibe-card__image-wrap">
                    <img src={item.images[0]} alt={item.title} className="vibe-card__image" />
                    <div className="vibe-card__price">
                      <span>{formatPrice(item.price)}</span>/{t('common.night')}
                    </div>
                  </div>
                  <div className="vibe-card__info">
                    <h3 className="vibe-card__title">{item.title}</h3>
                    <p className="vibe-card__location">📍 {item.location}</p>
                    <div className="vibe-card__footer">
                      <span className="vibe-card__tag">{item.category}</span>
                      <span className="vibe-card__rating">⭐ {item.rating}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
