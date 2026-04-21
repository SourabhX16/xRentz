import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './MembershipWidget.css';

const TIERS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 49,
    icon: '🥈',
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
    perks: ['5% Discount on all stays', 'Priority support', '3% referral bonus'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 99,
    icon: '🥇',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    popular: true,
    perks: ['10% Discount on all stays', '24hr early access to new listings', 'Gold profile badge', '5% referral bonus'],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 199,
    icon: '💎',
    color: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    perks: ['15% Discount on all stays', 'Free cancellation', '24hr early access', 'Platinum badge', '7% referral bonus', 'Physical card shipped'],
  },
];

export default function MembershipWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('tiers'); // tiers, payment, card
  const [selectedTier, setSelectedTier] = useState('gold');
  const { hasMembership, buyMembership, upgradeMembership, membershipData, user } = useApp();

  const handleSelectTier = (tierId) => {
    setSelectedTier(tierId);
    setStep('payment');
  };

  const handleBuy = (e) => {
    e.preventDefault();
    if (hasMembership) {
      upgradeMembership(selectedTier);
    } else {
      buyMembership(selectedTier);
    }
    setStep('card');
  };

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasMembership) setStep('card');
    else if (!isOpen) setStep('tiers');
  };

  const selectedTierConfig = TIERS.find(t => t.id === selectedTier);

  return (
    <div className={`membership-widget ${hasMembership ? 'membership-widget--active' : ''}`}>
      {isOpen && (
        <div className="membership-modal">
          <div className="membership-modal__header">
            <div className="membership-modal__overlay" />
            {hasMembership && <div className="membership-card-badge">{membershipData?.tierName?.toUpperCase()} MEMBER</div>}
          </div>
          
          <div className="membership-modal__body">
            {/* TIER SELECTION */}
            {step === 'tiers' && (
              <div className="animate-fade-in">
                <h2 className="membership-modal__title">Choose Your Tier</h2>
                <p className="membership-modal__text">Unlock exclusive perks and save on every stay.</p>
                
                <div className="tier-cards">
                  {TIERS.map(tier => (
                    <div
                      key={tier.id}
                      className={`tier-card ${selectedTier === tier.id ? 'tier-card--selected' : ''} ${tier.popular ? 'tier-card--popular' : ''}`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      {tier.popular && <span className="tier-card__popular">MOST POPULAR</span>}
                      <div className="tier-card__icon">{tier.icon}</div>
                      <h3 className="tier-card__name">{tier.name}</h3>
                      <p className="tier-card__price">
                        <span className="tier-card__amount">${tier.price}</span>/year
                      </p>
                      <ul className="tier-card__perks">
                        {tier.perks.map((p, i) => (
                          <li key={i}>✓ {p}</li>
                        ))}
                      </ul>
                      <button
                        className="tier-card__btn"
                        style={{ background: tier.gradient }}
                        onClick={(e) => { e.stopPropagation(); handleSelectTier(tier.id); }}
                      >
                        {hasMembership ? 'Upgrade' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENT */}
            {step === 'payment' && (
              <form className="animate-fade-in" onSubmit={handleBuy}>
                <h2 className="membership-modal__title" style={{ fontSize: '1.2rem' }}>
                  {selectedTierConfig?.icon} {selectedTierConfig?.name} — ${selectedTierConfig?.price}/year
                </h2>
                <div className="membership-form">
                  <input type="text" placeholder="Card Number" className="membership-input" required />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="MM/YY" className="membership-input" required />
                    <input type="text" placeholder="CVC" className="membership-input" required />
                  </div>
                </div>
                <button type="submit" className="membership-modal__btn" style={{ background: selectedTierConfig?.gradient }}>
                  Confirm — ${selectedTierConfig?.price}
                </button>
                <button type="button" className="btn-link" onClick={() => setStep('tiers')}>← Back to tiers</button>
              </form>
            )}

            {/* ACTIVE CARD */}
            {step === 'card' && hasMembership && (
              <div className="animate-scale-in">
                <div className={`vip-virtual-card vip-virtual-card--${membershipData.tier}`}>
                  <div className="card-top">
                    <span>xRentz {membershipData.tierName}</span>
                    <span>{membershipData.cardId}</span>
                  </div>
                  <div className="card-middle">
                    <span className="chip" />
                    <span className="card-tier-icon">{TIERS.find(t => t.id === membershipData.tier)?.icon || '💎'}</span>
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

                {/* Perks Summary */}
                <div className="member-perks-summary">
                  <div className="member-perk">
                    <span className="member-perk__icon">🏷️</span>
                    <span>{membershipData.discount}% off every stay</span>
                  </div>
                  {membershipData.freeCancellation && (
                    <div className="member-perk">
                      <span className="member-perk__icon">🆓</span>
                      <span>Free cancellation</span>
                    </div>
                  )}
                  {membershipData.earlyAccess && (
                    <div className="member-perk">
                      <span className="member-perk__icon">⏰</span>
                      <span>24hr early access</span>
                    </div>
                  )}
                </div>

                {/* Referral Section */}
                <div className="member-referral">
                  <h4 className="member-referral__title">Your Referral Code</h4>
                  <div className="member-referral__code">{membershipData.referralCode}</div>
                  <p className="member-referral__text">
                    Share & earn {membershipData.referralBonus}% commission on bookings from hosts you refer!
                  </p>
                </div>

                <div className="member-card-actions">
                  <button className="membership-modal__btn membership-modal__btn--upgrade" onClick={() => setStep('tiers')}>
                    ⬆️ Upgrade Tier
                  </button>
                  <button className="membership-modal__btn membership-modal__btn--close" onClick={() => setIsOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="membership-widget__btn" onClick={toggle}>
        <span className="membership-widget__btn-icon">
          {hasMembership ? (TIERS.find(t => t.id === membershipData?.tier)?.icon || '💎') : '🏰'}
        </span>
        {!hasMembership && <div className="membership-widget__badge">VIP</div>}
      </button>
    </div>
  );
}
