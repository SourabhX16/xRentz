export default function BookingCard({ 
  listing, 
  checkIn, 
  setCheckIn, 
  checkOut, 
  setCheckOut, 
  guests, 
  setGuests, 
  onReserve,
  nights,
  serviceFee,
  total
}) {
  return (
    <aside className="detail-sidebar" id="booking-sidebar">
      <div className="booking-card">
        <header className="booking-card__header">
          <div className="booking-card__price">
            <span className="booking-card__amount">${listing.price}</span>
            <span className="booking-card__unit">/ night</span>
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
          <button type="submit" className="btn btn--accent btn--lg booking-card__cta">
            Reserve Now
          </button>
        </form>
        
        <p className="booking-card__note">You won't be charged yet</p>

        <footer className="booking-card__breakdown">
          <div className="booking-card__line">
            <span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>${listing.price * nights}</span>
          </div>
          <div className="booking-card__line">
            <span>Service fee (12%)</span>
            <span>${serviceFee}</span>
          </div>
          <div className="booking-card__line booking-card__line--total">
            <span>Total</span>
            <span>${total}</span>
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
