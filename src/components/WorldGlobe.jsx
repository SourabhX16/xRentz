import { useMemo } from "react";
import { listings } from "../data/listings";
import { useGlobe } from "../hooks/useGlobe";
import { GLOBE_CONFIG } from "../config/globeConfig";
import "./WorldGlobe.css";

/**
 * WorldGlobe Component
 * Renders a high-end interactive 3D globe visualization of property listings.
 * 
 * @component
 * @returns {JSX.Element}
 */
export default function WorldGlobe() {
  // Memoize markers to prevent unnecessary globe re-initializations
  const markers = useMemo(() => 
    listings.map(l => ({ location: [l.lat, l.lng], size: 0.05 })), 
  []);

  const { 
    canvasRef, 
    pointerInteracting, 
    pointerInteractionPos, 
    rotationRef, 
    isReady 
  } = useGlobe(markers);

  /**
   * Pointer interaction handlers
   */
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

  return (
    <section className="globe-section" aria-labelledby="globe-title">
      <div className="container globe-grid">
        <header className="globe-content animate-fade-in">
          <span className="globe-badge">Global Presence</span>
          <h2 id="globe-title" className="globe-title">Discover Properties Across the Globe</h2>
          <p className="globe-text">
            From the bustling streets of Manhattan to the serene backwaters of Kerala, 
            explore our curated collection of elite stays in prime locations worldwide.
          </p>
          <div className="globe-stats">
            <StatItem value="24" label="Countries" />
            <StatItem value="150+" label="Cities" />
          </div>
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
        </div>
      </div>
    </section>
  );
}

/**
 * StatItem Sub-component
 * @param {Object} props
 * @param {string} props.value
 * @param {string} props.label
 */
function StatItem({ value, label }) {
  return (
    <div className="globe-stat">
      <span className="val">{value}</span>
      <span className="lbl">{label}</span>
    </div>
  );
}
