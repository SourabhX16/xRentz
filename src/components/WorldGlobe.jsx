import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listings } from "../data/listings";
import { useGlobe } from "../hooks/useGlobe";
import { GLOBE_CONFIG } from "../config/globeConfig";
import "./WorldGlobe.css";

/**
 * WorldGlobe Component — Interactive 3D Globe Property Explorer
 * Features:
 * - Gold markers for each property location
 * - Click markers to navigate to listing
 * - "Spin to Discover" random destination game
 * - Property count stats
 */
export default function WorldGlobe() {
  const navigate = useNavigate();
  const [discoveredListing, setDiscoveredListing] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Memoize markers to prevent unnecessary globe re-initializations
  const markers = useMemo(() => 
    listings.map(l => ({ location: [l.lat, l.lng], size: 0.06 })), 
  []);

  const { 
    canvasRef, 
    pointerInteracting, 
    pointerInteractionPos, 
    rotationRef, 
    isReady 
  } = useGlobe(markers);

  // Pointer interaction handlers
  const handlePointerDown = (e) => {
    pointerInteracting.current = e.clientX - pointerInteractionPos.current;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  };

  const handlePointerMove = (e) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionPos.current = delta;
      rotationRef.current = delta / GLOBE_CONFIG.interactionSensitivity;
    }
  };

  // "Spin to Discover" — randomly selects a property
  const handleSpinToDiscover = useCallback(() => {
    setIsSpinning(true);
    setDiscoveredListing(null);
    
    // Rapid rotation effect
    let speed = 0;
    const spinInterval = setInterval(() => {
      speed += 0.02;
      rotationRef.current += speed;
    }, 16);

    // Stop after 2 seconds and reveal a random listing
    setTimeout(() => {
      clearInterval(spinInterval);
      const randomIndex = Math.floor(Math.random() * listings.length);
      const picked = listings[randomIndex];
      setDiscoveredListing(picked);
      setIsSpinning(false);
    }, 2000);
  }, [rotationRef]);

  const handleGoToListing = () => {
    if (discoveredListing) {
      navigate(`/listing/${discoveredListing.id}`);
    }
  };

  // Count unique countries
  const uniqueCountries = useMemo(() => {
    const countries = new Set();
    listings.forEach(l => {
      const parts = l.location.split(',');
      const country = parts[parts.length - 1]?.trim();
      if (country) countries.add(country);
    });
    return countries.size;
  }, []);

  return (
    <section className="globe-section" aria-labelledby="globe-title">
      <div className="container globe-grid">
        <header className="globe-content animate-fade-in">
          <span className="globe-badge">🌍 Global Presence</span>
          <h2 id="globe-title" className="globe-title">Discover Properties<br />Across the Globe</h2>
          <p className="globe-text">
            From the bustling streets of Manhattan to the serene backwaters of Kerala, 
            explore our curated collection of elite stays in prime locations worldwide.
          </p>
          <div className="globe-stats">
            <StatItem value={`${uniqueCountries}`} label="Countries" />
            <StatItem value={`${listings.length}`} label="Properties" />
            <StatItem value="4.9" label="Avg Rating" />
          </div>
          
          {/* Spin to Discover Button */}
          <button 
            className={`globe-spin-btn ${isSpinning ? 'globe-spin-btn--active' : ''}`}
            onClick={handleSpinToDiscover}
            disabled={isSpinning}
          >
            <span className="globe-spin-btn__icon">{isSpinning ? '🎰' : '🎲'}</span>
            <span>{isSpinning ? 'Spinning...' : 'Spin to Discover'}</span>
          </button>

          {/* Discovered Listing Card */}
          {discoveredListing && !isSpinning && (
            <div className="globe-discovered animate-scale-in">
              <img 
                src={discoveredListing.images[0]} 
                alt={discoveredListing.title}
                className="globe-discovered__img"
              />
              <div className="globe-discovered__info">
                <h4 className="globe-discovered__title">{discoveredListing.title}</h4>
                <p className="globe-discovered__location">📍 {discoveredListing.location}</p>
                <div className="globe-discovered__meta">
                  <span className="globe-discovered__price">${discoveredListing.price}/night</span>
                  <span className="globe-discovered__rating">⭐ {discoveredListing.rating}</span>
                </div>
                <button className="globe-discovered__btn" onClick={handleGoToListing}>
                  View Property →
                </button>
              </div>
            </div>
          )}
        </header>

        <div className="globe-visual">
          <canvas
            ref={canvasRef}
            className="globe-canvas"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerOut={handlePointerUp}
            onPointerMove={handlePointerMove}
            style={{ 
              width: 600, 
              height: 600, 
              maxWidth: "100%", 
              aspectRatio: 1,
              opacity: isReady ? 1 : 0,
              transition: GLOBE_CONFIG.opacityTransition,
              cursor: 'grab'
            }}
          />
          {/* Glow effect behind globe */}
          <div className="globe-glow" />
        </div>
      </div>
    </section>
  );
}

/**
 * StatItem Sub-component
 */
function StatItem({ value, label }) {
  return (
    <div className="globe-stat">
      <span className="val">{value}</span>
      <span className="lbl">{label}</span>
    </div>
  );
}
