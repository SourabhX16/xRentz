import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import { listings as staticListings, categories, popularDestinations } from '../data/listings';
import { useApp } from '../context/AppContext';
import './Home.css';

export default function Home() {
  const { ownerListings } = useApp();
  const allListings = [...staticListings, ...ownerListings];
  const featured = allListings.filter(l => l.superhost).slice(0, 4);
  const trending = allListings.slice(0, 8);
  const newlyListed = ownerListings.slice(-4);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" id="hero-section">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&q=80"
            alt="Beautiful rental property"
            className="hero__bg-image"
          />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content container">
          <h1 className="hero__title animate-fade-in-up">
            Your next stay,<br />
            <span className="hero__title-accent">effortlessly found.</span>
          </h1>
          <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Discover curated rentals with trusted hosts — from city apartments to mountain cabins.
          </p>
          <div className="hero__search animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <SearchBar variant="hero" />
          </div>
          <div className="hero__stats animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="hero__stat">
              <span className="hero__stat-number">12,000+</span>
              <span className="hero__stat-label">Properties</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">8,500+</span>
              <span className="hero__stat-label">Happy Guests</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">4.9</span>
              <span className="hero__stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container" id="categories-section">
        <div className="section__header">
          <h2 className="section__title">Browse by Category</h2>
          <p className="section__subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="categories-scroll">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/listings?category=${cat.id}`}
              className="category-chip"
              id={`category-${cat.id}`}
            >
              <span className="category-chip__icon">{cat.icon}</span>
              <span className="category-chip__label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section container" id="featured-section">
        <div className="section__header">
          <div>
            <h2 className="section__title">Featured Stays</h2>
            <p className="section__subtitle">Handpicked by our community of travelers</p>
          </div>
          <Link to="/listings" className="btn btn--secondary btn--sm">View All →</Link>
        </div>
        <div className="listing-grid stagger">
          {featured.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section container" id="destinations-section">
        <div className="section__header">
          <div>
            <h2 className="section__title">Popular Destinations</h2>
            <p className="section__subtitle">Explore trending locations loved by travelers</p>
          </div>
        </div>
        <div className="destinations-grid stagger">
          {popularDestinations.map((dest, i) => (
            <Link
              key={dest.name}
              to={`/listings?location=${dest.name}`}
              className="destination-card animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img src={dest.image} alt={dest.name} className="destination-card__image" loading="lazy" />
              <div className="destination-card__overlay" />
              <div className="destination-card__content">
                <h3 className="destination-card__name">{dest.name}</h3>
                <p className="destination-card__count">{dest.count.toLocaleString()} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="section container" id="trending-section">
        <div className="section__header">
          <div>
            <h2 className="section__title">Trending Near You</h2>
            <p className="section__subtitle">Places guests are loving right now</p>
          </div>
          <Link to="/listings" className="btn btn--secondary btn--sm">See More →</Link>
        </div>
        <div className="listing-grid listing-grid--full stagger">
          {trending.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* NEWLY LISTED (owner created) */}
      {newlyListed.length > 0 && (
        <section className="section container" id="newly-listed-section">
          <div className="section__header">
            <div>
              <h2 className="section__title">🆕 Newly Listed</h2>
              <p className="section__subtitle">Fresh properties just added by hosts</p>
            </div>
            <Link to="/listings" className="btn btn--secondary btn--sm">View All →</Link>
          </div>
          <div className="listing-grid stagger">
            {newlyListed.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="cta-banner container" id="cta-section">
        <div className="cta-banner__inner">
          <div className="cta-banner__content">
            <h2 className="cta-banner__title">Become a Host on xRentz</h2>
            <p className="cta-banner__text">
              Turn your space into income. List for free and start earning from day one.
            </p>
            <Link to="/auth?mode=signup&role=owner" className="btn btn--accent btn--lg">
              Start Hosting Today
            </Link>
          </div>
          <div className="cta-banner__graphic">
            <div className="cta-banner__circles">
              <div className="cta-banner__circle cta-banner__circle--1" />
              <div className="cta-banner__circle cta-banner__circle--2" />
              <div className="cta-banner__circle cta-banner__circle--3" />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section container trust-section" id="trust-section">
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-card__icon">🛡️</div>
            <h3 className="trust-card__title">Verified Hosts</h3>
            <p className="trust-card__text">Every host is verified through our rigorous review process for your safety.</p>
          </div>
          <div className="trust-card">
            <div className="trust-card__icon">💳</div>
            <h3 className="trust-card__title">Secure Payments</h3>
            <p className="trust-card__text">Your payments are protected with enterprise-grade encryption.</p>
          </div>
          <div className="trust-card">
            <div className="trust-card__icon">📞</div>
            <h3 className="trust-card__title">24/7 Support</h3>
            <p className="trust-card__text">Our team is always available to help with any issue, day or night.</p>
          </div>
          <div className="trust-card">
            <div className="trust-card__icon">✨</div>
            <h3 className="trust-card__title">Best Price Guarantee</h3>
            <p className="trust-card__text">Find a lower price? We'll match it and give you 10% off on top.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
