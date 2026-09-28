/**
 * Gemini API Service for generating AI-powered travel itineraries.
 * Calls Google's Gemini API to create destination-specific, rich itineraries
 * for any place the user searches for.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

/**
 * Builds the prompt that instructs Gemini to generate a structured itinerary.
 */
function buildPrompt(destination, numDays, budget, travelers) {
  const budgetDescriptions = {
    budget: 'Budget-friendly (₹5,000–15,000 total). Prefer hostels, street food, public transport.',
    mid: 'Mid-range (₹15,000–40,000 total). Comfortable hotels, good restaurants, mix of transport.',
    premium: 'Premium (₹40,000–1,00,000 total). Upscale hotels, fine dining, private transport.',
    luxury: 'Luxury (₹1,00,000+ total). 5-star resorts, gourmet dining, premium experiences.',
  };

  const budgetContext = budgetDescriptions[budget] || 'Mid-range budget.';
  const travelerCount = travelers ? parseInt(travelers) : 2;

  return `You are an expert travel planner. Generate a detailed ${numDays}-day travel itinerary for "${destination}".

CONTEXT:
- Number of travelers: ${travelerCount}
- Budget level: ${budgetContext}
- Duration: ${numDays} days

REQUIREMENTS:
1. Use REAL, ACTUAL places, landmarks, restaurants, and attractions that exist in "${destination}".
2. Include specific timings for each activity.
3. Each day should have 4-5 activities with realistic scheduling.
4. Include a mix of sightseeing, food/dining, and travel/transport activities.
5. Provide estimated expenses in Indian Rupees (₹) appropriate for the budget level.
6. Make the tagline creative and evocative of the destination.
7. Day titles should be descriptive and thematic.

RESPOND WITH ONLY valid JSON (no markdown, no code fences, no explanation) in this EXACT structure:
{
  "destination": "Full destination name",
  "tagline": "A short, evocative tagline for this destination",
  "days": [
    {
      "day": 1,
      "title": "Descriptive Day Title",
      "location": "Specific area/neighborhood",
      "activities": [
        {
          "time": "9:00 AM",
          "name": "Activity Name (use real place names)",
          "description": "2-3 sentence vivid description of what to do here, including specific details about the place.",
          "type": "sightseeing | food | travel"
        }
      ]
    }
  ],
  "expenses": {
    "accommodation": <number in INR>,
    "transport": <number in INR>,
    "food": <number in INR>,
    "activities": <number in INR>,
    "miscellaneous": <number in INR>
  }
}

IMPORTANT: 
- expenses should be TOTAL for all ${numDays} days and ${travelerCount} travelers combined.
- Use ONLY "sightseeing", "food", or "travel" for the activity type field.
- Return ONLY the JSON object, nothing else.`;
}

/**
 * Calls the Gemini API to generate an itinerary.
 * @param {string} destination - The travel destination
 * @param {number} numDays - Number of days for the trip
 * @param {string} budget - Budget level (budget/mid/premium/luxury)
 * @param {string} travelers - Number of travelers
 * @returns {Promise<Object>} The generated itinerary object
 */
export async function generateItinerary(destination, numDays, budget, travelers) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY_NOT_SET');
  }

  const prompt = buildPrompt(destination, numDays, budget, travelers);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API request failed with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();

  // Extract the text content from Gemini's response
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('No content received from Gemini API');
  }

  // Parse the JSON from the response (handle potential markdown code fences)
  let jsonStr = textContent.trim();
  
  // Remove markdown code fences if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  let itinerary;
  try {
    itinerary = JSON.parse(jsonStr);
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', textContent);
    throw new Error('Failed to parse itinerary data from AI response');
  }

  // Validate the response structure
  if (!itinerary.destination || !itinerary.days || !itinerary.expenses) {
    throw new Error('Invalid itinerary structure received from AI');
  }

  return itinerary;
}
