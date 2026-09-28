import DestinationCard from './DestinationCard';

const destinations = [
  {
    name: 'Kerala',
    image: '/kerala.jpg',
    description:
      'Explore serene backwaters, lush tea plantations, and pristine beaches in God\'s Own Country.',
    budget: '₹8,500',
    tag: '🌿 Trending',
  },
  {
    name: 'Goa',
    image: '/goa.jpg',
    description:
      'Sun-kissed beaches, vibrant nightlife, and Portuguese heritage — the perfect tropical escape.',
    budget: '₹6,200',
    tag: '🏖️ Popular',
  },
  {
    name: 'Manali',
    image: '/manali.jpg',
    description:
      'Snow-capped peaks, adventure sports, and charming hill-town vibes in the heart of the Himalayas.',
    budget: '₹7,800',
    tag: '🏔️ Adventure',
  },
  {
    name: 'Jaipur',
    image: '/jaipur.jpg',
    description:
      'Royal palaces, vibrant bazaars, and rich Rajasthani culture in the majestic Pink City.',
    budget: '₹5,500',
    tag: '🏰 Heritage',
  },
];

function PopularDestinations() {
  return (
    <section className="destinations" id="destinations">
      <div className="container">
        <div className="destinations-header">
          <span className="section-label">Explore India</span>
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">
            Handpicked destinations loved by travelers. Start exploring and let your
            next journey unfold.
          </p>
        </div>

        <div className="destinations-grid">
          {destinations.map((dest) => (
            <DestinationCard key={dest.name} destination={dest} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;
