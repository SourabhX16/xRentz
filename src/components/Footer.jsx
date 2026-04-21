import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="xRentz Home">
              <Logo size={28} />
              <span>xRentz</span>
            </Link>
            <p className="footer__tagline">Find your perfect stay, anywhere in the world.</p>
            <div className="footer__socials">
              {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="footer__social-link" aria-label={s}>{s[0]}</a>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Explore</h4>
            <Link to="/listings" className="footer__link">All Listings</Link>
            <a href="#" className="footer__link">Popular Destinations</a>
            <a href="#" className="footer__link">Last Minute Deals</a>
            <a href="#" className="footer__link">Seasonal Picks</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Hosting</h4>
            <a href="#" className="footer__link">Become a Host</a>
            <a href="#" className="footer__link">Host Resources</a>
            <a href="#" className="footer__link">Community Forum</a>
            <a href="#" className="footer__link">Responsible Hosting</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <Link to="/help" className="footer__link">Help Center</Link>
            <a href="#" className="footer__link">Safety Info</a>
            <Link to="/cancellation" className="footer__link">Cancellation Policy</Link>
            <Link to="/contact" className="footer__link">Contact Us</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© 2025 xRentz, Inc. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
            <a href="#" className="footer__link">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
