import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { listings as staticListings, categories, amenities } from '../data/listings';
import { useApp } from '../context/AppContext';
import './Listings.css';

// Fix leaflet default marker icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Listings() {
  const [searchParams] = useSearchParams();
  const { searchFilters, setSearchFilters, ownerListings, formatPrice, t } = useApp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    let updates = {};
    if (params.location && params.location !== searchFilters.location) updates.location = params.location;
    if (params.checkIn && params.checkIn !== searchFilters.checkIn) updates.checkIn = params.checkIn;
    if (params.checkOut && params.checkOut !== searchFilters.checkOut) updates.checkOut = params.checkOut;
    if (params.guests && parseInt(params.guests) !== searchFilters.guests) updates.guests = parseInt(params.guests);

    if (Object.keys(updates).length > 0) {
      setSearchFilters(prev => ({ ...prev, ...updates }));
    }
  }, [searchParams, setSearchFilters, searchFilters]);

  const categoryParam = searchParams.get('category') || 'all';

  const allListings = useMemo(() => [...staticListings, ...ownerListings], [ownerListings]);

  const filtered = useMemo(() => {
    let result = [...allListings];

    if (categoryParam !== 'all') {
      result = result.filter(l => l.category === categoryParam);
    }

    if (searchFilters.location) {
      const loc = searchFilters.location.toLowerCase();
      result = result.filter(l => l.location.toLowerCase().includes(loc));
    }

    result = result.filter(l => l.price >= priceRange[0] && l.price <= priceRange[1]);

    if (selectedAmenities.length > 0) {
      result = result.filter(l =>
        selectedAmenities.every(a => l.amenities.includes(a))
      );
    }

    if (searchFilters.guests > 1) {
      result = result.filter(l => l.guests >= searchFilters.guests);
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [categoryParam, searchFilters, priceRange, selectedAmenities, sortBy, allListings]);

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  return (
    <div className="listings-page">
      {/* SEARCH HEADER */}
      <div className="listings-page__header">
        <div className="container">
          <div className="listings-page__search-row">
            <SearchBar variant="compact" />
          </div>
        </div>
      </div>

      <div className="container listings-page__body">
        {/* TOOLBAR */}
        <div className="listings-toolbar">
          <div className="listings-toolbar__left">
            <h1 className="listings-toolbar__title">
              {categoryParam !== 'all'
                ? categories.find(c => c.id === categoryParam)?.label || 'All'
                : 'All Rentals'}
            </h1>
            <span className="listings-toolbar__count">{filtered.length} {t('common.places') || 'places'}</span>
          </div>
          <div className="listings-toolbar__right">
            <button
              className={`btn btn--secondary btn--sm listings-toolbar__filter-btn ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
              id="filter-toggle-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/>
              </svg>
              Filters
              {selectedAmenities.length > 0 && (
                <span className="listings-toolbar__badge">{selectedAmenities.length}</span>
              )}
            </button>
            <select
              className="listings-toolbar__sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort by"
              id="sort-select"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="listings-toolbar__view-toggle">
              <button
                className={`listings-toolbar__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              </button>
              <button
                className={`listings-toolbar__view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
                aria-label="Map view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="listings-categories">
          {categories.map(cat => (
            <a
              key={cat.id}
              href={`/listings?category=${cat.id}`}
              className={`listings-category ${categoryParam === cat.id ? 'listings-category--active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </a>
          ))}
        </div>

        {/* FILTERS PANEL */}
        {filtersOpen && (
          <div className="filters-panel animate-fade-in" id="filters-panel">
            <div className="filters-panel__section">
              <h3 className="filters-panel__title">Price Range</h3>
              <div className="filters-panel__price">
                <div className="filters-panel__price-input">
                  <label htmlFor="price-min">Min</label>
                  <input
                    id="price-min"
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                    className="form-input form-input--sm"
                  />
                </div>
                <span className="filters-panel__price-sep">—</span>
                <div className="filters-panel__price-input">
                  <label htmlFor="price-max">Max</label>
                  <input
                    id="price-max"
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                    className="form-input form-input--sm"
                  />
                </div>
              </div>
            </div>
            <div className="filters-panel__section">
              <h3 className="filters-panel__title">Amenities</h3>
              <div className="filters-panel__amenities">
                {amenities.map(a => (
                  <button
                    key={a}
                    className={`amenity-chip ${selectedAmenities.includes(a) ? 'amenity-chip--active' : ''}`}
                    onClick={() => toggleAmenity(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="filters-panel__actions">
              <button className="btn btn--ghost btn--sm" onClick={() => { setSelectedAmenities([]); setPriceRange([0, 1000]); }}>
                Clear All
              </button>
              <button className="btn btn--primary btn--sm" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {filtered.length > 0 ? (
          viewMode === 'map' ? (
            <div className="listings-map-container animate-fade-in" style={{ height: '70vh', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
              <MapContainer center={[39.8283, -98.5795]} zoom={3} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {filtered.map((listing) => (
                  <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                    <Popup className="custom-popup">
                      <div className="map-popup-card">
                        <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                        <div style={{ padding: '8px' }}>
                          <h4 style={{ margin: '0 0 4px', fontSize: '14px' }}>{listing.title}</h4>
                          <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>{formatPrice(listing.price)} / {t('common.night')}</p>
                          <a href={`/listing/${listing.id}`} className="btn btn--primary btn--sm" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>{t('common.view_property') || 'View Property'}</a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="listing-grid stagger">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          )
        ) : (
          <div className="listings-empty animate-fade-in">
            <div className="listings-empty__icon">🏠</div>
            <h2 className="listings-empty__title">No places found</h2>
            <p className="listings-empty__text">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              className="btn btn--primary btn--md"
              onClick={() => {
                setSelectedAmenities([]);
                setPriceRange([0, 1000]);
                setSearchFilters(prev => ({ ...prev, location: '', guests: 1 }));
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
