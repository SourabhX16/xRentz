import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { listings } from '../data/listings';
import { useApp } from '../context/AppContext';
import './Booking.css';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addBooking, addToast } = useApp();
  const listing = listings.find(l => l.id === parseInt(id));

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests')) || 1;

  if (!listing) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2>Listing not found</h2>
        <Link to="/listings" className="btn btn--primary btn--md" style={{ marginTop: 24 }}>Browse Listings</Link>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
      if (!formData.cvc.trim()) newErrors.cvc = 'CVC is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) setStep(step + 1);
    }
  };

  const handleConfirm = () => {
    addBooking({
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      checkIn,
      checkOut,
      guests,
      total,
      guestName: `${formData.firstName} ${formData.lastName}`,
    });
    setStep(4);
  };

  return (
    <div className="booking-page container">
      <div className="booking-page__back">
        <Link to={`/listing/${listing.id}`} className="btn btn--ghost btn--sm">← Back to listing</Link>
      </div>

      {/* PROGRESS */}
      <div className="booking-progress" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="4">
        {['Guest Details', 'Payment', 'Review', 'Confirmed'].map((label, i) => (
          <div key={label} className={`booking-progress__step ${step > i ? 'booking-progress__step--done' : ''} ${step === i + 1 ? 'booking-progress__step--active' : ''}`}>
            <div className="booking-progress__dot">
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className="booking-progress__label">{label}</span>
          </div>
        ))}
        <div className="booking-progress__line">
          <div className="booking-progress__fill" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>
      </div>

      <div className="booking-layout">
        {/* FORM AREA */}
        <div className="booking-form-area">
          {step === 1 && (
            <div className="booking-step animate-fade-in" id="step-guest-details">
              <h2 className="booking-step__title">Guest Details</h2>
              <p className="booking-step__desc">Tell us who's checking in</p>
              <div className="booking-form-grid">
                <div className="form-group">
                  <label htmlFor="b-firstName" className="form-label">First Name <span className="form-required">*</span></label>
                  <input id="b-firstName" type="text" className={`form-input ${errors.firstName ? 'form-input--error' : ''}`} value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="John" />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="b-lastName" className="form-label">Last Name <span className="form-required">*</span></label>
                  <input id="b-lastName" type="text" className={`form-input ${errors.lastName ? 'form-input--error' : ''}`} value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Doe" />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="b-email" className="form-label">Email <span className="form-required">*</span></label>
                  <input id="b-email" type="email" className={`form-input ${errors.email ? 'form-input--error' : ''}`} value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="john@example.com" />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="b-phone" className="form-label">Phone <span className="form-required">*</span></label>
                  <input id="b-phone" type="tel" className={`form-input ${errors.phone ? 'form-input--error' : ''}`} value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                <label htmlFor="b-requests" className="form-label">Special Requests (optional)</label>
                <textarea id="b-requests" className="form-input form-textarea" rows="3" value={formData.specialRequests} onChange={e => updateField('specialRequests', e.target.value)} placeholder="Any special needs or requests..." />
              </div>
              <div className="booking-step__actions">
                <button className="btn btn--primary btn--lg" onClick={handleNext}>Continue to Payment →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step animate-fade-in" id="step-payment">
              <h2 className="booking-step__title">Payment</h2>
              <p className="booking-step__desc">Enter your payment details securely</p>
              <div className="payment-methods">
                <button className="payment-method payment-method--active">💳 Credit Card</button>
                <button className="payment-method">🏦 Bank Transfer</button>
                <button className="payment-method">📱 Digital Wallet</button>
              </div>
              <div className="booking-form-grid booking-form-grid--payment">
                <div className="form-group form-group--full">
                  <label htmlFor="b-card" className="form-label">Card Number <span className="form-required">*</span></label>
                  <input id="b-card" type="text" className={`form-input ${errors.cardNumber ? 'form-input--error' : ''}`} value={formData.cardNumber} onChange={e => updateField('cardNumber', e.target.value)} placeholder="4242 4242 4242 4242" maxLength="19" />
                  {errors.cardNumber && <p className="form-error">{errors.cardNumber}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="b-expiry" className="form-label">Expiry <span className="form-required">*</span></label>
                  <input id="b-expiry" type="text" className={`form-input ${errors.expiry ? 'form-input--error' : ''}`} value={formData.expiry} onChange={e => updateField('expiry', e.target.value)} placeholder="MM/YY" maxLength="5" />
                  {errors.expiry && <p className="form-error">{errors.expiry}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="b-cvc" className="form-label">CVC <span className="form-required">*</span></label>
                  <input id="b-cvc" type="text" className={`form-input ${errors.cvc ? 'form-input--error' : ''}`} value={formData.cvc} onChange={e => updateField('cvc', e.target.value)} placeholder="123" maxLength="4" />
                  {errors.cvc && <p className="form-error">{errors.cvc}</p>}
                </div>
              </div>
              <div className="payment-secure">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-500)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Your payment info is encrypted and secure
              </div>
              <div className="booking-step__actions">
                <button className="btn btn--ghost btn--md" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn--primary btn--lg" onClick={handleNext}>Review Booking →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step animate-fade-in" id="step-review">
              <h2 className="booking-step__title">Review Your Booking</h2>
              <p className="booking-step__desc">Make sure everything looks good before confirming</p>
              <div className="review-summary">
                <div className="review-summary__section">
                  <h3>Guest Information</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                </div>
                <div className="review-summary__section">
                  <h3>Stay Details</h3>
                  <p>Check-in: {checkIn || 'Flexible'}</p>
                  <p>Check-out: {checkOut || 'Flexible'}</p>
                  <p>{guests} Guest{guests > 1 ? 's' : ''} · {nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
                <div className="review-summary__section">
                  <h3>Payment</h3>
                  <p>Card ending in {formData.cardNumber.slice(-4) || '****'}</p>
                  <p className="review-summary__total">Total: <strong>${total}</strong></p>
                </div>
              </div>
              <div className="booking-step__actions">
                <button className="btn btn--ghost btn--md" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn--accent btn--lg" onClick={handleConfirm} id="confirm-booking-btn">Confirm & Pay ${total}</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-step booking-confirmed animate-scale-in" id="step-confirmed">
              <div className="booking-confirmed__icon">🎉</div>
              <h2 className="booking-confirmed__title">Booking Confirmed!</h2>
              <p className="booking-confirmed__text">
                You're all set! Your reservation at <strong>{listing.title}</strong> has been confirmed.
                A confirmation email has been sent to <strong>{formData.email}</strong>.
              </p>
              <div className="booking-confirmed__details">
                <div className="booking-confirmed__detail">
                  <span>Confirmation #</span>
                  <strong>XR-{Date.now().toString().slice(-8)}</strong>
                </div>
                <div className="booking-confirmed__detail">
                  <span>Check-in</span>
                  <strong>{checkIn || 'Flexible'}</strong>
                </div>
                <div className="booking-confirmed__detail">
                  <span>Check-out</span>
                  <strong>{checkOut || 'Flexible'}</strong>
                </div>
                <div className="booking-confirmed__detail">
                  <span>Total Paid</span>
                  <strong>${total}</strong>
                </div>
              </div>
              <div className="booking-step__actions" style={{ justifyContent: 'center' }}>
                <Link to="/dashboard" className="btn btn--primary btn--lg">View My Bookings</Link>
                <Link to="/" className="btn btn--ghost btn--md">Back to Home</Link>
              </div>
            </div>
          )}
        </div>

        {/* BOOKING SUMMARY SIDEBAR */}
        {step < 4 && (
          <aside className="booking-summary" id="booking-summary">
            <div className="booking-summary__card">
              <div className="booking-summary__listing">
                <img src={listing.images[0]} alt={listing.title} className="booking-summary__image" />
                <div>
                  <h3 className="booking-summary__title">{listing.title}</h3>
                  <p className="booking-summary__location">{listing.location}</p>
                  <div className="booking-summary__rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-neutral-900)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {listing.rating} ({listing.reviews})
                  </div>
                </div>
              </div>
              <div className="booking-summary__divider" />
              <div className="booking-summary__breakdown">
                <div className="booking-summary__line">
                  <span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="booking-summary__line">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="booking-summary__line booking-summary__line--total">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
