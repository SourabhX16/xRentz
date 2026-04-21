import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AvailabilityCalendar.css';

export default function AvailabilityCalendar({ listingId, minNights }) {
  const { bookings } = useApp();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    let days = [];
    // Pad empty slots before 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add real days
    for (let i = 1; i <= daysInMonth; i++) {
      const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr: dString });
    }
    return { year, month, days, title: date.toLocaleString('default', { month: 'long', year: 'numeric' }) };
  };

  const [monthOffset, setMonthOffset] = useState(0);

  const currentMonth = new Date();
  currentMonth.setMonth(currentMonth.getMonth() + monthOffset);
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const months = [
    generateMonthData(currentMonth),
    generateMonthData(nextMonth)
  ];

  const blockedMap = useMemo(() => {
    const map = {};
    const relevantBookings = bookings.filter(b => b.listingId === listingId && ['confirmed', 'blocked', 'pending'].includes(b.status));
    
    relevantBookings.forEach(booking => {
      if (!booking.checkIn || !booking.checkOut) return;
      let curr = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      while (curr < end) {
        const dStr = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
        map[dStr] = booking.status;
        curr.setDate(curr.getDate() + 1);
      }
    });
    return map;
  }, [bookings, listingId]);

  return (
    <div className="availability-wrapper">
      <div className="availability-header">
        <p>Minimum stay: <strong>{minNights || 1} nights</strong></p>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn--sm btn--ghost" onClick={() => setMonthOffset(prev => prev - 1)}>&larr; Prev</button>
          <button className="btn btn--sm btn--ghost" onClick={() => setMonthOffset(prev => prev + 1)}>Next &rarr;</button>
        </div>

        <div className="availability-legend">
          <span className="legend-item"><div className="legend-box available"></div> Available</span>
          <span className="legend-item"><div className="legend-box booked"></div> Booked</span>
        </div>
      </div>

      <div className="availability-calendars">
        {months.map(m => (
          <div key={m.title} className="avail-calendar">
            <h4 className="avail-calendar__title">{m.title}</h4>
            <div className="avail-calendar__grid">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="avail-calendar__day-name">{day}</div>
              ))}
              {m.days.map((dObj, i) => {
                if (!dObj) return <div key={i} className="avail-calendar__empty"></div>;
                
                const isBlocked = !!blockedMap[dObj.dateStr];
                const blockStatus = isBlocked ? blockedMap[dObj.dateStr] : '';
                return (
                  <div key={i} className={`avail-calendar__day ${isBlocked ? 'is-blocked ' + blockStatus : 'is-available'}`}>
                    {dObj.day}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
