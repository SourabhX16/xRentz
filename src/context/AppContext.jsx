import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('bookings')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [ownerListings, setOwnerListings] = useState(() => JSON.parse(localStorage.getItem('ownerListings')) || []);
  const [toasts, setToasts] = useState([]);
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

  const toggleFavorite = useCallback((listingId) => {
    setFavorites(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now(), status: 'confirmed' }]);
    addToast('Booking confirmed! 🎉', 'success');
  }, [addToast]);

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

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user, login, logout,
      bookings, addBooking,
      favorites, toggleFavorite,
      toasts, addToast,
      searchFilters, setSearchFilters,
      ownerListings, addOwnerListing, removeOwnerListing, updateOwnerListing,
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
