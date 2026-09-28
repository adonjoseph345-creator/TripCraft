import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from './DateRangePicker';

function TripSearch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    travelers: '',
    budget: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (start, end) => {
    setFormData({ ...formData, startDate: start, endDate: end });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Navigate to trip results with form data
    navigate('/trip-results', {
      state: {
        destination: formData.destination,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        travelers: formData.travelers,
        budget: formData.budget,
      },
    });
  };

  return (
    <form className="trip-search" id="hero-search" onSubmit={handleSubmit}>
      <div className="trip-search-grid">
        <div className="trip-search-field">
          <label htmlFor="destination">Destination</label>
          <div className="input-wrapper">
            <span className="input-icon">📍</span>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Where to?"
              value={formData.destination}
              onChange={handleChange}
            />
          </div>
        </div>

        <DateRangePicker
          startDate={formData.startDate}
          endDate={formData.endDate}
          onChange={handleDateChange}
        />

        <div className="trip-search-field">
          <label htmlFor="travelers">Travelers</label>
          <div className="input-wrapper">
            <span className="input-icon">👥</span>
            <select
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
            >
              <option value="" disabled>How many?</option>
              <option value="1">1 Traveler</option>
              <option value="2">2 Travelers</option>
              <option value="3">3 Travelers</option>
              <option value="4">4 Travelers</option>
              <option value="5">5+ Travelers</option>
            </select>
          </div>
        </div>

        <div className="trip-search-field">
          <label htmlFor="budget">Budget</label>
          <div className="input-wrapper">
            <span className="input-icon">💰</span>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="" disabled>Select budget</option>
              <option value="budget">Budget (₹5K–15K)</option>
              <option value="mid">Mid-range (₹15K–40K)</option>
              <option value="premium">Premium (₹40K–1L)</option>
              <option value="luxury">Luxury (₹1L+)</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg trip-search-btn" id="plan-trip-btn">
        ✨ Plan My Trip
      </button>
    </form>
  );
}

export default TripSearch;
