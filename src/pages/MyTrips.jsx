import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSavedTrips, deleteTrip } from '../services/tripStorage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function MyTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getSavedTrips());
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = (tripId) => {
    const updated = deleteTrip(tripId);
    setTrips(updated);
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <section className="mytrips-hero">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1 className="page-title">My Trips</h1>
            <p className="page-subtitle">Your saved trip itineraries.</p>
          </div>
        </section>

        <section className="section-padded">
          <div className="container">
            {trips.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🧳</span>
                <h3>No Saved Trips</h3>
                <p>You haven't saved any trips yet. Start exploring and plan your perfect getaway!</p>
                <Link to="/" className="btn btn-primary">Start Planning</Link>
              </div>
            ) : (
              <div className="mytrips-grid">
                {trips.map((trip) => (
                  <div key={trip.id} className="mytrip-card">
                    <div className="mytrip-card-header">
                      <h3 className="mytrip-card-name">📍 {trip.destination}</h3>
                      <span className="mytrip-card-date">
                        {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                      </span>
                    </div>
                    <div className="mytrip-card-body">
                      <div className="mytrip-card-meta">
                        <span>👥 {trip.travelers} travelers</span>
                        <span>🏛️ {trip.selectedPlaces?.length || 0} places</span>
                        <span>🎯 {trip.selectedAttractions?.length || 0} attractions</span>
                      </div>
                      <div className="mytrip-card-places">
                        {trip.selectedPlaces?.slice(0, 4).map((p, i) => (
                          <span key={i} className="mytrip-place-tag">{p.name}</span>
                        ))}
                        {trip.selectedPlaces?.length > 4 && (
                          <span className="mytrip-place-tag">+{trip.selectedPlaces.length - 4} more</span>
                        )}
                      </div>
                    </div>
                    <div className="mytrip-card-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleDelete(trip.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
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

export default MyTrips;
