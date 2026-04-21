import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './ReviewModal.css';

export default function ReviewModal({ booking, onClose }) {
  const { user, addReview } = useApp();
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [ratings, setRatings] = useState({
    cleanliness: 5,
    location: 5,
    value: 5,
    communication: 5
  });

  const handleSlider = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: Number(value) }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const p = URL.createObjectURL(e.target.files[0]);
      setPhoto(p);
    }
  };

  const averageRating = (
    (ratings.cleanliness + ratings.location + ratings.value + ratings.communication) / 4
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const reviewStr = averageRating.toFixed(1);

    addReview({
      listingId: booking.listingId,
      bookingId: booking.id,
      user: {
        name: user?.name || 'Guest User',
        avatar: user?.avatar || '👤'
      },
      rating: parseFloat(reviewStr),
      categories: ratings,
      text: text,
      photo: photo
    });

    onClose();
  };

  return (
    <div className="review-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <header className="review-modal__header">
          <h2>Review Your Stay</h2>
          <button className="review-modal__close" onClick={onClose}>×</button>
        </header>

        <div className="review-modal__booking-info">
          <img src={booking.listingImage} alt={booking.listingTitle} />
          <div>
            <h3>{booking.listingTitle}</h3>
            <p>{booking.checkIn} → {booking.checkOut}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="review-modal__form">
          <div className="review-modal__section">
            <h4>Rate your experience</h4>
            <div className="review-modal__avg">Overall: <strong>{averageRating.toFixed(1)}</strong> / 5.0</div>
            
            <div className="review-sliders">
              {['cleanliness', 'location', 'value', 'communication'].map(cat => (
                <div key={cat} className="review-slider">
                  <label>{cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
                  <div className="slider-wrapper">
                    <input 
                      type="range" 
                      min="1" max="5" step="1" 
                      value={ratings[cat]} 
                      onChange={(e) => handleSlider(cat, e.target.value)}
                    />
                    <span>{ratings[cat]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="review-modal__section">
            <h4>Share your thoughts</h4>
            <textarea
              className="form-input form-textarea"
              placeholder="What did you love? What could be improved? Help future guests by sharing details about your stay."
              rows="4"
              value={text}
              onChange={e => setText(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="review-modal__section">
            <h4>Add a photo (optional)</h4>
            <label className="review-photo-upload">
              {photo ? (
                <div className="review-photo-preview" style={{ backgroundImage: `url(${photo})` }}>
                  <span className="change-photo-text">Change Photo</span>
                </div>
              ) : (
                <div className="review-photo-placeholder">
                  <span>📸</span>
                  <span>Upload from device</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
            </label>
          </div>

          <div className="review-modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={!text.trim()}>Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}
