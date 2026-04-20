import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listings as staticListings, reviews as allReviews } from '../data/listings';
import { useApp } from '../context/AppContext';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite, addToast, ownerListings } = useApp();
  const allListings = [...staticListings, ...ownerListings];
  const listing = allListings.find(l => l.id === parseInt(id)) || allListings.find(l => l.id === Number(id));
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  if (!listing) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2>Listing not found</h2>
        <Link to="/listings" className="btn btn--primary btn--md" style={{ marginTop: 24 }}>Browse Listings</Link>
      </div>
    );
  }

  const listingReviews = allReviews.filter(r => r.listingId === listing.id);
  const isFav = favorites.includes(listing.id);
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const serviceFee = Math.round(listing.price * nights * 0.12);
  const total = listing.price * nights + serviceFee;

  const handleReserve = () => {
    if (!user) {
      addToast('Please sign in to book', 'warning');
      navigate('/auth');
      return;
    }
    navigate(`/booking/${listing.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="detail-page container">
      {/* BREADCRUMB */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/listings">Listings</Link>
        <span>/</span>
        <span>{listing.title}</span>
      </nav>

      {/* TITLE BAR */}
      <div className="detail-titlebar">
        <div>
          <h1 className="detail-titlebar__title">{listing.title}</h1>
          <div className="detail-titlebar__meta">
            <span className="detail-titlebar__rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-neutral-900)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {listing.rating} · {listing.reviews} reviews
            </span>
            {listing.superhost && <span className="detail-titlebar__superhost">⭐ Superhost</span>}
            <span className="detail-titlebar__location">📍 {listing.location}</span>
          </div>
        </div>
        <div className="detail-titlebar__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'success'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Share
          </button>
          <button className={`btn btn--ghost btn--sm ${isFav ? 'detail-fav--active' : ''}`} onClick={() => toggleFavorite(listing.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? 'var(--color-error-500)' : 'none'} stroke={isFav ? 'var(--color-error-500)' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* GALLERY */}
      <div className="detail-gallery" id="gallery">
        <div className="detail-gallery__main">
          <img src={listing.images[activeImg]} alt={listing.title} className="detail-gallery__img" />
        </div>
        <div className="detail-gallery__thumbs">
          {listing.images.map((img, i) => (
            <button
              key={i}
              className={`detail-gallery__thumb ${i === activeImg ? 'detail-gallery__thumb--active' : ''}`}
              onClick={() => setActiveImg(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`${listing.title} ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="detail-content">
        <div className="detail-content__main">
          {/* HOST */}
          <div className="detail-host">
            <div className="detail-host__avatar">{listing.host.avatar}</div>
            <div>
              <h3 className="detail-host__name">Hosted by {listing.host.name}</h3>
              <p className="detail-host__meta">Joined in {listing.host.joined} · {listing.host.responseRate} response rate</p>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="detail-highlights">
            <div className="detail-highlight">
              <span className="detail-highlight__icon">🏠</span>
              <div>
                <strong>{listing.guests} guests</strong>
                <span> · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</span>
              </div>
            </div>
            {listing.superhost && (
              <div className="detail-highlight">
                <span className="detail-highlight__icon">⭐</span>
                <div>
                  <strong>Superhost</strong>
                  <span> · {listing.host.name} is a highly rated host</span>
                </div>
              </div>
            )}
            <div className="detail-highlight">
              <span className="detail-highlight__icon">📍</span>
              <div>
                <strong>Great location</strong>
                <span> · 95% of guests gave 5-star ratings for location</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="detail-section">
            <h2 className="detail-section__title">About this place</h2>
            <p className="detail-section__text">{listing.description}</p>
          </div>

          {/* AMENITIES */}
          <div className="detail-section">
            <h2 className="detail-section__title">Amenities</h2>
            <div className="detail-amenities">
              {listing.amenities.map(a => (
                <div key={a} className="detail-amenity">
                  <span className="detail-amenity__icon">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS */}
          <div className="detail-section">
            <h2 className="detail-section__title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-neutral-900)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {listing.rating} · {listing.reviews} reviews
            </h2>
            <div className="detail-reviews">
              {listingReviews.length > 0 ? listingReviews.map(r => (
                <div key={r.id} className="detail-review">
                  <div className="detail-review__header">
                    <span className="detail-review__avatar">{r.avatar}</span>
                    <div>
                      <strong className="detail-review__user">{r.user}</strong>
                      <p className="detail-review__date">{r.date}</p>
                    </div>
                  </div>
                  <p className="detail-review__text">{r.text}</p>
                </div>
              )) : (
                <p className="detail-review__empty">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* BOOKING SIDEBAR */}
        <aside className="detail-sidebar" id="booking-sidebar">
          <div className="booking-card">
            <div className="booking-card__header">
              <div className="booking-card__price">
                <span className="booking-card__amount">${listing.price}</span>
                <span className="booking-card__unit">/ night</span>
              </div>
              <div className="booking-card__rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-neutral-900)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {listing.rating}
              </div>
            </div>

            <div className="booking-card__form">
              <div className="booking-card__dates">
                <div className="booking-card__field">
                  <label htmlFor="detail-checkin">CHECK-IN</label>
                  <input type="date" id="detail-checkin" className="form-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="booking-card__field">
                  <label htmlFor="detail-checkout">CHECK-OUT</label>
                  <input type="date" id="detail-checkout" className="form-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
              </div>
              <div className="booking-card__field">
                <label htmlFor="detail-guests">GUESTS</label>
                <select id="detail-guests" className="form-input" value={guests} onChange={e => setGuests(+e.target.value)}>
                  {Array.from({ length: listing.guests }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn--accent btn--lg booking-card__cta" onClick={handleReserve} id="reserve-btn">
              Reserve Now
            </button>
            <p className="booking-card__note">You won't be charged yet</p>

            <div className="booking-card__breakdown">
              <div className="booking-card__line">
                <span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>${listing.price * nights}</span>
              </div>
              <div className="booking-card__line">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="booking-card__line booking-card__line--total">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
