/**
 * Weather Provider — Stub for future weather API integration.
 * Returns a clear "unavailable" message until a real weather API is connected.
 */

/**
 * Get weather for a location.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Weather data or unavailable message
 */
export async function getWeather(lat, lng) {
  // TODO: Connect to OpenWeatherMap, WeatherAPI, etc.
  return {
    available: false,
    message: 'Live weather data is not connected yet.',
    data: null,
  };
}
