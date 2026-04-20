import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './MembershipWidget.css';

export default function MembershipWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('offer'); // offer, payment, card
  const { hasMembership, buyMembership, membershipData, user } = useApp();

  const handleBuy = (e) => {
    e.preventDefault();
    buyMembership();
    setStep('card');
  };

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasMembership) setStep('card');
    else if (!isOpen) setStep('offer');
  };

  return (
    <div className={`membership-widget ${hasMembership ? 'membership-widget--active' : ''}`}>
      {isOpen && (
        <div className="membership-modal">
          <div className="membership-modal__header">
            <div className="membership-modal__overlay" />
            {hasMembership && <div className="membership-card-badge">VIP ELITE</div>}
          </div>
          
          <div className="membership-modal__body">
            {step === 'offer' && (
              <div className="animate-fade-in">
                <h2 className="membership-modal__title">Become an Insider</h2>
                <p className="membership-modal__text">Unlock the global elite travel experience with our signature membership card.</p>
                <div className="membership-modal__benefits">
                  <div className="benefit"><i>🔥</i> 10% Discount on All Stays</div>
                  <div className="benefit"><i>✨</i> Priority Check-in</div>
                  <div className="benefit"><i>💎</i> Gold Badge on Profile</div>
                </div>
                <button className="membership-modal__btn" onClick={() => setStep('payment')}>
                  Join Now — $99/year
                </button>
              </div>
            )}

            {step === 'payment' && (
              <form className="animate-fade-in" onSubmit={handleBuy}>
                <h2 className="membership-modal__title" style={{ fontSize: '1.2rem' }}>Membership Checkout</h2>
                <div className="membership-form">
                  <input type="text" placeholder="Card Number" className="membership-input" required />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="MM/YY" className="membership-input" required />
                    <input type="text" placeholder="CVC" className="membership-input" required />
                  </div>
                </div>
                <button type="submit" className="membership-modal__btn">
                  Confirm Payment
                </button>
                <button type="button" className="btn-link" onClick={() => setStep('offer')}>Back</button>
              </form>
            )}

            {step === 'card' && hasMembership && (
              <div className="animate-scale-in">
                <div className="vip-virtual-card">
                  <div className="card-top">
                    <span>xRentz Insider</span>
                    <span>{membershipData.cardId}</span>
                  </div>
                  <div className="card-middle">
                    <span className="chip"></span>
                  </div>
                  <div className="card-bottom">
                    <div className="card-user">
                      <span className="label">CARD HOLDER</span>
                      <span className="val">{user?.name || 'GUEST USER'}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">EXPIRES</span>
                      <span className="val">{membershipData.expiry}</span>
                    </div>
                  </div>
                </div>
                <h3 className="success-txt">VIP Activated Successfully!</h3>
                <button className="membership-modal__btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => setIsOpen(false)}>
                  Close Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="membership-widget__btn" onClick={toggle}>
        <span className="membership-widget__btn-icon">
          {hasMembership ? '💎' : '🏰'}
        </span>
        {!hasMembership && <div className="membership-widget__badge">VIP</div>}
      </button>
    </div>
  );
}
