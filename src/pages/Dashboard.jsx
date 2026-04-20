import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { listings } from '../data/listings';
import './Dashboard.css';

export default function Dashboard() {
  const { user, bookings, favorites, logout, addToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  if (!user) {
    return (
      <div className="dashboard-empty container animate-fade-in">
        <div className="dashboard-empty__icon">🔐</div>
        <h2>Please sign in</h2>
        <p>You need to be logged in to access your dashboard.</p>
        <Link to="/auth" className="btn btn--primary btn--lg">Sign In</Link>
      </div>
    );
  }

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  const tabs = [
    { id: 'bookings', label: '📋 Bookings', count: bookings.length },
    { id: 'favorites', label: '❤️ Favorites', count: favoriteListings.length },
    { id: 'messages', label: '💬 Messages', count: 3 },
    { id: 'profile', label: '👤 Profile', count: null },
  ];

  return (
    <div className="dashboard container">
      {/* HEADER */}
      <div className="dashboard__header animate-fade-in">
        <div className="dashboard__user">
          <div className="dashboard__avatar">{user.avatar}</div>
          <div>
            <h1 className="dashboard__greeting">Welcome back, {user.name}!</h1>
            <p className="dashboard__email">{user.email}</p>
          </div>
        </div>
        <div className="dashboard__actions">
          <Link to="/listings" className="btn btn--secondary btn--sm">Browse Listings</Link>
          <button className="btn btn--ghost btn--sm" onClick={logout}>Log Out</button>
        </div>
      </div>

      {/* STATS */}
      <div className="dashboard__stats animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="dash-stat">
          <span className="dash-stat__number">{bookings.length}</span>
          <span className="dash-stat__label">Bookings</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">{favoriteListings.length}</span>
          <span className="dash-stat__label">Favorites</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">3</span>
          <span className="dash-stat__label">Messages</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat__number">4.9</span>
          <span className="dash-stat__label">Rating</span>
        </div>
      </div>

      {/* TABS */}
      <div className="dashboard__tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard__tab ${activeTab === tab.id ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            id={`tab-${tab.id}`}
          >
            {tab.label}
            {tab.count !== null && <span className="dashboard__tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="dashboard__content animate-fade-in" role="tabpanel">
        {activeTab === 'bookings' && (
          <div className="dashboard-bookings">
            {bookings.length > 0 ? (
              <div className="dashboard-bookings__list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <img src={booking.listingImage} alt={booking.listingTitle} className="booking-item__image" />
                    <div className="booking-item__info">
                      <h3 className="booking-item__title">{booking.listingTitle}</h3>
                      <p className="booking-item__dates">
                        {booking.checkIn || 'Flexible'} → {booking.checkOut || 'Flexible'}
                      </p>
                      <p className="booking-item__meta">
                        {booking.guests} guest{booking.guests > 1 ? 's' : ''} · ${booking.total}
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
                <p>Your upcoming trips will appear here once you make a reservation.</p>
                <Link to="/listings" className="btn btn--primary btn--md">Explore Listings</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="dashboard-favorites">
            {favoriteListings.length > 0 ? (
              <div className="dashboard-favorites__grid">
                {favoriteListings.map(listing => (
                  <Link key={listing.id} to={`/listing/${listing.id}`} className="fav-item">
                    <img src={listing.images[0]} alt={listing.title} className="fav-item__image" />
                    <div className="fav-item__info">
                      <h3>{listing.title}</h3>
                      <p>{listing.location}</p>
                      <p className="fav-item__price">${listing.price}/night</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-tab">
                <div className="dashboard-empty-tab__icon">❤️</div>
                <h3>No favorites yet</h3>
                <p>Save listings you love and they'll show up here.</p>
                <Link to="/listings" className="btn btn--primary btn--md">Browse Listings</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="dashboard-messages">
            {[
              { from: 'Sarah Chen', avatar: '👩‍💼', message: 'Your booking is confirmed! Let me know if you need anything.', time: '2 hours ago', unread: true },
              { from: 'Marcus Rivera', avatar: '👨‍🎨', message: 'Thanks for your interest! The villa is available for those dates.', time: '1 day ago', unread: true },
              { from: 'xRentz Support', avatar: '🛡️', message: 'Welcome to xRentz! Check out our guide for new users.', time: '3 days ago', unread: false },
            ].map((msg, i) => (
              <div key={i} className={`message-item ${msg.unread ? 'message-item--unread' : ''}`}>
                <div className="message-item__avatar">{msg.avatar}</div>
                <div className="message-item__content">
                  <div className="message-item__header">
                    <strong>{msg.from}</strong>
                    <span className="message-item__time">{msg.time}</span>
                  </div>
                  <p className="message-item__text">{msg.message}</p>
                </div>
                {msg.unread && <div className="message-item__dot" />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-profile">
            <div className="profile-section">
              <h3 className="profile-section__title">Personal Info</h3>
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
                  <input type="tel" className="form-input" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
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
