/**
 * Trip storage — localStorage persistence for saved trips.
 */

const STORAGE_KEY = 'tripcraft_saved_trips';

export function getSavedTrips() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTrip(trip) {
  const trips = getSavedTrips();
  const newTrip = {
    ...trip,
    id: `trip-${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
  trips.unshift(newTrip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return newTrip;
}

export function deleteTrip(tripId) {
  const trips = getSavedTrips().filter(t => t.id !== tripId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return trips;
}
