import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              TripCraft <span>✈️</span>
            </div>
            <p className="footer-desc">
              Your all-in-one travel companion. Plan smarter, explore further,
              and make every trip unforgettable with TripCraft.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search?q=popular">Explore</Link></li>
              <li><Link to="/my-trips">My Trips</Link></li>
              <li><Link to="/plan">Trip Planner</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:hello@tripcraft.in">
                  <span className="footer-contact-icon">✉️</span> hello@tripcraft.in
                </a>
              </li>
              <li>
                <a href="tel:+911234567890">
                  <span className="footer-contact-icon">📞</span> +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} TripCraft. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
