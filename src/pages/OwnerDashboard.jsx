import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { categories, amenities } from '../data/listings';
import './OwnerDashboard.css';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
];

const emptyForm = {
  title: '',
  category: 'apartment',
  location: '',
  price: '',
  guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  description: '',
  selectedAmenities: [],
  images: [],
  lat: 20.5937, // Default center (India)
  lng: 78.9629,
};

function LocationPicker({ lat, lng, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={[lat, lng]} />;
}

export default function OwnerDashboard() {
  const { user, ownerListings, addOwnerListing, removeOwnerListing, logout, addToast, bookings, addBooking: addOwnerBooking } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  if (!user) {
    return (
      <div className="dashboard-empty container animate-fade-in">
        <div className="dashboard-empty__icon">🔐</div>
        <h2>Please sign in as Property Owner</h2>
        <p>You need to be logged in as an owner to manage listings.</p>
        <Link to="/auth?role=owner" className="btn btn--primary btn--lg">Sign In as Owner</Link>
      </div>
    );
  }

  if (user.role !== 'owner') {
    return (
      <div className="dashboard-empty container animate-fade-in">
        <div className="dashboard-empty__icon">🏠</div>
        <h2>Owner Account Required</h2>
        <p>This dashboard is for property owners. Switch to owner login to access it.</p>
        <Link to="/dashboard" className="btn btn--primary btn--lg">Go to Renter Dashboard</Link>
      </div>
    );
  }

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.location.trim()) errors.location = 'Location is required';
    if (!form.price || form.price <= 0) errors.price = 'Valid price is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Simulate real upload by converting to Data URLs
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    })).then(dataUrls => {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...dataUrls].slice(0, 5) // max 5 images
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const randomImages = [...PROPERTY_IMAGES].sort(() => 0.5 - Math.random()).slice(0, 3);

    addOwnerListing({
      title: form.title,
      category: form.category,
      location: form.location,
      price: Number(form.price),
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      description: form.description,
      amenities: form.selectedAmenities,
      images: form.images.length > 0 ? form.images : randomImages,
      lat: form.lat,
      lng: form.lng,
    });

    setForm({ ...emptyForm });
    setShowAddForm(false);
  };

  const totalEarnings = ownerListings.length * 1250;
  const totalViews = ownerListings.length * 340;

  const tabs = [
    { id: 'properties', label: '🏠 My Properties', count: ownerListings.length },
    { id: 'availability', label: '📅 Availability', count: null },
    { id: 'bookings', label: '📋 Bookings Received', count: ownerListings.length > 0 ? 2 : 0 },
    { id: 'earnings', label: '💰 Earnings', count: null },
    { id: 'profile', label: '👤 Profile', count: null },
  ];

  const handleBlockDates = (e) => {
    e.preventDefault();
    const lId = parseInt(e.target.listingId.value);
    const start = e.target.start.value;
    const end = e.target.end.value;

    if (!lId || !start || !end) return;

    addOwnerBooking({
      listingId: lId,
      checkIn: start,
      checkOut: end,
      guestName: 'OWNER BLOCKED',
      status: 'blocked',
      total: 0,
      guests: 0
    });
    addToast('Dates blocked successfully', 'success');
  };

  return (
    <div className="dashboard container">
      {/* HEADER */}
      <div className="dashboard__header animate-fade-in">
        <div className="dashboard__user">
          <div className="dashboard__avatar">{user.avatar}</div>
          <div>
            <h1 className="dashboard__greeting">Welcome back, {user.name}!</h1>
            <p className="dashboard__email">{user.email} · <span className="owner-badge">Property Owner</span></p>
          </div>
        </div>
        <div className="dashboard__actions">
          <button className="btn btn--primary btn--sm" onClick={() => { setActiveTab('properties'); setShowAddForm(true); }}>
            + List Property
          </button>
          <button className="btn btn--ghost btn--sm" onClick={logout}>Log Out</button>
        </div>
      </div>

      {/* STATS */}
      <div className="dashboard__stats animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="dash-stat">
          <span className="dash-stat__number">{ownerListings.length}</span>
          <span className="dash-stat__label">Properties</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">{ownerListings.length > 0 ? 2 : 0}</span>
          <span className="dash-stat__label">Bookings</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">${totalEarnings.toLocaleString()}</span>
          <span className="dash-stat__label">Earnings</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">{totalViews}</span>
          <span className="dash-stat__label">Views</span>
        </div>
      </div>

      {/* TABS */}
      <div className="dashboard__tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard__tab ${activeTab === tab.id ? 'dashboard__tab--active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setShowAddForm(false); }}
            role="tab"
            aria-selected={activeTab === tab.id}
            id={`owner-tab-${tab.id}`}
          >
            {tab.label}
            {tab.count !== null && <span className="dashboard__tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="dashboard__content animate-fade-in" role="tabpanel">

        {/* ── PROPERTIES TAB ── */}
        {activeTab === 'properties' && (
          <div className="owner-properties">
            {!showAddForm && (
              <div className="owner-properties__toolbar">
                <h2 className="owner-properties__heading">Your Listed Properties</h2>
                <button className="btn btn--primary btn--md" onClick={() => setShowAddForm(true)} id="add-property-btn">
                  + Add New Property
                </button>
              </div>
            )}

            {showAddForm && (
              <div className="owner-add-form animate-fade-in">
                <div className="owner-add-form__header">
                  <h2>List a New Property</h2>
                  <button className="btn btn--ghost btn--sm" onClick={() => setShowAddForm(false)}>✕ Cancel</button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="owner-form">
                  <div className="owner-form__grid">
                    {/* Title */}
                    <div className="form-group owner-form__full">
                      <label className="form-label" htmlFor="prop-title">Property Title *</label>
                      <input
                        id="prop-title"
                        type="text"
                        className={`form-input ${formErrors.title ? 'form-input--error' : ''}`}
                        value={form.title}
                        onChange={e => updateField('title', e.target.value)}
                        placeholder="e.g. Cozy Beachfront Villa"
                      />
                      {formErrors.title && <p className="form-error">{formErrors.title}</p>}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="prop-category">Category</label>
                      <select
                        id="prop-category"
                        className="form-input"
                        value={form.category}
                        onChange={e => updateField('category', e.target.value)}
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="form-group owner-form__full">
                      <label className="form-label" htmlFor="prop-location">Location String *</label>
                      <input
                        id="prop-location"
                        type="text"
                        className={`form-input ${formErrors.location ? 'form-input--error' : ''}`}
                        value={form.location}
                        onChange={e => updateField('location', e.target.value)}
                        placeholder="e.g. Mumbai, India"
                      />
                      {formErrors.location && <p className="form-error">{formErrors.location}</p>}
                    </div>

                    {/* Map Picker */}
                    <div className="form-group owner-form__full">
                      <label className="form-label">Pinpoint Location on Map *</label>
                      <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-neutral-200)', zIndex: 1, position: 'relative' }}>
                        <MapContainer center={[form.lat, form.lng]} zoom={4} style={{ height: '100%', width: '100%' }}>
                          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                          <LocationPicker 
                            lat={form.lat} 
                            lng={form.lng} 
                            onChange={(lat, lng) => { 
                              updateField('lat', lat); 
                              updateField('lng', lng); 
                            }} 
                          />
                        </MapContainer>
                      </div>
                      <p className="form-hint">Click anywhere on the map to set your property's exact coordinates.</p>
                    </div>

                    {/* Price */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="prop-price">Price per Night ($) *</label>
                      <input
                        id="prop-price"
                        type="number"
                        min="1"
                        className={`form-input ${formErrors.price ? 'form-input--error' : ''}`}
                        value={form.price}
                        onChange={e => updateField('price', e.target.value)}
                        placeholder="e.g. 150"
                      />
                      {formErrors.price && <p className="form-error">{formErrors.price}</p>}
                    </div>

                    {/* Guests */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="prop-guests">Max Guests</label>
                      <select id="prop-guests" className="form-input" value={form.guests} onChange={e => updateField('guests', e.target.value)}>
                        {[1,2,3,4,5,6,8,10,12,16].map(n => (
                          <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="prop-bedrooms">Bedrooms</label>
                      <select id="prop-bedrooms" className="form-input" value={form.bedrooms} onChange={e => updateField('bedrooms', e.target.value)}>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="prop-bathrooms">Bathrooms</label>
                      <select id="prop-bathrooms" className="form-input" value={form.bathrooms} onChange={e => updateField('bathrooms', e.target.value)}>
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    {/* Image Upload */}
                    <div className="form-group owner-form__full">
                      <label className="form-label">Upload Images (Max 5)</label>
                      <div className="owner-form__upload-zone">
                        <input
                          type="file"
                          id="prop-images"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="owner-form__file-input"
                        />
                        <label htmlFor="prop-images" className="owner-form__upload-label">
                          <span className="upload-icon">📸</span>
                          <span>Click to browse or drag and drop</span>
                          <small>JPG, PNG, WebP up to 5MB</small>
                        </label>
                      </div>
                      
                      {form.images.length > 0 && (
                        <div className="owner-form__image-preview-grid">
                          {form.images.map((src, i) => (
                            <div key={i} className="owner-form__image-preview">
                              <img src={src} alt={`Upload preview ${i}`} />
                              <button 
                                type="button" 
                                className="owner-form__image-remove"
                                onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                              >✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="form-group owner-form__full">
                      <label className="form-label" htmlFor="prop-desc">Description *</label>
                      <textarea
                        id="prop-desc"
                        className={`form-input form-textarea ${formErrors.description ? 'form-input--error' : ''}`}
                        value={form.description}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="Describe what makes your property special..."
                        rows={4}
                      />
                      {formErrors.description && <p className="form-error">{formErrors.description}</p>}
                    </div>

                    {/* Amenities */}
                    <div className="form-group owner-form__full">
                      <label className="form-label">Amenities</label>
                      <div className="owner-amenities-grid">
                        {amenities.map(a => (
                          <button
                            key={a}
                            type="button"
                            className={`amenity-chip ${form.selectedAmenities.includes(a) ? 'amenity-chip--active' : ''}`}
                            onClick={() => toggleAmenity(a)}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="owner-form__actions">
                    <button type="button" className="btn btn--ghost btn--md" onClick={() => setShowAddForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn--primary btn--lg" id="submit-listing-btn">
                      🏠 Publish Property
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Property Cards */}
            {!showAddForm && (
              <>
                {ownerListings.length > 0 ? (
                  <div className="owner-properties__list">
                    {ownerListings.map(listing => (
                      <div key={listing.id} className="owner-prop-card animate-fade-in">
                        <img src={listing.images[0]} alt={listing.title} className="owner-prop-card__image" />
                        <div className="owner-prop-card__body">
                          <div className="owner-prop-card__info">
                            <h3 className="owner-prop-card__title">{listing.title}</h3>
                            <p className="owner-prop-card__location">📍 {listing.location}</p>
                            <div className="owner-prop-card__meta">
                              <span>${listing.price}/night</span>
                              <span>·</span>
                              <span>{listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</span>
                              <span>·</span>
                              <span>{listing.guests} guest{listing.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="owner-prop-card__actions">
                            <Link to={`/listing/${listing.id}`} className="btn btn--secondary btn--sm">View</Link>
                            <button className="btn btn--danger btn--sm" onClick={() => removeOwnerListing(listing.id)}>Remove</button>
                          </div>
                        </div>
                        <div className="owner-prop-card__stats">
                          <div className="owner-prop-card__stat">
                            <span className="owner-prop-card__stat-val">340</span>
                            <span className="owner-prop-card__stat-label">Views</span>
                          </div>
                          <div className="owner-prop-card__stat">
                            <span className="owner-prop-card__stat-val">⭐ {listing.rating || 'New'}</span>
                            <span className="owner-prop-card__stat-label">Rating</span>
                          </div>
                          <div className="owner-prop-card__stat">
                            <span className="owner-prop-card__stat-val status-badge status-badge--confirmed">Active</span>
                            <span className="owner-prop-card__stat-label">Status</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-empty-tab">
                    <div className="dashboard-empty-tab__icon">🏠</div>
                    <h3>No properties listed yet</h3>
                    <p>Start listing your property and earn from day one!</p>
                    <button className="btn btn--primary btn--md" onClick={() => setShowAddForm(true)}>
                      + List Your First Property
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {activeTab === 'availability' && (
          <div className="owner-availability animate-fade-in">
            <div className="owner-availability__grid">
              <div className="availability-card">
                <h3>Block Dates Manually</h3>
                <form className="block-form" onSubmit={handleBlockDates}>
                  <select name="listingId" className="form-input" required>
                    <option value="">Select Property</option>
                    {ownerListings.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                  </select>
                  <div className="form-row">
                    <input type="date" name="start" className="form-input" required />
                    <input type="date" name="end" className="form-input" required />
                  </div>
                  <button type="submit" className="btn btn--danger btn--md" style={{ width: '100%', marginTop: '10px' }}>
                    Block These Dates
                  </button>
                </form>
              </div>

              <div className="availability-card">
                <h3>Current Schedule</h3>
                <div className="schedule-list">
                  {bookings.filter(b => ownerListings.some(ol => ol.id === b.listingId)).map(b => (
                    <div key={b.id} className="schedule-item">
                      <div className="schedule-item__info">
                        <strong>{b.listingTitle || 'Your Property'}</strong>
                        <span>{b.checkIn} to {b.checkOut}</span>
                      </div>
                      <span className={`status-badge status-badge--${b.status}`}>{b.status}</span>
                    </div>
                  ))}
                  {bookings.filter(b => ownerListings.some(ol => ol.id === b.listingId)).length === 0 && (
                    <p className="empty-txt">No bookings or blocked dates yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS RECEIVED TAB ── */}
        {activeTab === 'bookings' && (
          <div className="dashboard-bookings">
            {ownerListings.length > 0 ? (
              <div className="dashboard-bookings__list">
                {[
                  {
                    id: 1,
                    guest: 'Amit Sharma',
                    avatar: '🙂',
                    property: ownerListings[0]?.title || 'Your Property',
                    checkIn: '2025-02-15',
                    checkOut: '2025-02-18',
                    guests: 3,
                    total: (ownerListings[0]?.price || 100) * 3,
                    status: 'confirmed',
                  },
                  {
                    id: 2,
                    guest: 'Priya Patel',
                    avatar: '😊',
                    property: ownerListings[0]?.title || 'Your Property',
                    checkIn: '2025-03-01',
                    checkOut: '2025-03-05',
                    guests: 2,
                    total: (ownerListings[0]?.price || 100) * 4,
                    status: 'confirmed',
                  },
                ].map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-item__guest-avatar">{booking.avatar}</div>
                    <div className="booking-item__info">
                      <h3 className="booking-item__title">{booking.guest}</h3>
                      <p className="booking-item__dates">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                      <p className="booking-item__meta">
                        {booking.guests} guest{booking.guests > 1 ? 's' : ''} · ${booking.total} · {booking.property}
                      </p>
                    </div>
                    <div className="booking-item__status">
                      <span className={`status-badge status-badge--${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-tab">
                <div className="dashboard-empty-tab__icon">📋</div>
                <h3>No bookings yet</h3>
                <p>Once renters book your properties, they'll appear here.</p>
                <button className="btn btn--primary btn--md" onClick={() => { setActiveTab('properties'); setShowAddForm(true); }}>
                  List a Property First
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── EARNINGS TAB ── */}
        {activeTab === 'earnings' && (
          <div className="owner-earnings animate-fade-in">
            <div className="owner-earnings__cards">
              <div className="earnings-card earnings-card--primary">
                <div className="earnings-card__icon">💰</div>
                <div>
                  <p className="earnings-card__label">Total Earnings</p>
                  <h3 className="earnings-card__value">${totalEarnings.toLocaleString()}</h3>
                </div>
              </div>
              <div className="earnings-card">
                <div className="earnings-card__icon">📅</div>
                <div>
                  <p className="earnings-card__label">This Month</p>
                  <h3 className="earnings-card__value">${Math.round(totalEarnings * 0.3).toLocaleString()}</h3>
                </div>
              </div>
              <div className="earnings-card">
                <div className="earnings-card__icon">📈</div>
                <div>
                  <p className="earnings-card__label">Avg. per Booking</p>
                  <h3 className="earnings-card__value">${ownerListings.length > 0 ? Math.round(totalEarnings / 2) : 0}</h3>
                </div>
              </div>
              <div className="earnings-card">
                <div className="earnings-card__icon">🎯</div>
                <div>
                  <p className="earnings-card__label">Occupancy Rate</p>
                  <h3 className="earnings-card__value">{ownerListings.length > 0 ? '78%' : '0%'}</h3>
                </div>
              </div>
            </div>

            <div className="earnings-chart-placeholder">
              <h3>📊 Monthly Earnings</h3>
              <div className="earnings-bars">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
                  <div key={m} className="earnings-bar-wrap">
                    <div
                      className="earnings-bar"
                      style={{ height: `${ownerListings.length > 0 ? 30 + Math.random() * 70 : 0}%` }}
                    />
                    <span className="earnings-bar-label">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="dashboard-profile">
            <div className="profile-section">
              <h3 className="profile-section__title">Host Profile</h3>
              <div className="profile-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Property Location</label>
                  <input type="text" className="form-input" placeholder="City, Country" />
                </div>
              </div>
              <button className="btn btn--primary btn--md" onClick={() => addToast('Profile updated!', 'success')} style={{ marginTop: 'var(--space-6)' }}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
