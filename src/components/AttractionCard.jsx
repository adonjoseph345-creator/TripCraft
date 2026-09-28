import { useTrip } from '../context/TripContext';

function AttractionCard({ attraction, parentPlaceId, parentPlaceName }) {
  const { addAttraction, removeAttraction, isAttractionSelected } = useTrip();
  const selected = isAttractionSelected(attraction.id);

  const handleToggle = () => {
    if (selected) {
      removeAttraction(attraction.id);
    } else {
      addAttraction(attraction, parentPlaceId, parentPlaceName);
    }
  };

  return (
    <div className={`attraction-card ${selected ? 'attraction-card-selected' : ''}`}>
      <div className="attraction-card-body">
        <h4 className="attraction-card-name">{attraction.name}</h4>
        <p className="attraction-card-desc">{attraction.description}</p>
        <div className="attraction-card-meta">
          {attraction.category && (
            <span className="attraction-card-tag">{attraction.category}</span>
          )}
          {attraction.duration && (
            <span className="attraction-card-duration">⏱️ {attraction.duration}</span>
          )}
        </div>
      </div>
      <button
        className={`btn btn-sm ${selected ? 'btn-selected' : 'btn-outline'}`}
        onClick={handleToggle}
      >
        {selected ? '✓ Added' : '+ Add'}
      </button>
    </div>
  );
}

export default AttractionCard;
