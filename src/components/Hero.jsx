import DestinationSearch from './DestinationSearch';

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img src="/hero-bg.jpg" alt="Beautiful travel destination" />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content animate-fade-in-up">
        <h1 className="hero-title">
          Plan trips you'll actually <span className="highlight">remember.</span>
        </h1>
        <p className="hero-subtitle">
          Discover places, build your itinerary, and plan your perfect trip — all in one place.
        </p>
        <DestinationSearch variant="hero" />
      </div>
    </section>
  );
}

export default Hero;
