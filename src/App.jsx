import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import './App.css';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import DestinationPage from './pages/DestinationPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import TripPlanner from './pages/TripPlanner';
import ItineraryPage from './pages/ItineraryPage';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <BrowserRouter>
      <TripProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/destination/:id" element={<DestinationPage />} />
          <Route path="/place/:id" element={<PlaceDetailsPage />} />
          <Route path="/plan" element={<TripPlanner />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Routes>
      </TripProvider>
    </BrowserRouter>
  );
}

export default App;
