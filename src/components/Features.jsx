const features = [
  {
    icon: '🧠',
    title: 'Smart Trip Planning',
    description:
      'Intelligent suggestions and optimized routes to make every minute of your trip count.',
  },
  {
    icon: '🎯',
    title: 'Personalized Itineraries',
    description:
      'Tailored day-by-day plans based on your interests, pace, and travel style.',
  },
  {
    icon: '💳',
    title: 'Budget Tracking',
    description:
      'Stay on top of expenses with real-time budget insights and smart spending tips.',
  },
  {
    icon: '🌍',
    title: 'Discover Amazing Places',
    description:
      'Uncover hidden gems and must-visit spots curated by local experts and fellow travelers.',
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-header">
          <span className="section-label">Why TripCraft</span>
          <h2 className="section-title">Everything You Need to Travel Smarter</h2>
          <p className="section-subtitle">
            From planning to exploring, TripCraft equips you with powerful tools to craft the perfect trip.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-card-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
