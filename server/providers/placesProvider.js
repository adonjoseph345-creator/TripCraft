/**
 * Places Provider — Abstracts destination/place data retrieval.
 * Currently uses Gemini AI to generate structured destination data.
 * Can be swapped for Google Places API, Foursquare, etc. in the future.
 */

import { generateJSON } from './aiProvider.js';

// In-memory cache to avoid redundant API calls
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Search for destinations matching a query.
 */
export async function searchDestinations(query) {
  const cacheKey = `search:${query.toLowerCase().trim()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const prompt = `You are a travel information system. Search for travel destinations matching "${query}".

Return a JSON array of up to 6 matching destinations. Each destination should be a real place.

RESPOND WITH ONLY valid JSON (no markdown, no explanation):
[
  {
    "id": "unique-slug-id",
    "name": "Destination Name",
    "fullName": "Destination Name, State/Region, Country",
    "state": "State or Region",
    "country": "Country",
    "type": "city | state | region | country",
    "tagline": "A short evocative tagline",
    "description": "2-3 sentence overview of this destination",
    "bestTimeToVisit": "e.g. October to March",
    "image": null
  }
]

Requirements:
- Use REAL places only
- Include places from India and worldwide
- Match partial names (e.g. "Munn" → Munnar, "Rajas" → Rajasthan)
- Sort by relevance to the query
- Return empty array [] if no matches found`;

  const results = await generateJSON(prompt);
  const data = Array.isArray(results) ? results : [];
  setCache(cacheKey, data);
  return data;
}

/**
 * Get full details for a destination.
 */
export async function getDestinationDetails(destinationId) {
  const cacheKey = `dest:${destinationId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Convert slug to readable name
  const name = destinationId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const prompt = `You are an expert travel guide. Provide comprehensive travel information about "${name}".

RESPOND WITH ONLY valid JSON:
{
  "id": "${destinationId}",
  "name": "${name}",
  "fullName": "Full name with state/region and country",
  "state": "State or Region",
  "country": "Country",
  "tagline": "An evocative tagline",
  "description": "3-4 sentence rich description",
  "bestTimeToVisit": "e.g. October to March",
  "language": "Primary language spoken",
  "currency": "Currency used",
  "timezone": "Timezone",
  "howToReach": "Brief transportation info",
  "image": null,
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
  "places": [
    {
      "id": "place-slug-id",
      "name": "Place Name",
      "description": "2-3 sentence description with real details",
      "category": "Nature | Heritage | Adventure | Beach | Religious | Shopping | Food | Museum | Park | Viewpoint",
      "rating": 4.5,
      "recommendedDuration": "2-3 hours",
      "image": null,
      "location": "Specific area within the destination"
    }
  ]
}

Requirements:
- Include 6-10 real, popular tourist places
- Use REAL place names and accurate descriptions
- Categories must be from the list provided
- Ratings should be realistic (3.5-5.0)
- Recommended durations should be realistic`;

  const data = await generateJSON(prompt);
  setCache(cacheKey, data);
  return data;
}

/**
 * Get detailed information about a specific place including its attractions.
 */
export async function getPlaceDetails(placeId, destinationName) {
  const cacheKey = `place:${placeId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const name = placeId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const prompt = `You are an expert travel guide. Provide detailed information about the tourist place "${name}"${destinationName ? ` in ${destinationName}` : ''}.

RESPOND WITH ONLY valid JSON:
{
  "id": "${placeId}",
  "name": "${name}",
  "destination": "${destinationName || 'Unknown'}",
  "description": "4-5 sentence detailed description with specific real-world details",
  "category": "Nature | Heritage | Adventure | Beach | Religious | Shopping | Food | Museum | Park | Viewpoint",
  "rating": 4.5,
  "reviewCount": 1200,
  "recommendedDuration": "2-3 hours",
  "openingHours": "Opening hours if applicable, or 'Open 24 hours' for outdoor places",
  "entryFee": "Entry fee info or 'Free'",
  "location": "Specific address or area",
  "image": null,
  "tips": ["tip 1", "tip 2", "tip 3"],
  "thingsToDo": ["activity 1", "activity 2", "activity 3"],
  "attractions": [
    {
      "id": "attraction-slug-id",
      "name": "Attraction Name",
      "description": "1-2 sentence description",
      "category": "Viewpoint | Trail | Activity | Exhibit | Shopping | Food",
      "duration": "30-60 mins",
      "image": null
    }
  ]
}

Requirements:
- Include 3-6 real attractions/sub-places within this place
- All information must be factual and real
- Use real opening hours if known, or "Information not available"
- Use real entry fees if known, or "Information not available"`;

  const data = await generateJSON(prompt);
  setCache(cacheKey, data);
  return data;
}
