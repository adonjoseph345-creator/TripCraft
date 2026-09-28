import express from 'express';
import { searchDestinations } from '../providers/placesProvider.js';
const router = express.Router();

/**
 * GET /api/search?q=...
 * Search for destinations matching a query string.
 */
router.get('/', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query || query.length < 2) {
      return res.json([]);
    }
    const results = await searchDestinations(query);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Failed to search destinations', message: error.message });
  }
});

export default router;
