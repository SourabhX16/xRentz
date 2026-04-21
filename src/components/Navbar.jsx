import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, theme, setTheme, language, setLanguage, currency, setCurrency, currenciesList, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const isOwner = user?.role === 'owner';
  const dashboardPath = isOwner ? '/owner-dashboard' : '/dashboard';

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'neon'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHome && !scrolled ? 'navbar--transparent' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="navbar-logo" aria-label="xRentz Home">
          <Logo size={32} />
          <span className="navbar__logo-text">xRentz</span>
        </Link>

        <div className="navbar__center">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Explore</Link>
          <Link to="/listings" className={`navbar__link ${location.pathname === '/listings' ? 'navbar__link--active' : ''}`}>Listings</Link>
          {user && (
            <Link to={dashboardPath} className={`navbar__link ${location.pathname === dashboardPath ? 'navbar__link--active' : ''}`}>
              {isOwner ? 'My Properties' : 'Dashboard'}
            </Link>
          )}
        </div>

        <div className="navbar__right">
          <button className="navbar__theme-btn" onClick={toggleTheme} aria-label={`Switch theme (current: ${theme})`}>
            {theme === 'light' && '☀️'}
            {theme === 'dark' && '🌙'}
            {theme === 'neon' && '✨'}
          </button>

          <div className="navbar__i18n">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="nav-select">
              <option value="en">🇺🇸 EN</option>
              <option value="hi">🇮🇳 HI</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
            </select>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="nav-select">
              {Object.keys(currenciesList).map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          {user ? (
            <div className="navbar__profile-wrap">
              <button
                className="navbar__profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                id="profile-menu-btn"
              >
                <div className="navbar__avatar">{user.avatar || '👤'}</div>
                <span className="navbar__user-name">{user.name?.split(' ')[0]}</span>
                {isOwner && <span className="navbar__role-badge">Host</span>}
                <svg className={`navbar__chevron ${profileOpen ? 'navbar__chevron--open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {profileOpen && (
                <div className="navbar__dropdown animate-scale-in" role="menu">
                  <Link to={dashboardPath} className="navbar__dropdown-item" role="menuitem">
                    {isOwner ? '🏠 My Properties' : '📊 Dashboard'}
                  </Link>
                  {isOwner ? (
                    <Link to="/owner-dashboard" className="navbar__dropdown-item" role="menuitem">
                      💰 Earnings
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="navbar__dropdown-item" role="menuitem">
                      💬 Messages
                    </Link>
                  )}
                  <Link to={dashboardPath} className="navbar__dropdown-item" role="menuitem">
                    ❤️ Favorites
                  </Link>
                  <hr className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={logout} role="menuitem">
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/auth" className="btn btn--ghost btn--sm" id="login-btn">Log In</Link>
              <Link to="/auth?mode=signup" className="btn btn--primary btn--sm" id="signup-btn">Sign Up</Link>
            </div>
          )}

          <button
            className="navbar__hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-btn"
          >
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`navbar__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`} role="menu">
        <Link to="/" className="navbar__mobile-link" role="menuitem">Explore</Link>
        <Link to="/listings" className="navbar__mobile-link" role="menuitem">Listings</Link>
        {user ? (
          <>
            <Link to={dashboardPath} className="navbar__mobile-link" role="menuitem">
              {isOwner ? '🏠 My Properties' : t('nav.dashboard')}
            </Link>
            <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={logout} role="menuitem">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/auth" className="navbar__mobile-link" role="menuitem">{t('nav.login')}</Link>
            <Link to="/auth?mode=signup" className="navbar__mobile-link navbar__mobile-link--accent" role="menuitem">Sign Up Free</Link>
          </>
        )}
        <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="nav-select" style={{ flex: 1 }}>
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
          </select>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="nav-select" style={{ flex: 1 }}>
            {Object.keys(currenciesList).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
