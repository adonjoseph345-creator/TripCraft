import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getPlaceDetails } from '../services/placeService';
import { useTrip } from '../context/TripContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AttractionsGrid from '../components/AttractionsGrid';
import SelectedPlaces from '../components/SelectedPlaces';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

function PlaceDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const destinationName = searchParams.get('destination') || '';
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addPlace, removePlace, isPlaceSelected } = useTrip();

  const fetchPlace = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlaceDetails(id, destinationName);
      setPlace(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlace();
    window.scrollTo(0, 0);
  }, [id]);

  const selected = place ? isPlaceSelected(place.id) : false;

  const handleTogglePlace = () => {
    if (!place) return;
    if (selected) {
      removePlace(place.id);
    } else {
      addPlace({ ...place, destinationName });
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        {/* Hero */}
        <section className="place-hero">
          <div className="container">
            <Link to={-1} className="back-link">← Back</Link>
            {place && (
              <div className="place-hero-content">
                {place.category && (
                  <span className="place-hero-badge">{place.category}</span>
                )}
                <h1 className="place-hero-title">{place.name}</h1>
                {place.destination && (
                  <p className="place-hero-location">📍 {place.destination}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {loading && (
          <section className="section-padded">
            <div className="container">
              <LoadingState message="Loading place details..." />
            </div>
          </section>
        )}

        {error && (
          <section className="section-padded">
            <div className="container">
              <ErrorState message={error} onRetry={fetchPlace} />
            </div>
          </section>
        )}

        {!loading && !error && place && (
          <>
            {/* Details */}
            <section className="section-padded">
              <div className="container">
                <div className="place-details-grid">
                  <div className="place-details-main">
                    <h2 className="section-title">About {place.name}</h2>
                    <p className="place-details-desc">{place.description}</p>

                    {place.thingsToDo && place.thingsToDo.length > 0 && (
                      <div className="place-details-section">
                        <h3>Things to Do</h3>
                        <ul className="place-details-list">
                          {place.thingsToDo.map((item, i) => (
                            <li key={i}>✨ {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {place.tips && place.tips.length > 0 && (
                      <div className="place-details-section">
                        <h3>Travel Tips</h3>
                        <ul className="place-details-list">
                          {place.tips.map((tip, i) => (
                            <li key={i}>💡 {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="place-details-sidebar">
                    <div className="place-details-card">
                      {place.rating && (
                        <div className="place-info-row">
                          <span className="place-info-label">Rating</span>
                          <span className="place-info-value">⭐ {place.rating} ({place.reviewCount || 0} reviews)</span>
                        </div>
                      )}
                      {place.recommendedDuration && (
                        <div className="place-info-row">
                          <span className="place-info-label">Duration</span>
                          <span className="place-info-value">⏱️ {place.recommendedDuration}</span>
                        </div>
                      )}
                      {place.openingHours && (
                        <div className="place-info-row">
                          <span className="place-info-label">Hours</span>
                          <span className="place-info-value">🕐 {place.openingHours}</span>
                        </div>
                      )}
                      {place.entryFee && (
                        <div className="place-info-row">
                          <span className="place-info-label">Entry Fee</span>
                          <span className="place-info-value">🎟️ {place.entryFee}</span>
                        </div>
                      )}
                      {place.location && (
                        <div className="place-info-row">
                          <span className="place-info-label">Location</span>
                          <span className="place-info-value">📍 {place.location}</span>
                        </div>
                      )}

                      <button
                        className={`btn btn-lg ${selected ? 'btn-selected' : 'btn-primary'}`}
                        onClick={handleTogglePlace}
                        style={{ width: '100%', marginTop: '1rem' }}
                      >
                        {selected ? '✓ Added to Trip' : '+ Add to My Trip'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Attractions */}
            {place.attractions && place.attractions.length > 0 && (
              <section className="section-padded section-alt">
                <div className="container">
                  <span className="section-label">Explore</span>
                  <h2 className="section-title">Attractions at {place.name}</h2>
                  <p className="section-subtitle">Select specific attractions you'd like to visit.</p>
                  <AttractionsGrid
                    attractions={place.attractions}
                    parentPlaceId={place.id}
                    parentPlaceName={place.name}
                  />
                </div>
              </section>
            )}
          </>
        )}

        <SelectedPlaces />
      </div>
      <Footer />
    </>
  );
}

export default PlaceDetailsPage;
