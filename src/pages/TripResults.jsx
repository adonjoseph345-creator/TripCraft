import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getItinerary } from '../data/mockItineraries';
import { generateItinerary } from '../services/geminiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ACTIVITY_ICONS = {
  sightseeing: '🏛️',
  food: '🍽️',
  travel: '🚗',
  default: '📌',
};

function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/* ---------- Loading Skeleton ---------- */
function LoadingSkeleton({ destination }) {
  const loadingMessages = [
    `✨ Crafting your perfect trip to ${destination}...`,
    `🗺️ Finding the best spots in ${destination}...`,
    `🍽️ Discovering local cuisines...`,
    `🏛️ Mapping out must-see landmarks...`,
    `💰 Calculating your budget...`,
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="tr-loading">
      <div className="container">
        <div className="tr-loading-content">
          <div className="tr-loading-spinner">
            <div className="tr-spinner-ring"></div>
            <span className="tr-spinner-icon">✈️</span>
          </div>
          <h2 className="tr-loading-title">Planning Your Adventure</h2>
          <p className="tr-loading-message">{loadingMessages[msgIndex]}</p>

          {/* Skeleton Cards */}
          <div className="tr-skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="tr-skeleton-card" key={i}>
                <div className="tr-skeleton-icon shimmer"></div>
                <div className="tr-skeleton-lines">
                  <div className="tr-skeleton-line short shimmer"></div>
                  <div className="tr-skeleton-line shimmer"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Timeline */}
          <div className="tr-skeleton-timeline">
            {[1, 2, 3].map((i) => (
              <div className="tr-skeleton-day" key={i}>
                <div className="tr-skeleton-day-badge shimmer"></div>
                <div className="tr-skeleton-day-content">
                  <div className="tr-skeleton-line wide shimmer"></div>
                  <div className="tr-skeleton-line shimmer"></div>
                  <div className="tr-skeleton-line short shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Error State ---------- */
function ErrorState({ error, onRetry, destination }) {
  const isApiKeyMissing = error === 'GEMINI_API_KEY_NOT_SET';

  return (
    <section className="tr-error">
      <div className="container">
        <div className="tr-error-content">
          <span className="tr-error-icon">{isApiKeyMissing ? '🔑' : '⚠️'}</span>
          <h2 className="tr-error-title">
            {isApiKeyMissing ? 'API Key Required' : 'Oops! Something went wrong'}
          </h2>
          <p className="tr-error-message">
            {isApiKeyMissing
              ? 'To generate AI-powered itineraries, please add your Gemini API key to the .env file (VITE_GEMINI_API_KEY). Get a free key at aistudio.google.com/apikey'
              : `We couldn't generate your itinerary for ${destination}. ${error}`}
          </p>
          <div className="tr-error-actions">
            {!isApiKeyMissing && (
              <button className="btn btn-primary btn-lg" onClick={onRetry}>
                🔄 Try Again
              </button>
            )}
            <Link to="/" className="btn btn-outline btn-lg">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Main TripResults Component ---------- */
function TripResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state;

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchItinerary = async () => {
    if (!tripData) return;

    setLoading(true);
    setError(null);

    const { destination, startDate, endDate, budget, travelers } = tripData;
    const numDays =
      startDate && endDate
        ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
        : 4;

    try {
      const aiItinerary = await generateItinerary(destination, numDays, budget, travelers);
      setItinerary(aiItinerary);
    } catch (err) {
      console.error('AI itinerary generation failed:', err);
      // Always show the error to the user so they know what went wrong
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [tripData]);

  // If no trip data, show empty state
  if (!tripData) {
    return (
      <>
        <Navbar />
        <section className="tr-empty">
          <div className="container">
            <div className="tr-empty-content">
              <span className="tr-empty-icon">🗺️</span>
              <h2>No Trip Data Found</h2>
              <p>It looks like you haven't planned a trip yet. Head back to the homepage to start planning.</p>
              <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { destination, startDate, endDate, travelers, budget } = tripData;

  const numDays = startDate && endDate
    ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 4;

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="tr-page">
          <section className="tr-hero">
            <div className="container">
              <Link to="/" className="tr-back-link">← Back to Home</Link>
              <div className="tr-hero-content">
                <span className="tr-hero-badge">✨ Generating Your Trip</span>
                <h1 className="tr-hero-title">{destination}</h1>
                <p className="tr-hero-tagline">Our AI is crafting the perfect itinerary for you...</p>
              </div>
            </div>
          </section>
          <LoadingSkeleton destination={destination} />
        </div>
        <Footer />
      </>
    );
  }

  // Error state (only for API key missing; other errors fall back to mock data)
  if (error) {
    return (
      <>
        <Navbar />
        <div className="tr-page">
          <section className="tr-hero">
            <div className="container">
              <Link to="/" className="tr-back-link">← Back to Home</Link>
              <div className="tr-hero-content">
                <span className="tr-hero-badge">⚠️ Setup Required</span>
                <h1 className="tr-hero-title">{destination}</h1>
              </div>
            </div>
          </section>
          <ErrorState error={error} onRetry={fetchItinerary} destination={destination} />
        </div>
        <Footer />
      </>
    );
  }

  // No itinerary data available
  if (!itinerary) {
    return (
      <>
        <Navbar />
        <section className="tr-empty">
          <div className="container">
            <div className="tr-empty-content">
              <span className="tr-empty-icon">🗺️</span>
              <h2>Could not generate itinerary</h2>
              <p>We were unable to create an itinerary for {destination}. Please try again.</p>
              <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const totalExpenses = Object.values(itinerary.expenses).reduce((a, b) => a + b, 0);
  const perPersonCost = travelers ? Math.round(totalExpenses / parseInt(travelers)) : totalExpenses;

  const budgetLabels = {
    budget: 'Budget (₹5K–15K)',
    mid: 'Mid-range (₹15K–40K)',
    premium: 'Premium (₹40K–1L)',
    luxury: 'Luxury (₹1L+)',
  };

  return (
    <>
      <Navbar />
      <div className="tr-page">
        {/* Hero Header */}
        <section className="tr-hero">
          <div className="container">
            <Link to="/" className="tr-back-link">← Back to Home</Link>
            <div className="tr-hero-content">
              <span className="tr-hero-badge">✨ Your Trip Plan</span>
              <h1 className="tr-hero-title">
                {itinerary.destination}
              </h1>
              <p className="tr-hero-tagline">{itinerary.tagline}</p>
            </div>
          </div>
        </section>

        {/* Trip Summary Cards */}
        <section className="tr-summary">
          <div className="container">
            <div className="tr-summary-grid">
              <div className="tr-summary-card">
                <span className="tr-summary-icon">📍</span>
                <div>
                  <span className="tr-summary-label">Destination</span>
                  <span className="tr-summary-value">{destination}</span>
                </div>
              </div>
              <div className="tr-summary-card">
                <span className="tr-summary-icon">📅</span>
                <div>
                  <span className="tr-summary-label">Travel Dates</span>
                  <span className="tr-summary-value">
                    {formatDate(startDate)} — {formatDate(endDate)}
                  </span>
                </div>
              </div>
              <div className="tr-summary-card">
                <span className="tr-summary-icon">⏱️</span>
                <div>
                  <span className="tr-summary-label">Duration</span>
                  <span className="tr-summary-value">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
                </div>
              </div>
              <div className="tr-summary-card">
                <span className="tr-summary-icon">👥</span>
                <div>
                  <span className="tr-summary-label">Travelers</span>
                  <span className="tr-summary-value">{travelers || '—'} {travelers === '1' ? 'Person' : 'People'}</span>
                </div>
              </div>
              <div className="tr-summary-card">
                <span className="tr-summary-icon">💰</span>
                <div>
                  <span className="tr-summary-label">Budget</span>
                  <span className="tr-summary-value">{budgetLabels[budget] || budget || '—'}</span>
                </div>
              </div>
              <div className="tr-summary-card tr-summary-card-highlight">
                <span className="tr-summary-icon">🎯</span>
                <div>
                  <span className="tr-summary-label">Estimated Total</span>
                  <span className="tr-summary-value">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Generated Badge */}
        <section className="tr-ai-badge-section">
          <div className="container">
            <div className="tr-ai-badge">
              <span className="tr-ai-badge-icon">🤖</span>
              <span className="tr-ai-badge-text">
                This itinerary was generated by AI with real places and recommendations for {destination}
              </span>
            </div>
          </div>
        </section>

        {/* Day-by-Day Itinerary */}
        <section className="tr-itinerary">
          <div className="container">
            <div className="tr-section-header">
              <span className="section-label">Your Itinerary</span>
              <h2 className="section-title">Day-by-Day Plan</h2>
            </div>

            <div className="tr-timeline">
              {itinerary.days.map((day) => (
                <div className="tr-day-card" key={day.day} id={`day-${day.day}`}>
                  <div className="tr-day-header">
                    <div className="tr-day-number">
                      <span>Day</span>
                      <strong>{day.day}</strong>
                    </div>
                    <div>
                      <h3 className="tr-day-title">{day.title}</h3>
                      <span className="tr-day-location">📍 {day.location}</span>
                    </div>
                  </div>

                  <div className="tr-activities">
                    {day.activities.map((activity, idx) => (
                      <div className="tr-activity" key={idx}>
                        <div className="tr-activity-time">{activity.time}</div>
                        <div className="tr-activity-dot">
                          <span>{ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default}</span>
                        </div>
                        <div className="tr-activity-content">
                          <h4 className="tr-activity-name">{activity.name}</h4>
                          <p className="tr-activity-desc">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estimated Expenses */}
        <section className="tr-expenses">
          <div className="container">
            <div className="tr-section-header">
              <span className="section-label">Budget Breakdown</span>
              <h2 className="section-title">Estimated Expenses</h2>
            </div>

            <div className="tr-expenses-card">
              <div className="tr-expenses-table">
                <div className="tr-expense-row">
                  <span className="tr-expense-category">🏨 Accommodation</span>
                  <span className="tr-expense-amount">{formatCurrency(itinerary.expenses.accommodation)}</span>
                </div>
                <div className="tr-expense-row">
                  <span className="tr-expense-category">🚗 Transport</span>
                  <span className="tr-expense-amount">{formatCurrency(itinerary.expenses.transport)}</span>
                </div>
                <div className="tr-expense-row">
                  <span className="tr-expense-category">🍽️ Food & Dining</span>
                  <span className="tr-expense-amount">{formatCurrency(itinerary.expenses.food)}</span>
                </div>
                <div className="tr-expense-row">
                  <span className="tr-expense-category">🎟️ Activities & Tickets</span>
                  <span className="tr-expense-amount">{formatCurrency(itinerary.expenses.activities)}</span>
                </div>
                <div className="tr-expense-row">
                  <span className="tr-expense-category">📦 Miscellaneous</span>
                  <span className="tr-expense-amount">{formatCurrency(itinerary.expenses.miscellaneous)}</span>
                </div>
                <div className="tr-expense-row tr-expense-total">
                  <span className="tr-expense-category">Total Estimated Cost</span>
                  <span className="tr-expense-amount">{formatCurrency(totalExpenses)}</span>
                </div>
                {travelers && parseInt(travelers) > 1 && (
                  <div className="tr-expense-row tr-expense-per-person">
                    <span className="tr-expense-category">Per Person</span>
                    <span className="tr-expense-amount">{formatCurrency(perPersonCost)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="tr-actions">
          <div className="container">
            <div className="tr-actions-inner">
              <button
                className="btn btn-primary btn-lg"
                id="regenerate-btn"
                onClick={fetchItinerary}
              >
                🔄 Regenerate Itinerary
              </button>
              <button
                className="btn btn-primary btn-lg"
                id="book-trip-btn"
                onClick={() => alert('Booking feature coming soon! 🚀')}
              >
                🎉 Book This Trip
              </button>
              <button
                className="btn btn-outline btn-lg"
                id="modify-trip-btn"
                onClick={() => navigate('/')}
              >
                ✏️ Modify Trip
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default TripResults;
