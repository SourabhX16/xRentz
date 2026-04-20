import { useEffect, useRef } from 'react';
import './AtmosphereEffect.css';

export default function AtmosphereEffect({ type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (type !== 'snow' && type !== 'rain') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const count = type === 'snow' ? 100 : (type === 'rain' ? 150 : 0);

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          v: type === 'snow' ? (0.5 + Math.random() * 1.5) : (10 + Math.random() * 15),
          r: type === 'snow' ? (1 + Math.random() * 3) : (1),
          drift: type === 'snow' ? (Math.random() * 1 - 0.5) : 0
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (type === 'snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      } else if (type === 'rain') {
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.4)';
        ctx.lineWidth = 1;
      }
      
      particles.forEach(p => {
        if (type === 'snow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'rain') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 15);
          ctx.stroke();
        }

        p.y += p.v;
        p.x += (p.drift || 0);

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [type]);

  if (type === 'beach') {
    return (
      <div className="atmosphere beach-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    );
  }

  if (type === 'sunny' || type === 'city') {
    return (
      <div className={`atmosphere luxury-glow ${type === 'city' ? 'city-night' : ''}`}>
        <div className="glow-orb orb1"></div>
        <div className="glow-orb orb2"></div>
        {type === 'city' && <div className="city-bokeh"></div>}
      </div>
    );
  }

  return (
    <canvas ref={canvasRef} className="atmosphere-canvas" />
  );
}
