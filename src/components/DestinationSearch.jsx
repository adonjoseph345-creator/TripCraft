import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDestinations } from '../services/destinationService';

/**
 * Autocomplete destination search with debounce.
 * Calls backend /api/search on user input.
 */
function DestinationSearch({ variant = 'hero' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchDestinations(query.trim());
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Search failed:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (dest) => {
    setQuery(dest.name);
    setShowDropdown(false);
    navigate(`/destination/${dest.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const typeIcons = {
    city: '🏙️',
    state: '🗺️',
    region: '🌍',
    country: '🏳️',
  };

  return (
    <div className={`dest-search dest-search-${variant}`} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="dest-search-form">
        <div className="dest-search-input-wrap">
          <span className="dest-search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where do you want to go?"
            className="dest-search-input"
            id="destination-search"
            autoComplete="off"
          />
          {loading && <span className="dest-search-spinner">⏳</span>}
        </div>
        <button type="submit" className="btn btn-primary dest-search-btn">
          Explore
        </button>
      </form>

      {showDropdown && (
        <div className="dest-search-dropdown">
          {suggestions.map((dest) => (
            <button
              key={dest.id}
              className="dest-search-item"
              onClick={() => handleSelect(dest)}
              type="button"
            >
              <span className="dest-search-item-icon">
                {typeIcons[dest.type] || '📍'}
              </span>
              <div className="dest-search-item-info">
                <span className="dest-search-item-name">{dest.name}</span>
                <span className="dest-search-item-full">{dest.fullName}</span>
              </div>
              <span className="dest-search-item-type">{dest.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DestinationSearch;
