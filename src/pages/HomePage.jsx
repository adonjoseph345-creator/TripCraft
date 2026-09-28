import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PopularDestinations from '../components/PopularDestinations';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PopularDestinations />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
