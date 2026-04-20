import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listings } from '../data/listings';
import { Link } from 'react-router-dom';
import './DestinationWall.css';

const TOP_LOCATIONS = [
  { id: 1, name: 'Manhattan', propertyId: 1 },
  { id: 2, name: 'Malibu', propertyId: 2 },
  { id: 3, name: 'Aspen', propertyId: 3 },
  { id: 4, name: 'Miami', propertyId: 5 },
  { id: 5, name: 'Goa', propertyId: 9 },
  { id: 6, name: 'Manali', propertyId: 12 },
];

export default function DestinationWall() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProperty = listings.find(l => l.id === TOP_LOCATIONS[activeIndex].propertyId);

  return (
    <section className="dest-wall">
      <div className="container dest-wall__grid">
        <div className="dest-wall__left">
          <div className="dest-wall__header">
            <span className="dest-wall__badge">Curated Collections</span>
            <h2 className="dest-wall__title">Iconic Destinations</h2>
          </div>
          
          <nav className="dest-nav">
            {TOP_LOCATIONS.map((loc, idx) => (
              <button
                key={loc.id}
                className={`dest-nav__item ${activeIndex === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="dest-nav__number">0{idx + 1}</span>
                <span className="dest-nav__name">{loc.name}</span>
                <div className="dest-nav__line" />
              </button>
            ))}
          </nav>
        </div>

        <div className="dest-wall__right">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProperty.id}
              initial={{ opacity: 0, x: 20, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="dest-preview"
            >
              <div className="dest-preview__image-wrap">
                <img src={activeProperty.images[0]} alt={activeProperty.title} className="dest-preview__bg" />
                <div className="dest-preview__overlay" />
                
                <div className="dest-preview__content">
                  <div className="dest-preview__info">
                    <span className="dest-preview__category">{activeProperty.category}</span>
                    <h3 className="dest-preview__title">{activeProperty.title}</h3>
                    <div className="dest-preview__meta">
                      <span className="price">${activeProperty.price} / night</span>
                      <span className="rating">⭐ {activeProperty.rating}</span>
                    </div>
                  </div>
                  <Link to={`/listing/${activeProperty.id}`} className="dest-preview__btn">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
