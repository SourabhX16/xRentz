/**
 * Weather Service for xRentz — Live Atmosphere Preview
 * Uses Open-Meteo API (100% free, no API key required) for exact real-time weather data
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// Cache to avoid redundant API calls (keyed by lat,lng rounded to 2 decimals)
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Noise level estimation based on property category & location
 */
function estimateNoiseLevel(listing) {
  if (!listing) return { level: 'moderate', score: 50, label: 'Moderate', icon: '🔊' };
  
  const cat = listing.category?.toLowerCase() || '';
  const loc = (listing.location || '').toLowerCase();
  const title = (listing.title || '').toLowerCase();

  // Quiet places
  if (['cabin', 'house'].includes(cat) || 
      loc.includes('manali') || loc.includes('alleppey') || loc.includes('pondicherry') || 
      loc.includes('udaipur') || loc.includes('tahoe') || loc.includes('aspen') ||
      title.includes('serene') || title.includes('peaceful') || title.includes('retreat')) {
    return { level: 'quiet', score: 15, label: 'Very Quiet', icon: '🤫' };
  }
  
  // Bustling places
  if (['penthouse', 'loft'].includes(cat) || 
      loc.includes('manhattan') || loc.includes('mumbai') || loc.includes('chicago') ||
      loc.includes('miami') || loc.includes('bengaluru')) {
    return { level: 'bustling', score: 75, label: 'Bustling', icon: '🏙️' };
  }

  // Beach/resort — moderate-low
  if (cat === 'villa' || loc.includes('malibu') || loc.includes('goa')) {
    return { level: 'calm', score: 30, label: 'Calm & Breezy', icon: '🌊' };
  }

  return { level: 'moderate', score: 50, label: 'Moderate', icon: '🔊' };
}

/**
 * Map Open-Meteo WMO weather codes to atmosphere types and icons
 */
function mapWeatherCode(code) {
  if (code === 0) return { desc: 'Clear sky', icon: '☀️', type: 'sunny' };
  if (code === 1) return { desc: 'Mainly clear', icon: '🌤️', type: 'sunny' };
  if (code === 2) return { desc: 'Partly cloudy', icon: '⛅', type: 'city' };
  if (code === 3) return { desc: 'Overcast', icon: '☁️', type: 'city' };
  if ([45, 48].includes(code)) return { desc: 'Foggy', icon: '🌫️', type: 'city' };
  if ([51, 53, 55, 56, 57].includes(code)) return { desc: 'Drizzle', icon: '🌧️', type: 'rain' };
  if ([61, 63, 65, 66, 67].includes(code)) return { desc: 'Rain', icon: '🌧️', type: 'rain' };
  if ([71, 73, 75, 77].includes(code)) return { desc: 'Snowfall', icon: '🌨️', type: 'snow' };
  if ([80, 81, 82].includes(code)) return { desc: 'Rain showers', icon: '🌦️', type: 'rain' };
  if ([85, 86].includes(code)) return { desc: 'Snow showers', icon: '🌨️', type: 'snow' };
  if ([95, 96, 99].includes(code)) return { desc: 'Thunderstorm', icon: '⛈️', type: 'rain' };
  
  return { desc: 'Clear', icon: '☀️', type: 'sunny' };
}

/**
 * Simulate weather data as a last-resort fallback
 */
function simulateWeather(lat, lng, listing) {
  const cat = listing?.category?.toLowerCase() || '';
  const loc = (listing?.location || '').toLowerCase();

  let temp, description, icon, atmosphereType, humidity, windSpeed;

  if (cat === 'cabin' || loc.includes('aspen') || loc.includes('manali') || loc.includes('colorado')) {
    temp = Math.round(-2 + Math.random() * 8);
    description = 'Light Snow';
    icon = '🌨️';
    atmosphereType = 'snow';
    humidity = 70;
    windSpeed = 12;
  } else if (cat === 'villa' || loc.includes('malibu') || loc.includes('goa') || loc.includes('miami') || loc.includes('kerala')) {
    temp = Math.round(26 + Math.random() * 6);
    description = 'Sunny & Warm';
    icon = '☀️';
    atmosphereType = 'beach';
    humidity = 65;
    windSpeed = 8;
  } else if (loc.includes('mumbai') || loc.includes('portland')) {
    temp = Math.round(22 + Math.random() * 6);
    description = 'Partly Cloudy';
    icon = '🌤️';
    atmosphereType = 'rain';
    humidity = 80;
    windSpeed = 6;
  } else if (loc.includes('manhattan') || loc.includes('chicago') || loc.includes('bengaluru')) {
    temp = Math.round(18 + Math.random() * 8);
    description = 'Clear Sky';
    icon = '🏙️';
    atmosphereType = 'city';
    humidity = 45;
    windSpeed = 10;
  } else {
    temp = Math.round(20 + Math.random() * 8);
    description = 'Pleasant';
    icon = '⛅';
    atmosphereType = 'sunny';
    humidity = 55;
    windSpeed = 7;
  }

  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, Math.floor(Math.random() * 30), 0);
  const sunset = new Date(now);
  sunset.setHours(18, Math.floor(Math.random() * 30), 0);

  return {
    temp,
    feelsLike: temp + Math.round(Math.random() * 3 - 1),
    description,
    icon,
    humidity,
    windSpeed,
    atmosphereType,
    sunrise: sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    noise: estimateNoiseLevel(listing),
    isLive: false,
    city: listing?.location?.split(',')[0]?.trim() || 'Unknown',
  };
}

/**
 * Format ISO time string (like "2025-04-21T06:14") to short time (like "06:14 AM")
 */
function formatTime(isoString) {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Fetch exact real-time weather data using the free Open-Meteo API
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude  
 * @param {Object} listing - The property listing object for context
 * @returns {Object} Weather data with atmosphere type, temp, conditions, sunrise/sunset, noise
 */
export async function getWeatherForLocation(lat, lng, listing) {
  const cacheKey = `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;
  
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, noise: estimateNoiseLevel(listing) };
  }

  try {
    const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    
    const data = await res.json();
    
    const current = data.current;
    const daily = data.daily;
    const mapped = mapWeatherCode(current.weather_code);
    
    // Special case: if atmosphere uses 'city' but location is a beach, force 'beach'
    let atmosphereType = mapped.type;
    const cat = listing?.category?.toLowerCase() || '';
    const loc = (listing?.location || '').toLowerCase();
    
    if (['sunny', 'city'].includes(atmosphereType) && (cat === 'villa' || loc.includes('malibu') || loc.includes('goa') || loc.includes('beach'))) {
      atmosphereType = 'beach';
    }
    
    const result = {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: mapped.desc,
      icon: mapped.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      atmosphereType,
      sunrise: formatTime(daily?.sunrise?.[0]),
      sunset: formatTime(daily?.sunset?.[0]),
      noise: estimateNoiseLevel(listing),
      isLive: true,
      city: listing?.location?.split(',')[0]?.trim() || 'Unknown location',
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error('Exact weather fetch failed, using simulation:', err);
    const simulated = simulateWeather(lat, lng, listing);
    cache.set(cacheKey, { data: simulated, timestamp: Date.now() });
    return simulated;
  }
}
