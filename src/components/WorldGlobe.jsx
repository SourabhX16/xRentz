import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { listings } from "../data/listings";
import "./WorldGlobe.css";

export default function WorldGlobe() {
  const canvasRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractionPos = useRef(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2 || 1200,
      height: width * 2 || 1200,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.4],
      markerColor: [1, 0.84, 0],
      glowColor: [1, 1, 1],
      markers: listings.map(l => ({ location: [l.lat, l.lng], size: 0.05 })),
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + rotationRef.current;
        state.width = width * 2 || 1200;
        state.height = width * 2 || 1200;
      },
    });

    setTimeout(() => { if(canvasRef.current) canvasRef.current.style.opacity = '1' }, 500);
    
    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="globe-section">
      <div className="container globe-grid">
        <div className="globe-content animate-fade-in">
          <span className="globe-badge">Global Presence</span>
          <h2 className="globe-title">Discover Properties Across the Globe</h2>
          <p className="globe-text">
            From the bustling streets of Manhattan to the serene backwaters of Kerala, 
            explore our curated collection of elite stays in prime locations worldwide.
          </p>
          <div className="globe-stats">
            <div className="globe-stat">
              <span className="val">24</span>
              <span className="lbl">Countries</span>
            </div>
            <div className="globe-stat">
              <span className="val">150+</span>
              <span className="lbl">Cities</span>
            </div>
          </div>
        </div>
        <div className="globe-visual">
          <canvas
            ref={canvasRef}
            className="globe-canvas"
            onPointerDown={(e) => {
              pointerInteracting.current = e.clientX - pointerInteractionPos.current;
              canvasRef.current.style.cursor = 'grabbing';
            }}
            onPointerUp={() => {
              pointerInteracting.current = null;
              canvasRef.current.style.cursor = 'grab';
            }}
            onPointerOut={() => {
              pointerInteracting.current = null;
              canvasRef.current.style.cursor = 'grab';
            }}
            onPointerMove={(e) => {
              if (pointerInteracting.current !== null) {
                const delta = e.clientX - pointerInteracting.current;
                pointerInteractionPos.current = delta;
                rotationRef.current = delta / 200;
              }
            }}
            style={{ 
              width: 600, 
              height: 600, 
              maxWidth: "100%", 
              aspectRatio: 1,
              opacity: 0,
              transition: 'opacity 1s ease'
            }}
          />
        </div>
      </div>
    </section>
  );
}
