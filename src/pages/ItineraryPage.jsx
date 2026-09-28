import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { generateItinerary } from '../services/itineraryService';
import { saveTrip } from '../services/tripStorage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const ACTIVITY_ICONS = {
  sightseeing: '🏛️',
  food: '🍽️',
  travel: '🚗',
  shopping: '🛍️',
  adventure: '🏔️',
  default: '📌',
};

function formatCurrency(amount) {
  if (!amount) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ItineraryPage() {
  const navigate = useNavigate();
  const {
    destination,
    selectedPlaces,
    selectedAttractions,
    startDate, endDate,
    travelers, budget, interests,
    itinerary, setItinerary,
  } = useTrip();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateItinerary({
        destination,
        selectedPlaces,
        selectedAttractions,
        startDate: startDate ? startDate.toISOString().split('T')[0] : null,
        endDate: endDate ? endDate.toISOString().split('T')[0] : null,
        travelers,
        budget,
        interests,
      });
      setItinerary(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlaces.length > 0 && !itinerary) {
      fetchItinerary();
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSave = () => {
    if (!itinerary) return;
    saveTrip({
      destination,
      selectedPlaces: selectedPlaces.map(p => ({ id: p.id, name: p.name })),
      selectedAttractions: selectedAttractions.map(a => ({ id: a.id, name: a.name })),
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      travelers,
      budget,
      interests,
      itinerary,
    });
    setSaved(true);
  };

  if (selectedPlaces.length === 0 && !itinerary) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <section className="section-padded">
            <div className="container">
              <div className="empty-state">
                <span className="empty-state-icon">🗺️</span>
                <h3>No Trip Planned</h3>
                <p>Select places and generate an itinerary from the Trip Planner.</p>
                <Link to="/" className="btn btn-primary">Explore Destinations</Link>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  const totalExpenses = itinerary?.expenses
    ? Object.values(itinerary.expenses).reduce((a, b) => a + Number(b), 0)
    : 0;

  return (
    <>
      <Navbar />
      <div className="page-content">
        {/* Hero */}
        <section className="itin-hero">
          <div className="container">
            <Link to="/plan" className="back-link">← Back to Planner</Link>
            <div className="itin-hero-content">
              <span className="itin-hero-badge">✨ Your Itinerary</span>
              <h1 className="itin-hero-title">{destination || 'Your Trip'}</h1>
              {itinerary && (
                <p className="itin-hero-tagline">
                  {itinerary.totalDays} days · {itinerary.totalNights} nights · {selectedPlaces.length} places
                </p>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <section className="section-padded">
            <div className="container">
              <LoadingState message="Generating your personalized itinerary..." size="large" />
            </div>
          </section>
        )}

        {error && (
          <section className="section-padded">
            <div className="container">
              <ErrorState message={error} onRetry={fetchItinerary} />
            </div>
          </section>
        )}

        {!loading && !error && itinerary && (
          <>
            {/* Summary */}
            <section className="section-padded">
              <div className="container">
                <div className="itin-summary-grid">
                  <div className="itin-summary-card">
                    <span className="itin-summary-icon">📍</span>
                    <span className="itin-summary-label">Destination</span>
                    <span className="itin-summary-value">{destination}</span>
                  </div>
                  <div className="itin-summary-card">
                    <span className="itin-summary-icon">📅</span>
                    <span className="itin-summary-label">Dates</span>
                    <span className="itin-summary-value">{formatDate(startDate)} — {formatDate(endDate)}</span>
                  </div>
                  <div className="itin-summary-card">
                    <span className="itin-summary-icon">👥</span>
                    <span className="itin-summary-label">Travelers</span>
                    <span className="itin-summary-value">{travelers}</span>
                  </div>
                  <div className="itin-summary-card">
                    <span className="itin-summary-icon">💰</span>
                    <span className="itin-summary-label">Est. Total</span>
                    <span className="itin-summary-value">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Badge */}
            <section className="itin-badge-section">
              <div className="container">
                <div className="itin-ai-badge">
                  <span>🤖</span>
                  <span>This itinerary was generated by AI using your selected places. Expense estimates are approximate.</span>
                </div>
              </div>
            </section>

            {/* Day-by-Day */}
            <section className="section-padded">
              <div className="container">
                <span className="section-label">Day-by-Day Plan</span>
                <h2 className="section-title">Your Itinerary</h2>

                <div className="itin-timeline">
                  {itinerary.days?.map((day) => (
                    <div className="itin-day-card" key={day.day}>
                      <div className="itin-day-header">
                        <div className="itin-day-number">
                          <span>Day</span>
                          <strong>{day.day}</strong>
                        </div>
                        <div>
                          <h3 className="itin-day-title">{day.title}</h3>
                          <span className="itin-day-location">📍 {day.location}</span>
                          {day.date && (
                            <span className="itin-day-date">📅 {formatDate(day.date)}</span>
                          )}
                        </div>
                      </div>

                      <div className="itin-activities">
                        {day.activities?.map((activity, idx) => (
                          <div className="itin-activity" key={idx}>
                            <div className="itin-activity-time">{activity.time}</div>
                            <div className="itin-activity-dot">
                              <span>{ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default}</span>
                            </div>
                            <div className="itin-activity-content">
                              <h4 className="itin-activity-name">{activity.name}</h4>
                              <p className="itin-activity-desc">{activity.description}</p>
                              {activity.duration && (
                                <span className="itin-activity-duration">⏱️ {activity.duration}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Expenses */}
            {itinerary.expenses && (
              <section className="section-padded section-alt">
                <div className="container">
                  <span className="section-label">Budget Breakdown</span>
                  <h2 className="section-title">Estimated Expenses</h2>
                  <p className="section-subtitle">These are approximate estimates. Actual costs may vary.</p>

                  <div className="itin-expenses-card">
                    {Object.entries(itinerary.expenses).map(([category, amount]) => (
                      <div className="itin-expense-row" key={category}>
                        <span className="itin-expense-category">{category}</span>
                        <span className="itin-expense-amount">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="itin-expense-row itin-expense-total">
                      <span className="itin-expense-category">Total</span>
                      <span className="itin-expense-amount">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tips */}
            {itinerary.tips && itinerary.tips.length > 0 && (
              <section className="section-padded">
                <div className="container">
                  <h2 className="section-title">💡 Travel Tips</h2>
                  <div className="itin-tips">
                    {itinerary.tips.map((tip, i) => (
                      <div key={i} className="itin-tip">
                        <span className="itin-tip-icon">✨</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Actions */}
            <section className="section-padded">
              <div className="container">
                <div className="itin-actions">
                  <button className="btn btn-primary btn-lg" onClick={fetchItinerary}>
                    🔄 Regenerate
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={() => navigate('/plan')}>
                    ✏️ Modify Places
                  </button>
                  <button
                    className={`btn btn-lg ${saved ? 'btn-selected' : 'btn-primary'}`}
                    onClick={handleSave}
                    disabled={saved}
                  >
                    {saved ? '✓ Trip Saved' : '💾 Save Trip'}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ItineraryPage;
