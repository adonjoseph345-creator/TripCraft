import { apiGet } from './api';

/**
 * Search for destinations matching a query.
 * @param {string} query - Search text
 * @returns {Promise<Array>} Array of destination results
 */
export async function searchDestinations(query) {
  return apiGet('/search', { q: query });
}

/**
 * Get full details for a destination including its tourist places.
 * @param {string} destinationId - Destination slug ID
 * @returns {Promise<Object>} Destination details with places array
 */
export async function getDestination(destinationId) {
  return apiGet(`/destination/${destinationId}`);
}
