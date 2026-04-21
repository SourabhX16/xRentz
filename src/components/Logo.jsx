import './Logo.css';

export default function Logo({ size = 28 }) {
  return (
    <div className="xrentz-logo" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="xrentz-logo__svg"
      >
        {/* Background Shield/Circle with Theme-Dependent Glow */}
        <rect 
          width="28" height="28" rx="8" 
          className="logo-bg"
          fill="url(#logo-gradient)" 
        />
        
        {/* The Stylish 'X' merged with a location/house motif */}
        <path 
          d="M8 8L20 20M20 8L16 12M12 16L8 20" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        
        {/* Decorative Dot/Core */}
        <circle cx="14" cy="14" r="2.5" fill="white" className="logo-pulse" />

        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" className="logo-stop-1" />
            <stop offset="100%" className="logo-stop-2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
