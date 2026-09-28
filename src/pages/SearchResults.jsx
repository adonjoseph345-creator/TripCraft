import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchDestinations } from '../services/destinationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchDestinations(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    window.scrollTo(0, 0);
  }, [query]);

  const typeIcons = {
    city: '🏙️',
    state: '🗺️',
    region: '🌍',
    country: '🏳️',
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <section className="search-results-hero">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1 className="page-title">
              Search results for "<span className="highlight">{query}</span>"
            </h1>
          </div>
        </section>

        <section className="search-results-body">
          <div className="container">
            {loading && <LoadingState message={`Searching for "${query}"...`} />}

            {error && <ErrorState message={error} onRetry={fetchResults} />}

            {!loading && !error && results.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🔍</span>
                <h3>No destinations found</h3>
                <p>We couldn't find any destinations matching "{query}". Try a different search.</p>
                <Link to="/" className="btn btn-primary">← Back to Home</Link>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="search-results-grid">
                {results.map((dest) => (
                  <Link
                    key={dest.id}
                    to={`/destination/${dest.id}`}
                    className="search-result-card"
                  >
                    <div className="search-result-card-icon">
                      <span>{typeIcons[dest.type] || '📍'}</span>
                    </div>
                    <div className="search-result-card-body">
                      <h3 className="search-result-card-name">{dest.name}</h3>
                      <p className="search-result-card-full">{dest.fullName}</p>
                      <p className="search-result-card-desc">{dest.description}</p>
                      <div className="search-result-card-meta">
                        {dest.bestTimeToVisit && (
                          <span>🗓️ Best: {dest.bestTimeToVisit}</span>
                        )}
                        <span className="search-result-card-type">{dest.type}</span>
                      </div>
                    </div>
                    <span className="search-result-card-arrow">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default SearchResults;
