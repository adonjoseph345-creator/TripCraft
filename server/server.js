import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';

import searchRoutes from './routes/searchRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/destination', destinationRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 TripCraft API server running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Endpoints:`);
  console.log(`     GET  /api/search?q=...`);
  console.log(`     GET  /api/destination/:id`);
  console.log(`     GET  /api/place/:id`);
  console.log(`     POST /api/itinerary/generate`);
  console.log('');
});
