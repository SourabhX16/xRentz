import { useState } from 'react';
import './Support.css';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="support-page animate-fade-in">
      <div className="support-container container">
        <header className="support-header">
          <h1>Get in Touch</h1>
          <p>We're here to help you 24/7.</p>
        </header>

        <div className="support-card">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-method">
                <div className="contact-method__icon">📧</div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@xrentz.com</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-method__icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (888) XRENTZ-GO</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-method__icon">📍</div>
                <div>
                  <h4>Our Office</h4>
                  <p>Skyline Towers, Floor 42<br/>New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              {submitted ? (
                <div className="animate-scale-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                  <h3>Message Sent!</h3>
                  <p>Our team will get back to you within 2-4 hours.</p>
                  <button className="btn btn--primary btn--md" onClick={() => setSubmitted(false)} style={{ marginTop: '20px' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea 
                      className="form-input" 
                      placeholder="How can we help?" 
                      rows="5" 
                      required 
                      style={{ resize: 'none' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
