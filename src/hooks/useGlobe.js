import createGlobe from "cobe";
import { useEffect, useRef, useState, useCallback } from "react";
import { GLOBE_CONFIG } from "../config/globeConfig";

/**
 * Custom hook to manage COBE globe instance and interactions
 * @param {Array} markers - Array of { location: [lat, lng], size: number }
 * @returns {Object} { canvasRef, pointerInteracting, pointerInteractionPos, rotationRef, isReady }
 */
export function useGlobe(markers) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionPos = useRef(0);
  const rotationRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      // Re-trigger render logic if needed or handle layout
    }
  }, []);

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
      ...GLOBE_CONFIG,
      width: width * 2 || GLOBE_CONFIG.defaultWidth,
      height: width * 2 || GLOBE_CONFIG.defaultWidth,
      markers: markers || [],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += GLOBE_CONFIG.rotationSpeed;
        }
        state.phi = phi + rotationRef.current;
        state.width = width * 2 || GLOBE_CONFIG.defaultWidth;
        state.height = width * 2 || GLOBE_CONFIG.defaultWidth;
      },
    });

    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
      clearTimeout(readyTimeout);
    };
  }, [markers]);

  return {
    canvasRef,
    pointerInteracting,
    pointerInteractionPos,
    rotationRef,
    isReady
  };
}
