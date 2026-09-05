import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { errorHandler, validateJSON } from './middleware/errorHandler.js';
import interviewRoutes from './routes/interviewRoutes.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Validate required environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY is not set in .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(validateJSON);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Interview Cracker backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Interview routes
app.use('/api/interview', interviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} does not exist`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Interview Cracker Backend            ║
║   Listening on http://localhost:${PORT}    ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════╝
  `);
});
