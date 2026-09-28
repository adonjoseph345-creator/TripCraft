import { createContext, useContext, useState, useCallback } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [destination, setDestination] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('mid');
  const [interests, setInterests] = useState([]);
  const [itinerary, setItinerary] = useState(null);

  const addPlace = useCallback((place) => {
    setSelectedPlaces(prev => {
      if (prev.find(p => p.id === place.id)) return prev;
      return [...prev, place];
    });
  }, []);

  const removePlace = useCallback((placeId) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId));
    // Also remove attractions that belong to this place
    setSelectedAttractions(prev => prev.filter(a => a.parentPlaceId !== placeId));
  }, []);

  const isPlaceSelected = useCallback((placeId) => {
    return selectedPlaces.some(p => p.id === placeId);
  }, [selectedPlaces]);

  const addAttraction = useCallback((attraction, parentPlaceId, parentPlaceName) => {
    setSelectedAttractions(prev => {
      if (prev.find(a => a.id === attraction.id)) return prev;
      return [...prev, { ...attraction, parentPlaceId, parentPlace: parentPlaceName }];
    });
  }, []);

  const removeAttraction = useCallback((attractionId) => {
    setSelectedAttractions(prev => prev.filter(a => a.id !== attractionId));
  }, []);

  const isAttractionSelected = useCallback((attractionId) => {
    return selectedAttractions.some(a => a.id === attractionId);
  }, [selectedAttractions]);

  const toggleInterest = useCallback((interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const numDays = startDate && endDate
    ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  const resetTrip = useCallback(() => {
    setDestination(null);
    setSelectedPlaces([]);
    setSelectedAttractions([]);
    setStartDate(null);
    setEndDate(null);
    setTravelers('2');
    setBudget('mid');
    setInterests([]);
    setItinerary(null);
  }, []);

  const value = {
    // State
    destination,
    selectedPlaces,
    selectedAttractions,
    startDate,
    endDate,
    travelers,
    budget,
    interests,
    itinerary,
    numDays,

    // Setters
    setDestination,
    setStartDate,
    setEndDate,
    setTravelers,
    setBudget,
    setItinerary,

    // Place actions
    addPlace,
    removePlace,
    isPlaceSelected,

    // Attraction actions
    addAttraction,
    removeAttraction,
    isAttractionSelected,

    // Interest actions
    toggleInterest,

    // Reset
    resetTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}

export default TripContext;
