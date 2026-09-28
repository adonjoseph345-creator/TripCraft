import express from 'express';
import { generateJSON } from '../providers/aiProvider.js';
const router = express.Router();

/**
 * POST /api/itinerary/generate
 * Generate a day-by-day itinerary from user-selected places and preferences.
 * The AI uses ONLY the places/attractions the user has selected.
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      destination,
      selectedPlaces,
      selectedAttractions,
      startDate,
      endDate,
      travelers,
      budget,
      interests,
    } = req.body;

    if (!destination || !selectedPlaces || selectedPlaces.length === 0) {
      return res.status(400).json({ error: 'Destination and at least one selected place are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const numNights = Math.max(0, numDays - 1);

    // Build the list of selected items for the prompt
    const placesText = selectedPlaces.map(p => `- ${p.name}: ${p.description || ''}`).join('\n');
    const attractionsText = selectedAttractions && selectedAttractions.length > 0
      ? selectedAttractions.map(a => `- ${a.name} (at ${a.parentPlace || 'unknown'}): ${a.description || ''}`).join('\n')
      : 'No specific attractions selected.';

    const budgetLabels = {
      budget: 'Budget-friendly (₹5,000–15,000)',
      mid: 'Mid-range (₹15,000–40,000)',
      premium: 'Premium (₹40,000–1,00,000)',
      luxury: 'Luxury (₹1,00,000+)',
    };

    const prompt = `You are an expert trip planner. Create a detailed ${numDays}-day / ${numNights}-night itinerary for a trip to ${destination}.

TRAVEL DATES: ${startDate} to ${endDate} (${numDays} days, ${numNights} nights)
TRAVELERS: ${travelers || 2}
BUDGET: ${budgetLabels[budget] || 'Mid-range'}
INTERESTS: ${interests && interests.length > 0 ? interests.join(', ') : 'General sightseeing'}

THE USER HAS SELECTED THESE SPECIFIC PLACES (use ONLY these):
${placesText}

SELECTED ATTRACTIONS/SUB-PLACES:
${attractionsText}

CRITICAL RULES:
1. ONLY include places and attractions from the lists above. Do NOT add unselected places.
2. Distribute the selected places logically across ${numDays} days.
3. Consider travel time between locations.
4. Avoid unnecessary backtracking.
5. Include realistic timings.
6. Match the budget level for recommendations.
7. Use actual dates starting from ${startDate}.

RESPOND WITH ONLY valid JSON:
{
  "destination": "${destination}",
  "totalDays": ${numDays},
  "totalNights": ${numNights},
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Descriptive Day Title",
      "location": "Primary area for this day",
      "activities": [
        {
          "time": "9:00 AM",
          "name": "Activity Name",
          "description": "2-3 sentence description",
          "type": "sightseeing | food | travel | shopping | adventure",
          "duration": "2 hours",
          "place": "Parent place name"
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
  },
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

    const itinerary = await generateJSON(prompt);
    res.json(itinerary);
  } catch (error) {
    console.error('Itinerary error:', error.message);
    res.status(500).json({ error: 'Failed to generate itinerary', message: error.message });
  }
});

export default router;
