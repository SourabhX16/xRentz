import { Link, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import ImageGallery from '../components/listing-detail/ImageGallery';
import BookingCard from '../components/listing-detail/BookingCard';
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
    nights,
    serviceFee,
    total,
    user,
    addToast
  } = useListing();

  // Guard: Listing not found
  if (!listing) return <ListingNotFound />;

  const handleReserve = () => {
    if (!user) {
      addToast('Please sign in to book', 'warning');
      navigate('/auth');
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
            <h2 className="detail-section__title">About this place</h2>
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
          nights={nights}
          serviceFee={serviceFee}
          total={total}
        />
      </div>
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
  return (
    <div className="detail-review">
      <div className="detail-review__header">
        <span className="detail-review__avatar" aria-hidden="true">{review.avatar}</span>
        <div>
          <strong className="detail-review__user">{review.user}</strong>
          <p className="detail-review__date">{review.date}</p>
        </div>
      </div>
      <p className="detail-review__text">{review.text}</p>
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
