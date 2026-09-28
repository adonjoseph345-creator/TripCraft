import express from 'express';
import { getPlaceDetails } from '../providers/placesProvider.js';
const router = express.Router();

/**
 * GET /api/place/:id?destination=...
 * Get detailed info for a specific place, including its attractions.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const destination = req.query.destination || '';
    const place = await getPlaceDetails(id, destination);
    res.json(place);
  } catch (error) {
    console.error('Place error:', error.message);
    res.status(500).json({ error: 'Failed to get place details', message: error.message });
  }
});

export default router;
