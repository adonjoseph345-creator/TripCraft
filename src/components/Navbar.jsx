import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedPlaces } = useTrip();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          TripCraft <span>✈️</span>
        </Link>

        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/search?q=popular" onClick={() => setMenuOpen(false)}>Explore</Link></li>
          <li><Link to="/my-trips" onClick={() => setMenuOpen(false)}>My Trips</Link></li>
          {selectedPlaces.length > 0 && (
            <li>
              <Link to="/plan" onClick={() => setMenuOpen(false)} className="navbar-trip-badge">
                🎒 Plan ({selectedPlaces.length})
              </Link>
            </li>
          )}
        </ul>

        <div className={`navbar-cta${menuOpen ? ' open' : ''}`}>
          {isHome ? (
            <a href="#hero-search" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Start Planning
            </a>
          ) : (
            <Link to="/plan" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              {selectedPlaces.length > 0 ? `Plan Trip (${selectedPlaces.length})` : 'Start Planning'}
            </Link>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
