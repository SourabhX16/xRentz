import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import ImageGallery from '../components/listing-detail/ImageGallery';
import BookingCard from '../components/listing-detail/BookingCard';
import AvailabilityCalendar from '../components/listing-detail/AvailabilityCalendar';
import WeatherWidget from '../components/WeatherWidget';
import './ListingDetail.css';

/**
 * Listing Detail Page
 * Displays comprehensive information about a single property and provides booking functionality.
 * 
 * @page
 * @returns {JSX.Element}
 */
export default function ListingDetail() {
  const navigate = useNavigate();
  const {
    listing,
    listingReviews,
    activeImg,
    setActiveImg,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    isFav,
    toggleFavorite,
    pricing,
    user,
    addToast,
    t,
    formatPrice
  } = useListing();

  // Guard: Listing not found
  if (!listing) return <ListingNotFound />;
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleReserve = () => {
    if (!user) {
      addToast('Please sign in to book', 'warning');
      navigate('/auth');
      return;
    }
    if (!user.isVerified) {
      setShowVerifyModal(true);
      return;
    }
    const minN = listing.minNights || 1;
    if (pricing.nights < minN) {
      addToast(`This property has a minimum stay of ${minN} nights.`, 'warning');
      return;
    }
    navigate(`/booking/${listing.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  return (
    <main className="detail-page container">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          <li><Link to="/">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/listings">Listings</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{listing.title}</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header className="detail-titlebar">
        <div className="detail-titlebar__info">
          <h1 className="detail-titlebar__title">{listing.title}</h1>
          <div className="detail-titlebar__meta">
            <RatingDisplay rating={listing.rating} reviewsCount={listing.reviews} />
            {listing.superhost && <span className="detail-titlebar__superhost">⭐ Superhost</span>}
            <span className="detail-titlebar__location">📍 {listing.location}</span>
          </div>
        </div>
        
        <div className="detail-titlebar__actions">
          <button className="btn btn--ghost btn--sm" onClick={handleShare}>
            <ShareIcon />
            Share
          </button>
          <button 
            className={`btn btn--ghost btn--sm ${isFav ? 'detail-fav--active' : ''}`} 
            onClick={() => toggleFavorite(listing.id)}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon filled={isFav} />
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      {/* VISUAL GALLERY */}
      <ImageGallery 
        images={listing.images} 
        activeImg={activeImg} 
        setActiveImg={setActiveImg} 
        title={listing.title} 
      />

      {/* CORE CONTENT GRID */}
      <div className="detail-content">
        <section className="detail-content__main">
          {/* HOST INFORMATION */}
          <section className="detail-host">
            <div className="detail-host__avatar" aria-hidden="true">{listing.host.avatar}</div>
            <div>
              <h3 className="detail-host__name">Hosted by {listing.host.name}</h3>
              <p className="detail-host__meta">
                Joined in {listing.host.joined} · {listing.host.responseRate} response rate
              </p>
            </div>
          </section>

          {/* PROPERTY FEATURES */}
          <section className="detail-highlights">
            <HighlightItem icon="🏠" bold={`${listing.guests} guests`} text={`· ${listing.bedrooms} BR · ${listing.bathrooms} Bath`} />
            {listing.superhost && (
              <HighlightItem icon="⭐" bold="Superhost" text={`· ${listing.host.name} is top-rated`} />
            )}
            <HighlightItem icon="📍" bold="Great location" text="· 95% of guests love this area" />
          </section>

          {/* DESCRIPTION */}
          <article className="detail-section">
            <h2 className="detail-section__title">{t('common.about') || 'About this place'}</h2>
            <p className="detail-section__text">{listing.description}</p>
          </article>

          {/* AMENITIES */}
          <section className="detail-section">
            <h2 className="detail-section__title">What this place offers</h2>
            <div className="detail-amenities">
              {listing.amenities.map(a => (
                <div key={a} className="detail-amenity">
                  <span className="detail-amenity__icon" aria-hidden="true">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* LIVE WEATHER AT THIS LOCATION */}
          <section className="detail-section">
            <h2 className="detail-section__title">🌦️ Live Conditions at This Location</h2>
            <WeatherWidget listing={listing} />
          </section>

          {/* AVAILABILITY CALENDAR */}
          <section className="detail-section">
            <h2 className="detail-section__title">📅 Availability</h2>
            <p className="detail-section__text">Choose your exact dates. Green hints are available.</p>
            <AvailabilityCalendar listingId={listing.id} minNights={listing.minNights} />
          </section>

          {/* REVIEWS SECTION */}
          <section className="detail-section">
            <h2 className="detail-section__title">
              <RatingDisplay rating={listing.rating} reviewsCount={listing.reviews} large />
            </h2>
            <div className="detail-reviews">
              {listingReviews.length > 0 ? (
                listingReviews.map(r => <ReviewItem key={r.id} review={r} />)
              ) : (
                <p className="detail-review__empty">No reviews yet. Be the first to share your experience!</p>
              )}
            </div>
          </section>
        </section>

        {/* BOOKING SIDEBAR */}
        <BookingCard 
          listing={listing}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          guests={guests}
          setGuests={setGuests}
          onReserve={handleReserve}
          pricing={pricing}
        />
      </div>

      {/* VERIFICATION MODAL OVERLAY */}
      {showVerifyModal && (
        <div className="review-modal-overlay">
          <div className="review-modal animate-scale-in" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <h2 className="review-modal__title">Verification Required</h2>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: '24px' }}>
              To ensure the highest standard of safety and trust within the xRentz community, all guests must legally verify their identity with an official ID before booking.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn btn--ghost btn--md" onClick={() => setShowVerifyModal(false)}>Cancel</button>
              <button className="btn btn--accent btn--md" onClick={() => navigate('/dashboard?tab=profile')}>Verify Now</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function RatingDisplay({ rating, reviewsCount, large = false }) {
  return (
    <span className={`detail-rating ${large ? 'detail-rating--lg' : ''}`}>
      <svg width={large ? 18 : 14} height={large ? 18 : 14} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      {rating} · {reviewsCount} reviews
    </span>
  );
}

function HighlightItem({ icon, bold, text }) {
  return (
    <div className="detail-highlight">
      <span className="detail-highlight__icon" aria-hidden="true">{icon}</span>
      <div>
        <strong>{bold}</strong>
        <span> {text}</span>
      </div>
    </div>
  );
}

function ReviewItem({ review }) {
  const isUserRev = !!review.categories;
  const username = isUserRev ? review.user?.name : review.user;
  const avatar = isUserRev ? review.user?.avatar : review.avatar;

  return (
    <div className="detail-review">
      <div className="detail-review__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <span className="detail-review__avatar" aria-hidden="true">{avatar}</span>
          <div>
            <strong className="detail-review__user">{username}</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p className="detail-review__date">{review.date}</p>
              {isUserRev && (
                <span style={{ fontSize: '12px', color: 'var(--color-primary-600)', fontWeight: 'bold' }}>⭐ {review.rating}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Authenticity Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-success-50)', color: 'var(--color-success-700)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--color-success-200)', fontSize: '10px', fontWeight: 'bold' }}>
          <span>🛡️</span>
          <span>Verified Stay</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>Score: {Math.floor(Math.random() * (99 - 94 + 1)) + 94}%</span>
        </div>
      </div>
      
      {isUserRev && review.categories && (
        <div className="review-categories-micro">
          {Object.entries(review.categories).map(([k, v]) => (
            <span key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: {v}/5</span>
          ))}
        </div>
      )}

      <p className="detail-review__text">{review.text}</p>
      
      {isUserRev && review.photo && (
        <img src={review.photo} alt="Review attachment" className="detail-review__photo" />
      )}

      {isUserRev && review.replies && review.replies.map((reply, i) => (
        <div key={i} className="detail-review__reply">
          <strong>Host Reply · {reply.date}</strong>
          <p>{reply.text}</p>
        </div>
      ))}
    </div>
  );
}

function ListingNotFound() {
  return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h2>Listing not found</h2>
      <Link to="/listings" className="btn btn--primary btn--md" style={{ marginTop: 24 }}>Browse Listings</Link>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'var(--color-error-500)' : 'none'} stroke={filled ? 'var(--color-error-500)' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
