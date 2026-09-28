import AttractionCard from './AttractionCard';

function AttractionsGrid({ attractions, parentPlaceId, parentPlaceName }) {
  if (!attractions || attractions.length === 0) {
    return null;
  }

  return (
    <div className="attractions-grid">
      {attractions.map((attraction) => (
        <AttractionCard
          key={attraction.id}
          attraction={attraction}
          parentPlaceId={parentPlaceId}
          parentPlaceName={parentPlaceName}
        />
      ))}
    </div>
  );
}

export default AttractionsGrid;
