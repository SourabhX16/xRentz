import { useApp } from '../../context/AppContext';

export default function BookingCard({ 
  listing, 
  checkIn, 
  setCheckIn, 
  checkOut, 
  setCheckOut, 
  guests, 
  setGuests, 
  onReserve,
  pricing
}) {
  const { formatPrice, t } = useApp();
  const isInstant = listing.instantBook !== false; // Default to true if not specified

  return (
    <aside className="detail-sidebar" id="booking-sidebar">
      <div className="booking-card">
        <header className="booking-card__header">
          <div className="booking-card__price">
            <span className="booking-card__amount">{formatPrice(listing.price)}</span>
            <span className="booking-card__unit">/ {t('common.night')}</span>
          </div>
          <div className="booking-card__rating">
            <StarIcon />
            {listing.rating}
          </div>
        </header>

        <form className="booking-card__form" onSubmit={(e) => { e.preventDefault(); onReserve(); }}>
          <div className="booking-card__dates">
            <div className="booking-card__field">
              <label htmlFor="detail-checkin">CHECK-IN</label>
              <input 
                type="date" 
                id="detail-checkin" 
                className="form-input" 
                value={checkIn} 
                onChange={e => setCheckIn(e.target.value)} 
                required
              />
            </div>
            <div className="booking-card__field">
              <label htmlFor="detail-checkout">CHECK-OUT</label>
              <input 
                type="date" 
                id="detail-checkout" 
                className="form-input" 
                value={checkOut} 
                onChange={e => setCheckOut(e.target.value)} 
                required
              />
            </div>
          </div>
          <div className="booking-card__field">
            <label htmlFor="detail-guests">GUESTS</label>
            <select 
              id="detail-guests" 
              className="form-input" 
              value={guests} 
              onChange={e => setGuests(+e.target.value)}
            >
              {Array.from({ length: listing.guests }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={`btn ${isInstant ? 'btn--accent' : 'btn--primary'} btn--lg booking-card__cta`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{isInstant ? '⚡ ' + t('booking.instant') : t('booking.request')}</span>
          </button>
        </form>
        
        <p className="booking-card__note">You won't be charged yet</p>

        <footer className="booking-card__breakdown">
          <div className="booking-card__line">
            <span>Base rate ({formatPrice(listing.price)} × {pricing.nights} {t('common.night')}s)</span>
            <span>{formatPrice(pricing.baseTotal)}</span>
          </div>
          {pricing.weekendSur > 0 && (
            <div className="booking-card__line" style={{ color: 'var(--color-primary-600)' }}>
              <span>Weekend Peak Pricing (+15%)</span>
              <span>{formatPrice(pricing.weekendSur)}</span>
            </div>
          )}
          {pricing.seasonSur > 0 && (
            <div className="booking-card__line" style={{ color: 'var(--color-error-500)' }}>
              <span>Summer Season (+20%)</span>
              <span>{formatPrice(pricing.seasonSur)}</span>
            </div>
          )}
          <div className="booking-card__line">
            <span>Service fee (12%)</span>
            <span>{formatPrice(pricing.serviceFee)}</span>
          </div>
          <div className="booking-card__line" style={{ color: 'var(--color-neutral-500)', fontSize: '0.85em' }}>
            <span>Refundable deposit</span>
            <span>{formatPrice(250)}</span>
          </div>
          <div className="booking-card__line booking-card__line--total">
            <span>Total</span>
            <span>{formatPrice(pricing.total)}</span>
          </div>
        </footer>
      </div>
    </aside>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-neutral-900)">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
