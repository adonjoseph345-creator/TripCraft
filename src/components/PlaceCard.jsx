import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

function PlaceCard({ place, destinationId, destinationName }) {
  const navigate = useNavigate();
  const { addPlace, removePlace, isPlaceSelected } = useTrip();
  const selected = isPlaceSelected(place.id);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (selected) {
      removePlace(place.id);
    } else {
      addPlace({ ...place, destinationId, destinationName });
    }
  };

  const handleViewDetails = () => {
    navigate(`/place/${place.id}?destination=${encodeURIComponent(destinationName || '')}`);
  };

  const categoryIcons = {
    Nature: '🌿',
    Heritage: '🏛️',
    Adventure: '🏔️',
    Beach: '🏖️',
    Religious: '🕉️',
    Shopping: '🛍️',
    Food: '🍽️',
    Museum: '🏛️',
    Park: '🌳',
    Viewpoint: '🌄',
  };

  return (
    <article className={`place-card ${selected ? 'place-card-selected' : ''}`}>
      <div className="place-card-image">
        <div className="place-card-image-placeholder">
          <span>{categoryIcons[place.category] || '📍'}</span>
        </div>
        {place.category && (
          <span className="place-card-badge">
            {categoryIcons[place.category] || '📍'} {place.category}
          </span>
        )}
      </div>

      <div className="place-card-body">
        <h3 className="place-card-name">{place.name}</h3>
        {place.location && (
          <p className="place-card-location">📍 {place.location}</p>
        )}
        <p className="place-card-desc">
          {place.description?.substring(0, 120)}{place.description?.length > 120 ? '...' : ''}
        </p>

        <div className="place-card-meta">
          {place.rating && (
            <span className="place-card-rating">⭐ {place.rating}</span>
          )}
          {place.recommendedDuration && (
            <span className="place-card-duration">⏱️ {place.recommendedDuration}</span>
          )}
        </div>

        <div className="place-card-actions">
          <button className="btn btn-outline btn-sm" onClick={handleViewDetails}>
            View Details
          </button>
          <button
            className={`btn btn-sm ${selected ? 'btn-selected' : 'btn-primary'}`}
            onClick={handleToggle}
          >
            {selected ? '✓ Added' : '+ Add to Trip'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;
