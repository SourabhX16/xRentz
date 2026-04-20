import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './ListingCard.css';

export default function ListingCard({ listing, index = 0 }) {
  const { favorites, toggleFavorite } = useApp();
  const [imgIndex, setImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isFav = favorites.includes(listing.id);

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgLoaded(false);
    setImgIndex(prev => (prev + 1) % listing.images.length);
  };

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgLoaded(false);
    setImgIndex(prev => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="listing-card animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      id={`listing-card-${listing.id}`}
      aria-label={`${listing.title}, ${listing.location}, $${listing.price} per night`}
    >
      <div className="listing-card__image-wrap">
        {!imgLoaded && <div className="listing-card__skeleton skeleton" />}
        <img
          src={listing.images[imgIndex]}
          alt={listing.title}
          className={`listing-card__image ${imgLoaded ? 'listing-card__image--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Image navigation */}
        {listing.images.length > 1 && (
          <>
            <button className="listing-card__img-nav listing-card__img-nav--prev" onClick={prevImg} aria-label="Previous image">
              ‹
            </button>
            <button className="listing-card__img-nav listing-card__img-nav--next" onClick={nextImg} aria-label="Next image">
              ›
            </button>
            <div className="listing-card__dots">
              {listing.images.map((_, i) => (
                <span key={i} className={`listing-card__dot ${i === imgIndex ? 'listing-card__dot--active' : ''}`} />
              ))}
            </div>
          </>
        )}

        {/* Favorite button */}
        <button
          className={`listing-card__fav ${isFav ? 'listing-card__fav--active' : ''}`}
          onClick={handleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? '#F04438' : 'none'} stroke={isFav ? '#F04438' : '#fff'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Superhost badge */}
        {listing.superhost && (
          <div className="listing-card__badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Superhost
          </div>
        )}
      </div>

      <div className="listing-card__body">
        <div className="listing-card__header">
          <h3 className="listing-card__title">{listing.title}</h3>
          <div className="listing-card__rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-neutral-900)">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>{listing.rating}</span>
          </div>
        </div>
        <p className="listing-card__location">{listing.location}</p>
        <p className="listing-card__meta">{listing.guests} guests · {listing.bedrooms} bed · {listing.bathrooms} bath</p>
        <div className="listing-card__footer">
          <p className="listing-card__price">
            <span className="listing-card__price-amount">${listing.price}</span>
            <span className="listing-card__price-unit"> / night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
