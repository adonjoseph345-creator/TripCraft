import { apiPost } from './api';

/**
 * Generate a day-by-day itinerary from selected places and preferences.
 * @param {Object} params - Trip parameters
 * @returns {Promise<Object>} Generated itinerary
 */
export async function generateItinerary(params) {
  return apiPost('/itinerary/generate', params);
}
