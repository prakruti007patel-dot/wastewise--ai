/**
 * WasteWise AI — Express Backend
 *
 * This server handles:
 * 1. Serving mock data as REST API endpoints
 * 2. Proxying AI requests to IBM Granite LLM (when configured)
 *
 * Configuration via environment variables (see .env.example in root)
 * IBM Cloud credentials are NEVER exposed to the frontend.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wardsRouter from './routes/wards';
import vehiclesRouter from './routes/vehicles';
import grievancesRouter from './routes/grievances';
import analyticsRouter from './routes/analytics';
import aiRouter from './routes/ai';
import notificationsRouter from './routes/notifications';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WasteWise AI API',
    version: '1.0.0',
    aiProvider: process.env.IBM_CLOUD_API_KEY ? 'IBM Granite (Active)' : 'Mock AI (Demo Mode)',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/wards', wardsRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/grievances', grievancesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/notifications', notificationsRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🌿 WasteWise AI Backend running at http://localhost:${PORT}`);
  console.log(`   AI Provider: ${process.env.IBM_CLOUD_API_KEY ? '✅ IBM Granite (IBM Cloud)' : '⚠️  Mock AI (Demo Mode)'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
