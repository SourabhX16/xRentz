import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { listings as staticListings, reviews as allReviews } from '../data/listings';

/**
 * Custom hook for managing the state and logic of a single listing
 */
export function useListing() {
  const { id } = useParams();
  const { user, favorites, toggleFavorite, addToast, ownerListings } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const listing = useMemo(() => {
    const allListings = [...staticListings, ...ownerListings];
    return allListings.find(l => l.id === parseInt(id)) || allListings.find(l => l.id === Number(id));
  }, [id, ownerListings]);

  const listingReviews = useMemo(() => 
    allReviews.filter(r => r.listingId === listing?.id),
  [listing]);

  const isFav = favorites.includes(listing?.id);

  // Price calculations
  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / 86400000);
    return Math.max(1, diff);
  };

  const nights = getNights();
  const serviceFee = listing ? Math.round(listing.price * nights * 0.12) : 0;
  const total = listing ? (listing.price * nights + serviceFee) : 0;

  return {
    listing,
    listingReviews,
    activeImg,
    setActiveImg,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    isFav,
    toggleFavorite,
    nights,
    serviceFee,
    total,
    user,
    addToast
  };
}
