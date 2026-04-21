import { Link } from 'react-router-dom';

export default function BookingList({ bookings }) {
  if (bookings.length === 0) {
    return (
      <div className="dashboard-empty-tab">
        <div className="dashboard-empty-tab__icon">📋</div>
        <h3>No bookings yet</h3>
        <p>Your upcoming trips will appear here once you make a reservation.</p>
        <Link to="/listings" className="btn btn--primary btn--md">Explore Listings</Link>
      </div>
    );
  }

  return (
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
  );
}
