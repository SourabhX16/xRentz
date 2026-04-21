import { useState, useEffect } from 'react';
import { getWeatherForLocation } from '../services/weatherService';
import './WeatherWidget.css';

/**
 * Live Weather Widget — Shows real-time weather conditions at a property's location
 * Features: temperature, conditions, sunrise/sunset, humidity, wind, noise level
 */
export default function WeatherWidget({ listing }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listing?.lat || !listing?.lng) return;

    setLoading(true);
    getWeatherForLocation(listing.lat, listing.lng, listing)
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [listing?.lat, listing?.lng, listing?.id]);

  if (loading) {
    return (
      <div className="weather-widget weather-widget--loading">
        <div className="weather-widget__skeleton">
          <div className="skeleton" style={{ width: '60%', height: 20 }} />
          <div className="skeleton" style={{ width: '40%', height: 16, marginTop: 8 }} />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`weather-widget weather-widget--${weather.atmosphereType}`}>
      {/* HEADER */}
      <div className="weather-widget__header">
        <div className="weather-widget__title-row">
          <h3 className="weather-widget__title">Live Weather</h3>
          {weather.isLive ? (
            <span className="weather-widget__live-tag">
              <span className="weather-widget__live-dot" />
              LIVE
            </span>
          ) : (
            <span className="weather-widget__sim-tag">Estimated</span>
          )}
        </div>
        <p className="weather-widget__city">{weather.city}</p>
      </div>

      {/* MAIN TEMP DISPLAY */}
      <div className="weather-widget__main">
        <div className="weather-widget__temp-block">
          <span className="weather-widget__icon">{weather.icon}</span>
          <div>
            <span className="weather-widget__temp">{weather.temp}°C</span>
            <span className="weather-widget__desc">{weather.description}</span>
          </div>
        </div>
        <p className="weather-widget__feels">Feels like {weather.feelsLike}°C</p>
      </div>

      {/* DETAILS GRID */}
      <div className="weather-widget__grid">
        <div className="weather-widget__detail">
          <span className="weather-widget__detail-icon">🌅</span>
          <div>
            <span className="weather-widget__detail-label">Sunrise</span>
            <span className="weather-widget__detail-value">{weather.sunrise}</span>
          </div>
        </div>
        <div className="weather-widget__detail">
          <span className="weather-widget__detail-icon">🌇</span>
          <div>
            <span className="weather-widget__detail-label">Sunset</span>
            <span className="weather-widget__detail-value">{weather.sunset}</span>
          </div>
        </div>
        <div className="weather-widget__detail">
          <span className="weather-widget__detail-icon">💧</span>
          <div>
            <span className="weather-widget__detail-label">Humidity</span>
            <span className="weather-widget__detail-value">{weather.humidity}%</span>
          </div>
        </div>
        <div className="weather-widget__detail">
          <span className="weather-widget__detail-icon">💨</span>
          <div>
            <span className="weather-widget__detail-label">Wind</span>
            <span className="weather-widget__detail-value">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* NOISE LEVEL INDICATOR */}
      <div className="weather-widget__noise">
        <div className="weather-widget__noise-header">
          <span className="weather-widget__noise-icon">{weather.noise.icon}</span>
          <span className="weather-widget__noise-label">Noise Level: <strong>{weather.noise.label}</strong></span>
        </div>
        <div className="weather-widget__noise-bar">
          <div
            className={`weather-widget__noise-fill weather-widget__noise-fill--${weather.noise.level}`}
            style={{ width: `${weather.noise.score}%` }}
          />
        </div>
        <div className="weather-widget__noise-scale">
          <span>Silent</span>
          <span>Bustling</span>
        </div>
      </div>
    </div>
  );
}
