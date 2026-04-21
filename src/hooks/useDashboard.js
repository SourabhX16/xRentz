import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { listings as staticListings } from '../data/listings';

/**
 * Custom hook to manage Dashboard business logic
 * Separates data processing from UI rendering
 */
export function useDashboard() {
  const { user, bookings, favorites, logout, addToast, ownerListings } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('bookings');

  // Parse URL to jump straight to a tab (like profile)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const allListings = useMemo(() => 
    [...staticListings, ...ownerListings], 
  [ownerListings]);

  const favoriteListings = useMemo(() => 
    allListings.filter(l => favorites.includes(l.id)),
  [allListings, favorites]);

  const tabs = useMemo(() => [
    { id: 'bookings', label: '📋 Bookings', count: bookings.length },
    { id: 'favorites', label: '❤️ Favorites', count: favoriteListings.length },
    { id: 'messages', label: '💬 Messages', count: 3 },
    { id: 'profile', label: '👤 Profile', count: null },
  ], [bookings.length, favoriteListings.length]);

  return {
    user,
    bookings,
    favoriteListings,
    tabs,
    activeTab,
    setActiveTab,
    logout,
    addToast
  };
}
