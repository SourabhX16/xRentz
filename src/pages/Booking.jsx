import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { listings as staticListings } from '../data/listings';
import { useApp } from '../context/AppContext';
import AtmosphereEffect from '../components/AtmosphereEffect';
import './Booking.css';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addBooking, addToast, ownerListings, hasMembership, getMemberDiscount, membershipData, formatPrice, t, region } = useApp();
  const [promoApplied, setPromoApplied] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const DAMAGE_DEPOSIT = 250;
  
  const TIERS_MAP = { silver: '🥈', gold: '🥇', platinum: '💎' };

  const allListings = [...staticListings, ...ownerListings];
  const listing = allListings.find(l => l.id === parseInt(id)) || allListings.find(l => l.id === Number(id));

  const getAtmosphere = () => {
    if (!listing) return 'sunny';
    const cat = listing.category.toLowerCase();
    const loc = listing.location.toLowerCase();
    const title = listing.title.toLowerCase();
    
    // SNOW: Mountains, Cabins, High altitude
    if (cat === 'cabin' || loc.includes('aspen') || loc.includes('manali') || loc.includes('colorado') || title.includes('snow') || title.includes('mountain')) return 'snow';
    
    // BEACH: Villas, Coastal areas, Island vibes
    if (cat === 'villa' || loc.includes('malibu') || loc.includes('goa') || loc.includes('miami') || loc.includes('beach') || loc.includes('kerala') || title.includes('beach') || title.includes('ocean') || title.includes('sea')) return 'beach';
    
    // RAIN: Monsoon regions or Rainy cities
    if (loc.includes('portland') || loc.includes('mumbai') || loc.includes('kerala') || loc.includes('monsoon')) return 'rain';

    // CITY / NIGHT: Penthouses, Manhattan, Lofts
    if (cat === 'penthouse' || cat === 'loft' || loc.includes('manhattan') || loc.includes('chicago') || loc.includes('bengaluru') || loc.includes('high-rise')) return 'city';
    
    return 'sunny';
  };

  const atmosphere = getAtmosphere();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
    // Payment specific
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    accountNumber: '',
    routingNumber: '',
    digitalId: '',
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

  const calculatePricing = () => {
    if (!checkIn || !checkOut || !listing) return { subtotal: 0, serviceFee: 0, total: 0, nights: 0, baseTotal: 0, weekendSur: 0, seasonSur: 0, cleaningFee: 0 };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / 86400000);
    const nights = Math.max(1, diff);

    let baseTotal = 0;
    let weekendSur = 0;
    let seasonSur = 0;

    for (let i = 0; i < nights; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const day = d.getDay();
      const month = d.getMonth();
      baseTotal += listing.price;
      if (day === 0 || day === 5 || day === 6) weekendSur += (listing.price * 0.15);
      if (month >= 5 && month <= 7) seasonSur += (listing.price * 0.20);
    }
    const subtotal = Math.round(baseTotal + weekendSur + seasonSur);
    const serviceFee = Math.round(subtotal * 0.12);
    return { subtotal, serviceFee, nights, baseTotal, weekendSur, seasonSur, cleaningFee: 50, hasWeekendSurcharge: weekendSur > 0, hasSeasonalSurcharge: seasonSur > 0 };
  };

  const pricing = calculatePricing();
  const subtotal = pricing.subtotal;
  const serviceFee = pricing.serviceFee;
  
  const memberDiscount = getMemberDiscount(subtotal + serviceFee);
  const discountData = promoApplied ? memberDiscount : { discount: 0, tierName: '', percent: 0 };
  
  // New pricing components
  const insuranceCost = hasInsurance ? 15 : 0;
  const total = subtotal + serviceFee + insuranceCost + DAMAGE_DEPOSIT - discountData.discount;
  
  const isInstant = listing?.instantBook !== false;

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
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
        if (!formData.cvc.trim()) newErrors.cvc = 'CVC is required';
      } else if (formData.paymentMethod === 'bank') {
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!formData.routingNumber.trim()) newErrors.routingNumber = 'Routing number is required';
      } else if (formData.paymentMethod === 'digital') {
        if (!formData.digitalId.trim()) newErrors.digitalId = 'Digital ID (Email/Phone) is required';
      }
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
    const success = addBooking({
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      checkIn,
      checkOut,
      guests,
      total,
      guestName: `${formData.firstName} ${formData.lastName}`,
      instantBook: listing.instantBook
    });
    if (success) setStep(4);
  };

  return (
    <div className="booking-page container">
      <AtmosphereEffect type={atmosphere} />
      <div className="booking-page__back">
        <Link to={`/listing/${listing.id}`} className="btn btn--ghost btn--sm">← Back to listing</Link>
      </div>

      {/* PROGRESS */}
      <div className="booking-progress" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="4">
        {['Guest Details', 'Payment', 'Review', isInstant ? 'Confirmed' : 'Requested'].map((label, i) => (
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
              
              <div className="trust-safety-opt-in" style={{ background: 'var(--color-primary-50)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid var(--color-primary-200)' }}>
                <input 
                  type="checkbox" 
                  id="insurance-opt" 
                  checked={hasInsurance} 
                  onChange={(e) => setHasInsurance(e.target.checked)} 
                  style={{ marginTop: '4px', transform: 'scale(1.2)', accentColor: 'var(--color-primary-600)' }} 
                />
                <div>
                  <label htmlFor="insurance-opt" style={{ fontWeight: 'bold', display: 'block', color: 'var(--color-primary-900)' }}>
                    Add xRentz Stay Insurance (+$15)
                  </label>
                  <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--color-primary-700)' }}>
                    Comprehensive protection including unexpected cancellations, medical emergencies, and trip interruptions.
                  </p>
                </div>
              </div>

              <div className="payment-methods">
                <button 
                  className={`payment-method ${formData.paymentMethod === 'card' ? 'payment-method--active' : ''}`}
                  onClick={() => updateField('paymentMethod', 'card')}
                >💳 {region === 'IN' ? 'Debit/Credit Card' : 'Stripe Card'}</button>
                <button 
                  className={`payment-method ${formData.paymentMethod === 'bank' ? 'payment-method--active' : ''}`}
                  onClick={() => updateField('paymentMethod', 'bank')}
                >🏦 {region === 'IN' ? 'Net Banking' : 'Bank Transfer'}</button>
                <button 
                  className={`payment-method ${formData.paymentMethod === 'digital' ? 'payment-method--active' : ''}`}
                  onClick={() => updateField('paymentMethod', 'digital')}
                >📱 {region === 'IN' ? 'Razorpay' : 'Apple/Google Pay'}</button>
              </div>
              
              <div className="booking-form-grid booking-form-grid--payment">
                {formData.paymentMethod === 'card' && (
                  <>
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
                  </>
                )}

                {formData.paymentMethod === 'bank' && (
                  <>
                    <div className="form-group form-group--full">
                      <label htmlFor="b-acc" className="form-label">Account Number <span className="form-required">*</span></label>
                      <input id="b-acc" type="text" className={`form-input ${errors.accountNumber ? 'form-input--error' : ''}`} value={formData.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} placeholder="000123456789" />
                      {errors.accountNumber && <p className="form-error">{errors.accountNumber}</p>}
                    </div>
                    <div className="form-group form-group--full">
                      <label htmlFor="b-route" className="form-label">Routing Number <span className="form-required">*</span></label>
                      <input id="b-route" type="text" className={`form-input ${errors.routingNumber ? 'form-input--error' : ''}`} value={formData.routingNumber} onChange={e => updateField('routingNumber', e.target.value)} placeholder="123456789" />
                      {errors.routingNumber && <p className="form-error">{errors.routingNumber}</p>}
                    </div>
                  </>
                )}

                {formData.paymentMethod === 'digital' && (
                  <div className="form-group form-group--full">
                    <label htmlFor="b-digital" className="form-label">Email / Wallet ID <span className="form-required">*</span></label>
                    <input id="b-digital" type="text" className={`form-input ${errors.digitalId ? 'form-input--error' : ''}`} value={formData.digitalId} onChange={e => updateField('digitalId', e.target.value)} placeholder="user@paypal or apple-pay-id" />
                    {errors.digitalId && <p className="form-error">{errors.digitalId}</p>}
                  </div>
                )}
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
                  <p>{guests} Guest{guests > 1 ? 's' : ''} · {pricing.nights} Night{pricing.nights > 1 ? 's' : ''}</p>
                </div>
                <div className="review-summary__section">
                  <h3>Payment</h3>
                  <p>
                    {formData.paymentMethod === 'card' && `Card ending in ${formData.cardNumber.slice(-4) || '****'}`}
                    {formData.paymentMethod === 'bank' && `Bank Transfer (Acc: ${formData.accountNumber.slice(-4) || '****'})`}
                    {formData.paymentMethod === 'digital' && `Digital Wallet: ${formData.digitalId}`}
                  </p>
                  <p className="review-summary__total">Total: <strong>{formatPrice(total)}</strong></p>
                </div>
              </div>
              <div className="booking-step__actions">
                <button className="btn btn--ghost btn--md" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn--accent btn--lg" onClick={handleConfirm} id="confirm-booking-btn">
                  {isInstant ? `Confirm & Pay ${formatPrice(total)}` : `Request to Book ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-step booking-confirmed animate-scale-in" id="step-confirmed">
              <div className="booking-confirmed__icon">{isInstant ? '🎉' : '⏳'}</div>
              <h2 className="booking-confirmed__title">{isInstant ? 'Booking Confirmed!' : 'Booking Requested!'}</h2>
              <p className="booking-confirmed__text">
                {isInstant ? (
                  <>You're all set! Your reservation at <strong>{listing.title}</strong> has been confirmed. A confirmation email has been sent to <strong>{formData.email}</strong>.</>
                ) : (
                  <>Your request to book <strong>{listing.title}</strong> has been sent to the host. You won't be charged until they approve. You will notified at <strong>{formData.email}</strong>.</>
                )}
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
                  <strong>{formatPrice(total)}</strong>
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
                <div className="booking-summary__price-row">
                  <div className="booking-summary__price-label">
                    <span>{formatPrice(listing.price)} × {pricing.nights} {t('common.night')}s</span>
                    {pricing.hasWeekendSurcharge && <small className="pricing-tag pricing-tag--weekend">+15% Weekend Peak</small>}
                    {pricing.hasSeasonalSurcharge && <small className="pricing-tag pricing-tag--seasonal">+20% Summer Spike</small>}
                  </div>
                  <span>{formatPrice(pricing.baseTotal)}</span>
                </div>
                
                <div className="booking-summary__price-row">
                  <span>Cleaning Fee</span>
                  <span>{formatPrice(pricing.cleaningFee)}</span>
                </div>
                <div className="booking-summary__price-row">
                  <span>Service Fee (12%)</span>
                  <span>{formatPrice(pricing.serviceFee)}</span>
                </div>
                <div className="booking-summary__price-row">
                  <span>Damage Deposit (Refundable)</span>
                  <span>{formatPrice(250)}</span>
                </div>
                {hasInsurance && (
                  <div className="booking-summary__price-row booking-summary__price-row--insurance">
                    <span>Stay Insurance (Shield Plus)</span>
                    <span>{formatPrice(15)}</span>
                  </div>
                )}
                
                {hasMembership && membershipData && (
                  <div className={`booking-summary__vip-box ${promoApplied ? 'active' : ''}`} onClick={() => setPromoApplied(!promoApplied)}>
                    <div className="vip-box-header">
                      <span>{TIERS_MAP[membershipData.tier] || '💎'} {membershipData.tierName} Card</span>
                      <div className={`vip-toggle ${promoApplied ? 'on' : ''}`}></div>
                    </div>
                    {promoApplied ? (
                      <p className="vip-discount-notice">-{membershipData.discount}% Discount Applied! ✨</p>
                    ) : (
                      <p className="vip-discount-notice">Tap to apply VIP discount</p>
                    )}
                  </div>
                )}
                
                {discountData.discount > 0 && (
                  <div className="booking-summary__price-row booking-summary__price-row--discount">
                    <span>{discountData.tierName} Member Discount ({discountData.percent}%)</span>
                    <span>-{formatPrice(discountData.discount)}</span>
                  </div>
                )}

                <hr className="booking-summary__divider" />
                <div className="booking-summary__price-row booking-summary__price-row--total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
