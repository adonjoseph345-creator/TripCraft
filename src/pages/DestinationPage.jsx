import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestination } from '../services/destinationService';
import { useTrip } from '../context/TripContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlacesGrid from '../components/PlacesGrid';
import SelectedPlaces from '../components/SelectedPlaces';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

function DestinationPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setDestination: setTripDestination } = useTrip();

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDestination(id);
      setDestination(data);
      setTripDestination(data.fullName || data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestination();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="page-content">
        {/* Hero */}
        <section className="dest-hero">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            {destination && (
              <div className="dest-hero-content">
                <span className="dest-hero-badge">{destination.country || ''}</span>
                <h1 className="dest-hero-title">{destination.name}</h1>
                <p className="dest-hero-tagline">{destination.tagline}</p>
                {destination.fullName && (
                  <p className="dest-hero-location">📍 {destination.fullName}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {loading && (
          <section className="section-padded">
            <div className="container">
              <LoadingState message={`Loading information about ${id.replace(/-/g, ' ')}...`} />
            </div>
          </section>
        )}

        {error && (
          <section className="section-padded">
            <div className="container">
              <ErrorState message={error} onRetry={fetchDestination} />
            </div>
          </section>
        )}

        {!loading && !error && destination && (
          <>
            {/* Overview */}
            <section className="section-padded">
              <div className="container">
                <div className="dest-overview">
                  <div className="dest-overview-text">
                    <span className="section-label">Overview</span>
                    <h2 className="section-title">About {destination.name}</h2>
                    <p className="dest-description">{destination.description}</p>
                  </div>
                  <div className="dest-overview-info">
                    {destination.bestTimeToVisit && (
                      <div className="dest-info-item">
                        <span className="dest-info-icon">🗓️</span>
                        <div>
                          <span className="dest-info-label">Best Time to Visit</span>
                          <span className="dest-info-value">{destination.bestTimeToVisit}</span>
                        </div>
                      </div>
                    )}
                    {destination.language && (
                      <div className="dest-info-item">
                        <span className="dest-info-icon">🗣️</span>
                        <div>
                          <span className="dest-info-label">Language</span>
                          <span className="dest-info-value">{destination.language}</span>
                        </div>
                      </div>
                    )}
                    {destination.currency && (
                      <div className="dest-info-item">
                        <span className="dest-info-icon">💰</span>
                        <div>
                          <span className="dest-info-label">Currency</span>
                          <span className="dest-info-value">{destination.currency}</span>
                        </div>
                      </div>
                    )}
                    {destination.howToReach && (
                      <div className="dest-info-item">
                        <span className="dest-info-icon">✈️</span>
                        <div>
                          <span className="dest-info-label">How to Reach</span>
                          <span className="dest-info-value">{destination.howToReach}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {destination.highlights && destination.highlights.length > 0 && (
                  <div className="dest-highlights">
                    {destination.highlights.map((h, i) => (
                      <span key={i} className="dest-highlight-tag">✨ {h}</span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Tourist Places */}
            <section className="section-padded section-alt">
              <div className="container">
                <span className="section-label">Explore</span>
                <h2 className="section-title">Tourist Places in {destination.name}</h2>
                <p className="section-subtitle">
                  Select the places you want to visit and we'll create a personalized itinerary for you.
                </p>
                <PlacesGrid
                  places={destination.places}
                  destinationId={destination.id}
                  destinationName={destination.name}
                />
              </div>
            </section>
          </>
        )}

        <SelectedPlaces />
      </div>
      <Footer />
    </>
  );
}

export default DestinationPage;
