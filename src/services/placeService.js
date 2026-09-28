import { apiGet } from './api';

/**
 * Get detailed information about a place including its attractions.
 * @param {string} placeId - Place slug ID
 * @param {string} destinationName - Parent destination name for context
 * @returns {Promise<Object>} Place details with attractions array
 */
export async function getPlaceDetails(placeId, destinationName) {
  return apiGet(`/place/${placeId}`, { destination: destinationName });
}
