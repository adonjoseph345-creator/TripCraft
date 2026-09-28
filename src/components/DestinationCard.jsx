import { useNavigate } from 'react-router-dom';

function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { name, image, description, budget, tag } = destination;

  const handleClick = () => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <article
      className="destination-card"
      id={`destination-${name.toLowerCase()}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="destination-card-image">
        <img src={image} alt={name} loading="lazy" />
        {tag && <span className="destination-card-badge">{tag}</span>}
      </div>
      <div className="destination-card-body">
        <h3 className="destination-card-name">{name}</h3>
        <p className="destination-card-desc">{description}</p>
        <div className="destination-card-footer">
          <div className="destination-card-price">
            <span className="label">Starting from</span>
            <span className="amount">{budget}</span>
          </div>
          <button className="btn btn-outline" onClick={handleClick}>Explore →</button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
