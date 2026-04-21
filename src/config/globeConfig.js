/**
 * Configuration for the COBE interactive globe
 * This separates visual presentation from component logic
 */
export const GLOBE_CONFIG = {
  devicePixelRatio: 1,
  phi: 0,
  theta: 0,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 10000,
  mapBrightness: 6,
  baseColor: [0.8, 0.8, 0.8], // Bright base for dark mode additive blending
  markerColor: [1, 0.84, 0],  // Gold markers
  glowColor: [1, 1, 1],       // White glow
  opacityTransition: 'opacity 1s ease',
  defaultWidth: 1200,
  rotationSpeed: 0.005,
  interactionSensitivity: 200,
};
