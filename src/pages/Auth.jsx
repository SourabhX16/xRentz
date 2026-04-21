import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useApp();
  const [role, setRole] = useState(searchParams.get('role') === 'owner' ? 'owner' : 'user');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'owner' ? '/owner-dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'At least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: role === 'owner' ? '🏠' : '😊',
      role: role,
    });
    setLoading(false);
    navigate(role === 'owner' ? '/owner-dashboard' : '/dashboard');
  };

  const handleSocial = (provider) => {
    setLoading(true);
    setTimeout(() => {
      login({
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: role === 'owner' ? '🏠' : '👤',
        role: role,
      });
      setLoading(false);
      navigate(role === 'owner' ? '/owner-dashboard' : '/dashboard');
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className={`auth-page__left ${role === 'owner' ? 'auth-page__left--owner' : ''}`}>
        <div className="auth-page__brand">
          <Link to="/" className="auth-page__logo">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="var(--color-primary-500)"/>
              <path d="M7 7L14 14M14 14L21 7M14 14L7 21M14 14L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            xRentz
          </Link>
        </div>
        <div className="auth-page__hero-text">
          {role === 'user' ? (
            <>
              <h1>Find your perfect<br/>place to stay</h1>
              <p>Join thousands of happy renters on the most trusted rental marketplace.</p>
            </>
          ) : (
            <>
              <h1>Start earning<br/>from your property</h1>
              <p>List your property and connect with thousands of renters looking for their next stay.</p>
            </>
          )}
        </div>
        <div className="auth-page__testimonial">
          {role === 'user' ? (
            <>
              <p>"xRentz made finding our dream vacation home incredibly easy. The booking was seamless and the host was amazing!"</p>
              <div className="auth-page__testimonial-author">
                <span>😊</span>
                <div>
                  <strong>Sarah K.</strong>
                  <span>Guest since 2023</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p>"I listed my apartment and got my first booking within 48 hours! xRentz makes hosting effortless and profitable."</p>
              <div className="auth-page__testimonial-author">
                <span>🏠</span>
                <div>
                  <strong>Rajesh M.</strong>
                  <span>Host since 2024</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-card animate-scale-in">
          {/* Role Selector */}
          <div className="auth-role-selector">
            <button
              className={`auth-role-card ${role === 'user' ? 'auth-role-card--active' : ''}`}
              onClick={() => setRole('user')}
              type="button"
            >
              <span className="auth-role-card__icon">🔑</span>
              <span className="auth-role-card__label">I want to rent</span>
              <span className="auth-role-card__desc">Find & book properties</span>
            </button>
            <button
              className={`auth-role-card ${role === 'owner' ? 'auth-role-card--active' : ''}`}
              onClick={() => setRole('owner')}
              type="button"
            >
              <span className="auth-role-card__icon">🏠</span>
              <span className="auth-role-card__label">I want to list</span>
              <span className="auth-role-card__desc">List & manage properties</span>
            </button>
          </div>

          <div className="auth-card__header">
            <h2 className="auth-card__title">
              {role === 'owner' ? 'Host Center' : 'Access xRentz'}
            </h2>
            <p className="auth-card__subtitle">
              {role === 'owner' 
                ? 'Sign in or create a host account to manage properties' 
                : 'Enter your details below to continue your journey'}
            </p>
          </div>

          {/* Social Buttons */}
          <div className="auth-socials">
            <button className="auth-social-btn" onClick={() => handleSocial('Google')} disabled={loading} id="google-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button className="auth-social-btn" onClick={() => handleSocial('Apple')} disabled={loading} id="apple-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">Full Name (New Users)</label>
              <input
                id="auth-name"
                type="text"
                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder={role === 'owner' ? 'Property Owner Name' : 'John Doe'}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">Email</label>
              <input
                id="auth-email"
                type="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="auth-password" className="form-label">Password</label>
              <input
                id="auth-password"
                type="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                value={formData.password}
                onChange={e => updateField('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className={`btn btn--lg auth-submit ${role === 'owner' ? 'btn--accent' : 'btn--primary'}`}
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : 'Continue to xRentz'}
            </button>
          </form>

          <p className="auth-switch">
             Secure payment and trusted profiles included.
          </p>
        </div>
      </div>
    </div>
  );
}
