import express from 'express';
import { getDestinationDetails } from '../providers/placesProvider.js';
const router = express.Router();

/**
 * GET /api/destination/:id
 * Get full details for a destination including its tourist places.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await getDestinationDetails(id);
    res.json(destination);
  } catch (error) {
    console.error('Destination error:', error.message);
    res.status(500).json({ error: 'Failed to get destination details', message: error.message });
  }
});

export default router;
