import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { listings as staticListings } from '../data/listings';

/**
 * Custom hook to manage Dashboard business logic
 * Separates data processing from UI rendering
 */
export function useDashboard() {
  const { user, bookings, favorites, logout, addToast, ownerListings } = useApp();
  const [activeTab, setActiveTab] = useState('bookings');

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
