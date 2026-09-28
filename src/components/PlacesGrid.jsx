import PlaceCard from './PlaceCard';

function PlacesGrid({ places, destinationId, destinationName }) {
  if (!places || places.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🗺️</span>
        <p>No places found for this destination.</p>
      </div>
    );
  }

  return (
    <div className="places-grid">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          destinationId={destinationId}
          destinationName={destinationName}
        />
      ))}
    </div>
  );
}

export default PlacesGrid;
