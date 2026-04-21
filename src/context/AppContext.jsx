import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, currencies } from '../translations/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('bookings')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [ownerListings, setOwnerListings] = useState(() => JSON.parse(localStorage.getItem('ownerListings')) || []);
  const [memberships, setMemberships] = useState(() => JSON.parse(localStorage.getItem('memberships')) || {});
  const [userReviews, setUserReviews] = useState(() => JSON.parse(localStorage.getItem('userReviews')) || []);
  const [toasts, setToasts] = useState([]);
  
  // 🌐 i18n & Currency State
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'en');
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('currency') || 'USD');
  const [region, setRegion] = useState('US');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    category: 'all',
    priceMin: 0,
    priceMax: 1000,
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ownerListings', JSON.stringify(ownerListings));
  }, [ownerListings]);

  useEffect(() => {
    localStorage.setItem('memberships', JSON.stringify(memberships));
  }, [memberships]);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
  }, [userReviews]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Auto-detect user settings
  useEffect(() => {
    if (!localStorage.getItem('language')) {
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) setLanguageState(browserLang);
    }
    
    // Mock Geo-detection (Real app would use IP API)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone.includes('Asia/Kolkata') || timeZone.includes('Calcutta')) {
      setRegion('IN');
      if (!localStorage.getItem('currency')) setCurrencyState('INR');
      if (!localStorage.getItem('language')) setLanguageState('hi');
    } else if (timeZone.includes('Europe')) {
      setRegion('EU');
      if (!localStorage.getItem('currency')) setCurrencyState('EUR');
    }
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    if (userData.role === 'owner') {
      addToast('Welcome back, Host! 🏠', 'success');
    } else {
      addToast('Welcome back! 🎉', 'success');
    }
  }, [addToast]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const logout = useCallback(() => {
    setUser(null);
    addToast('Logged out successfully', 'info');
  }, [addToast]);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) setLanguageState(lang);
  }, []);

  const setCurrency = useCallback((curr) => {
    if (currencies[curr]) setCurrencyState(curr);
  }, []);

  // 🛠️ Translation Helper
  const t = useCallback((path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (!result[key]) return path; // Return key if not found
      result = result[key];
    }
    return result;
  }, [language]);

  // 💰 Currency Formatter
  const formatPrice = useCallback((usdPrice) => {
    const config = currencies[currency];
    const converted = Math.round(usdPrice * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  }, [currency]);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const toggleFavorite = useCallback((listingId) => {
    setFavorites(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  }, []);

  const checkAvailability = useCallback((listingId, start, end) => {
    if (!start || !end) return true;
    const s = new Date(start);
    const e = new Date(end);
    
    return !bookings.some(b => {
      if (b.listingId !== listingId) return false;
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      return (s < bEnd && e > bStart);
    });
  }, [bookings]);

  const addBooking = useCallback((booking) => {
    if (!checkAvailability(booking.listingId, booking.checkIn, booking.checkOut)) {
      addToast('Sorry, these dates were just booked!', 'error');
      return false;
    }
    const isInstant = booking.instantBook !== false; // defaults to true
    const newStatus = isInstant ? 'confirmed' : 'pending';

    setBookings(prev => [...prev, { ...booking, id: Date.now(), status: newStatus }]);
    addToast(isInstant ? 'Booking confirmed! 🎉' : 'Booking requested! The host has 24h to approve.', 'success');
    return true;
  }, [addToast, checkAvailability]);

  const addOwnerListing = useCallback((listing) => {
    const newListing = {
      ...listing,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      superhost: false,
      ownerCreated: true,
      host: user ? {
        name: user.name,
        avatar: user.avatar || '👤',
        joined: new Date().getFullYear().toString(),
        responseRate: '100%',
      } : { name: 'Host', avatar: '👤', joined: '2025', responseRate: '100%' },
    };
    setOwnerListings(prev => [...prev, newListing]);
    addToast('Property listed successfully! 🎉', 'success');
    return newListing;
  }, [user, addToast]);

  const removeOwnerListing = useCallback((listingId) => {
    setOwnerListings(prev => prev.filter(l => l.id !== listingId));
    addToast('Property removed', 'info');
  }, [addToast]);

  const updateOwnerListing = useCallback((listingId, updates) => {
    setOwnerListings(prev => prev.map(l => l.id === listingId ? { ...l, ...updates } : l));
    addToast('Property updated! ✅', 'success');
  }, [addToast]);

  const addReview = useCallback((review) => {
    setUserReviews(prev => [...prev, { ...review, id: `rev-${Date.now()}`, date: new Date().toLocaleDateString(), replies: [] }]);
    addToast('Review submitted successfully! ⭐', 'success');
  }, [addToast]);

  const addReviewReply = useCallback((reviewId, replyText) => {
    setUserReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, replies: [...(r.replies || []), { text: replyText, date: new Date().toLocaleDateString() }] } : r
    ));
    addToast('Reply posted!', 'success');
  }, [addToast]);

  // ═══ TIERED MEMBERSHIP SYSTEM ═══
  const MEMBERSHIP_TIERS = {
    silver: { name: 'Silver', price: 49, discount: 5, color: '#94a3b8', icon: '🥈', freeCancellation: false, earlyAccess: false, referralBonus: 3 },
    gold:   { name: 'Gold',   price: 99, discount: 10, color: '#fbbf24', icon: '🥇', freeCancellation: false, earlyAccess: true, referralBonus: 5 },
    platinum: { name: 'Platinum', price: 199, discount: 15, color: '#e2e8f0', icon: '💎', freeCancellation: true, earlyAccess: true, referralBonus: 7 },
  };

  const buyMembership = useCallback((tier = 'gold') => {
    const userId = user ? user.email : 'guest';
    const tierConfig = MEMBERSHIP_TIERS[tier] || MEMBERSHIP_TIERS.gold;
    const cardId = `XRZ-${tier.toUpperCase().charAt(0)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const referralCode = `REF-${user?.name?.replace(/\s/g, '').substring(0, 4).toUpperCase() || 'XRNZ'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMembership = {
      isMember: true,
      tier,
      tierName: tierConfig.name,
      discount: tierConfig.discount,
      freeCancellation: tierConfig.freeCancellation,
      earlyAccess: tierConfig.earlyAccess,
      referralBonus: tierConfig.referralBonus,
      referralCode,
      referrals: 0,
      referralEarnings: 0,
      cardId,
      expiry: expiry.toLocaleDateString(),
      joinedDate: new Date().toLocaleDateString(),
    };

    setMemberships(prev => ({ ...prev, [userId]: newMembership }));
    addToast(`${tierConfig.icon} ${tierConfig.name} Membership Activated! ${tierConfig.discount}% discount unlocked!`, 'success');
    return newMembership;
  }, [user, addToast]);

  const upgradeMembership = useCallback((newTier) => {
    const userId = user ? user.email : 'guest';
    const existing = memberships[userId];
    if (!existing) return buyMembership(newTier);
    const tierConfig = MEMBERSHIP_TIERS[newTier];
    if (!tierConfig) return;

    const updated = {
      ...existing,
      tier: newTier,
      tierName: tierConfig.name,
      discount: tierConfig.discount,
      freeCancellation: tierConfig.freeCancellation,
      earlyAccess: tierConfig.earlyAccess,
      referralBonus: tierConfig.referralBonus,
    };
    setMemberships(prev => ({ ...prev, [userId]: updated }));
    addToast(`${tierConfig.icon} Upgraded to ${tierConfig.name}! Now ${tierConfig.discount}% discount!`, 'success');
  }, [user, memberships, buyMembership, addToast]);

  const getMemberDiscount = useCallback((basePrice) => {
    const userId = user ? user.email : 'guest';
    const membership = memberships[userId];
    if (!membership?.isMember) return { discount: 0, discountedPrice: basePrice, tier: null };
    const discountAmount = Math.round(basePrice * membership.discount / 100);
    return {
      discount: discountAmount,
      discountedPrice: basePrice - discountAmount,
      tier: membership.tier,
      tierName: membership.tierName,
      percent: membership.discount,
    };
  }, [user, memberships]);

  const hasMembership = memberships[user ? user.email : 'guest']?.isMember || false;
  const membershipData = memberships[user ? user.email : 'guest'] || null;
  const membershipTier = membershipData?.tier || null;

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user,
      login,
      logout,
      updateUser,
      bookings, addBooking,
      favorites, toggleFavorite,
      toasts, addToast,
      searchFilters, setSearchFilters,
      ownerListings, addOwnerListing, removeOwnerListing, updateOwnerListing,
      hasMembership, buyMembership, membershipData, upgradeMembership, getMemberDiscount, membershipTier,
      checkAvailability,
      userReviews, addReview, addReviewReply,
      // i18n
      language, setLanguage, currency, setCurrency, region, t, formatPrice, currenciesList: currencies
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
