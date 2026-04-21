import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { listings as staticListings, reviews as allReviews } from '../data/listings';

/**
 * Custom hook for managing the state and logic of a single listing
 */
export function useListing() {
  const { id } = useParams();
  const { user, favorites, toggleFavorite, addToast, ownerListings, userReviews, t, formatPrice, currency, setCurrency } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const listing = useMemo(() => {
    const allListings = [...staticListings, ...ownerListings];
    return allListings.find(l => l.id === parseInt(id)) || allListings.find(l => l.id === Number(id));
  }, [id, ownerListings]);

  const listingReviews = useMemo(() => {
    // Combine static reviews with user-generated reviews for this listing
    const staticRev = allReviews.filter(r => r.listingId === listing?.id);
    const userRev = userReviews.filter(r => r.listingId === listing?.id);
    return [...staticRev, ...userRev];
  }, [listing, userReviews]);

  const isFav = favorites.includes(listing?.id);

  // Price calculations
  const calculatePricing = () => {
    if (!listing) return { nights: 1, baseTotal: 0, weekendSur: 0, seasonSur: 0, subtotal: 0, serviceFee: 0, total: 0 };
    if (!checkIn || !checkOut) {
      const sub = listing.price;
      const fee = Math.round(sub * 0.12);
      return { nights: 1, baseTotal: sub, weekendSur: 0, seasonSur: 0, subtotal: sub, serviceFee: fee, total: sub + fee };
    }

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
      const day = d.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
      const month = d.getMonth(); // 5 = Jun, 6 = Jul, 7 = Aug

      let nightlyRate = listing.price;
      baseTotal += nightlyRate;

      // Weekend pricing (+15%)
      if (day === 0 || day === 5 || day === 6) {
        weekendSur += (nightlyRate * 0.15);
      }

      // Seasonal pricing (Summer Jun-Aug) (+20%)
      if (month >= 5 && month <= 7) {
        seasonSur += (nightlyRate * 0.20);
      }
    }

    const subtotal = Math.round(baseTotal + weekendSur + seasonSur);
    const serviceFee = Math.round(subtotal * 0.12);
    
    return {
      nights,
      baseTotal: Math.round(baseTotal),
      weekendSur: Math.round(weekendSur),
      seasonSur: Math.round(seasonSur),
      subtotal,
      serviceFee,
      total: subtotal + serviceFee
    };
  };

  const pricing = useMemo(() => calculatePricing(), [listing, checkIn, checkOut]);

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
    pricing,
    nights: pricing.nights,
    serviceFee: pricing.serviceFee,
    total: pricing.total,
    user,
    addToast,
    t,
    formatPrice,
    currency,
    setCurrency
  };
}
