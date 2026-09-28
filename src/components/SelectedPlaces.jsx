import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

/**
 * Floating panel showing the user's trip selections.
 * Only visible when places have been selected.
 */
function SelectedPlaces() {
  const navigate = useNavigate();
  const { selectedPlaces, selectedAttractions, removePlace, removeAttraction, destination } = useTrip();

  if (selectedPlaces.length === 0) return null;

  return (
    <div className="selected-panel">
      <div className="selected-panel-header">
        <h4>🎒 Your Trip</h4>
        <span className="selected-panel-count">
          {selectedPlaces.length} {selectedPlaces.length === 1 ? 'place' : 'places'}
          {selectedAttractions.length > 0 && ` · ${selectedAttractions.length} attractions`}
        </span>
      </div>

      <div className="selected-panel-list">
        {selectedPlaces.map((place) => (
          <div key={place.id} className="selected-panel-item">
            <span className="selected-panel-item-name">📍 {place.name}</span>
            <button
              className="selected-panel-remove"
              onClick={() => removePlace(place.id)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        {selectedAttractions.map((attr) => (
          <div key={attr.id} className="selected-panel-item selected-panel-item-attraction">
            <span className="selected-panel-item-name">↳ {attr.name}</span>
            <button
              className="selected-panel-remove"
              onClick={() => removeAttraction(attr.id)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-sm selected-panel-cta"
        onClick={() => navigate('/plan')}
      >
        Continue to Planner →
      </button>
    </div>
  );
}

export default SelectedPlaces;
