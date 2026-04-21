import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ReviewModal from './ReviewModal';
import TripPlanner from './TripPlanner';

export default function BookingList({ bookings }) {
  const { userReviews } = useApp();
  const [reviewBooking, setReviewBooking] = useState(null);
  const [plannerBooking, setPlannerBooking] = useState(null);

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

  // Helper to check if a review exists for this booking ID
  const hasReviewed = (bookingId) => {
    return userReviews.some(r => r.bookingId === bookingId);
  };

  return (
    <div className="dashboard-bookings__list">
      {bookings.map(booking => {
        const reviewed = hasReviewed(booking.id);
        
        return (
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
            <div className="booking-item__status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span className={`status-badge status-badge--${booking.status}`}>
                {booking.status}
              </span>
              {booking.status === 'confirmed' && !reviewed && (
                <button 
                  className="btn btn--secondary btn--sm" 
                  onClick={() => setReviewBooking(booking)}
                  style={{ fontSize: '11px', padding: '4px 12px' }}
                >
                  Write Review
                </button>
              )}
              {booking.status === 'confirmed' && (
                <button 
                  className="booking-item__planner-btn" 
                  onClick={() => setPlannerBooking(booking)}
                >
                  🚀 Plan My Visit
                </button>
              )}
              {reviewed && (
                <span className="status-badge status-badge--success" style={{ background: 'transparent', border: '1px solid var(--color-success-500)', color: 'var(--color-success-500)' }}>
                  ⭐ Reviewed
                </span>
              )}
            </div>
          </div>
        );
      })}

      {reviewBooking && (
        <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />
      )}

      {plannerBooking && (
        <TripPlanner booking={plannerBooking} onClose={() => setPlannerBooking(null)} />
      )}
    </div>
  );
}
