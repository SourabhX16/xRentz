import './TripPlanner.css';

export default function TripPlanner({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="trip-planner-overlay animate-fade-in" onClick={onClose}>
      <div className="trip-planner animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div className="trip-planner__header">
          <button className="trip-planner__close" onClick={onClose}>×</button>
          <h2 className="trip-planner__title">Your Trip Planner</h2>
          <p className="trip-planner__subtitle">📍 {booking.listingTitle} · {booking.checkIn} to {booking.checkOut}</p>
        </div>

        {/* BODY */}
        <div className="trip-planner__body">
          
          {/* STEP 1: DOCUMENTS */}
          <section className="planner-section" data-step="1">
            <h3 className="planner-section__title">📁 Required Documents</h3>
            <div className="planner-grid">
              <div className="planner-card">
                <p className="planner-card__label">Identification</p>
                <p className="planner-card__value">Original Passport or National ID</p>
              </div>
              <div className="planner-card">
                <p className="planner-card__label">Verification Status</p>
                <p className="planner-card__value" style={{ color: 'var(--color-success-600)' }}>✓ Verified by xRentz</p>
              </div>
              <div className="planner-card" style={{ gridColumn: 'span 2' }}>
                <p className="planner-card__label">Booking ID</p>
                <p className="planner-card__value">#{booking.id.toString().toUpperCase()}-XR-2024</p>
              </div>
            </div>
          </section>

          {/* STEP 2: ARRIVAL */}
          <section className="planner-section" data-step="2">
            <h3 className="planner-section__title">🔑 Arrival & Check-in</h3>
            <div className="planner-grid">
              <div className="planner-card">
                <p className="planner-card__label">Check-in Time</p>
                <p className="planner-card__value">3:00 PM (Local Time)</p>
              </div>
              <div className="planner-card">
                <p className="planner-card__label">Entry Method</p>
                <p className="planner-card__value">Smart Lock Code: <strong>8829#</strong></p>
              </div>
              <div className="planner-card" style={{ gridColumn: 'span 2' }}>
                <p className="planner-card__label">WiFi Details</p>
                <p className="planner-card__value">SSID: xRentz_Guest_Secure | Pass: stayhappy2024</p>
              </div>
            </div>
          </section>

          {/* STEP 3: FOOD & BEVERAGES */}
          <section className="planner-section" data-step="3">
            <h3 className="planner-section__title">☕ Food & Local Vibes</h3>
            <p className="detail-section__text" style={{ marginBottom: '12px' }}>Curated recommendations based on your location:</p>
            <div className="planner-grid">
              <div className="planner-card">
                <p className="planner-card__label">Breakfast</p>
                <ul className="planner-list">
                  <li className="planner-list-item">The Local Bean (200m)</li>
                  <li className="planner-list-item">Artisan Bakery (5 min walk)</li>
                </ul>
              </div>
              <div className="planner-card">
                <p className="planner-card__label">Dinner / Bars</p>
                <ul className="planner-list">
                  <li className="planner-list-item">Skyline Rooftop Bistro</li>
                  <li className="planner-list-item">The Secret Garden Tapas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* STEP 4: DEPARTURE */}
          <section className="planner-section" data-step="4">
            <h3 className="planner-section__title">👋 Departure Process</h3>
            <div className="planner-card">
              <p className="planner-card__label">Check-out Instructions</p>
              <ul className="planner-list">
                <li className="planner-list-item">Check-out by 11:00 AM</li>
                <li className="planner-list-item">Turn off AC and Kitchen appliances</li>
                <li className="planner-list-item">Drop digital key in the lockbox or app</li>
              </ul>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="trip-planner__footer">
          <p style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
            This planner was auto-generated for your visit by xRentz Guru AI.
          </p>
          <a href="#" className="planner-download" onClick={(e) => e.preventDefault()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Save as PDF
          </a>
        </div>
      </div>
    </div>
  );
}
