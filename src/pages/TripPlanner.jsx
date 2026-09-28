import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DateRangePicker from '../components/DateRangePicker';
import InterestsSelector from '../components/InterestsSelector';

function TripPlanner() {
  const navigate = useNavigate();
  const {
    destination,
    selectedPlaces,
    selectedAttractions,
    startDate, endDate, setStartDate, setEndDate,
    travelers, setTravelers,
    budget, setBudget,
    interests, toggleInterest,
    numDays,
    removePlace, removeAttraction,
  } = useTrip();

  // Over-selection warning
  const MAX_PLACES_PER_DAY = 3;
  const isOverSelected = numDays > 0 && selectedPlaces.length > numDays * MAX_PLACES_PER_DAY;

  const canGenerate = selectedPlaces.length > 0 && startDate && endDate && numDays > 0;

  const handleGenerate = () => {
    if (canGenerate) {
      navigate('/itinerary');
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (selectedPlaces.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <section className="section-padded">
            <div className="container">
              <div className="empty-state">
                <span className="empty-state-icon">🗺️</span>
                <h3>No Places Selected</h3>
                <p>You haven't selected any places for your trip yet. Explore destinations and add places you'd like to visit.</p>
                <Link to="/" className="btn btn-primary">Explore Destinations</Link>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <section className="planner-hero">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1 className="page-title">Plan Your Trip</h1>
            <p className="page-subtitle">Review your selections, set your preferences, and generate your itinerary.</p>
          </div>
        </section>

        <section className="section-padded">
          <div className="container">
            <div className="planner-layout">
              {/* Left: Selections */}
              <div className="planner-selections">
                <div className="planner-section">
                  <h3 className="planner-section-title">📍 Destination</h3>
                  <p className="planner-destination-name">{destination || 'Not set'}</p>
                </div>

                <div className="planner-section">
                  <h3 className="planner-section-title">
                    🏛️ Selected Places ({selectedPlaces.length})
                  </h3>
                  <div className="planner-items">
                    {selectedPlaces.map((place) => (
                      <div key={place.id} className="planner-item">
                        <div className="planner-item-info">
                          <span className="planner-item-name">{place.name}</span>
                          {place.category && (
                            <span className="planner-item-tag">{place.category}</span>
                          )}
                        </div>
                        <button
                          className="planner-item-remove"
                          onClick={() => removePlace(place.id)}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAttractions.length > 0 && (
                  <div className="planner-section">
                    <h3 className="planner-section-title">
                      🎯 Selected Attractions ({selectedAttractions.length})
                    </h3>
                    <div className="planner-items">
                      {selectedAttractions.map((attr) => (
                        <div key={attr.id} className="planner-item planner-item-attraction">
                          <div className="planner-item-info">
                            <span className="planner-item-name">{attr.name}</span>
                            <span className="planner-item-parent">at {attr.parentPlace}</span>
                          </div>
                          <button
                            className="planner-item-remove"
                            onClick={() => removeAttraction(attr.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Preferences */}
              <div className="planner-preferences">
                <div className="planner-pref-card">
                  <h3 className="planner-section-title">Trip Preferences</h3>

                  <div className="planner-field">
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleDateChange}
                    />
                  </div>

                  {numDays > 0 && (
                    <div className="planner-days-badge">
                      📅 {numDays} {numDays === 1 ? 'day' : 'days'} / {Math.max(0, numDays - 1)} {numDays - 1 === 1 ? 'night' : 'nights'}
                    </div>
                  )}

                  <div className="planner-field">
                    <label htmlFor="planner-travelers">👥 Travelers</label>
                    <select
                      id="planner-travelers"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="planner-select"
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5">5+ Travelers</option>
                    </select>
                  </div>

                  <div className="planner-field">
                    <label htmlFor="planner-budget">💰 Budget</label>
                    <select
                      id="planner-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="planner-select"
                    >
                      <option value="budget">Budget (₹5K–15K)</option>
                      <option value="mid">Mid-range (₹15K–40K)</option>
                      <option value="premium">Premium (₹40K–1L)</option>
                      <option value="luxury">Luxury (₹1L+)</option>
                    </select>
                  </div>

                  <InterestsSelector selected={interests} onToggle={toggleInterest} />

                  {/* Over-selection warning */}
                  {isOverSelected && (
                    <div className="planner-warning">
                      <span>⚠️</span>
                      <div>
                        <strong>Too many places selected</strong>
                        <p>
                          You have {selectedPlaces.length} places for a {numDays}-day trip.
                          Consider removing some places or extending your trip.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-lg planner-generate-btn"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                  >
                    ✨ Generate Itinerary
                  </button>

                  {!canGenerate && (
                    <p className="planner-hint">
                      {!startDate || !endDate
                        ? 'Please select your travel dates to continue.'
                        : 'Select at least one place to generate your itinerary.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default TripPlanner;
