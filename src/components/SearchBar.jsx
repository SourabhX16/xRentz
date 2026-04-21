import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './SearchBar.css';

export default function SearchBar({ variant = 'hero' }) {
  const { searchFilters, setSearchFilters } = useApp();
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchFilters.location) params.set('location', searchFilters.location);
    if (searchFilters.checkIn) params.set('checkIn', searchFilters.checkIn);
    if (searchFilters.checkOut) params.set('checkOut', searchFilters.checkOut);
    if (searchFilters.guests > 1) params.set('guests', searchFilters.guests);
    
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      className={`search-bar search-bar--${variant} ${focused ? 'search-bar--focused' : ''}`}
      onSubmit={handleSearch}
      role="search"
      aria-label="Search rentals"
      id="search-bar"
    >
      <div className={`search-bar__field ${focused === 'location' ? 'search-bar__field--active' : ''}`}>
        <label className="search-bar__label" htmlFor="search-location">Where</label>
        <input
          type="text"
          id="search-location"
          className="search-bar__input"
          placeholder="Search destinations"
          value={searchFilters.location}
          onChange={e => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
          onFocus={() => setFocused('location')}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="search-bar__divider" />

      <div className={`search-bar__field ${focused === 'checkin' ? 'search-bar__field--active' : ''}`}>
        <label className="search-bar__label" htmlFor="search-checkin">Check in</label>
        <input
          type="date"
          id="search-checkin"
          className="search-bar__input"
          value={searchFilters.checkIn}
          onChange={e => setSearchFilters(prev => ({ ...prev, checkIn: e.target.value }))}
          onFocus={() => setFocused('checkin')}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="search-bar__divider" />

      <div className={`search-bar__field ${focused === 'checkout' ? 'search-bar__field--active' : ''}`}>
        <label className="search-bar__label" htmlFor="search-checkout">Check out</label>
        <input
          type="date"
          id="search-checkout"
          className="search-bar__input"
          value={searchFilters.checkOut}
          onChange={e => setSearchFilters(prev => ({ ...prev, checkOut: e.target.value }))}
          onFocus={() => setFocused('checkout')}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="search-bar__divider" />

      <div className={`search-bar__field search-bar__field--guests ${focused === 'guests' ? 'search-bar__field--active' : ''}`}>
        <label className="search-bar__label" htmlFor="search-guests">Guests</label>
        <select
          id="search-guests"
          className="search-bar__input search-bar__select"
          value={searchFilters.guests}
          onChange={e => setSearchFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
          onFocus={() => setFocused('guests')}
          onBlur={() => setFocused(null)}
        >
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="search-bar__submit" aria-label="Search" id="search-submit-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="search-bar__submit-text">Search</span>
      </button>
    </form>
  );
}
