import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Interview Cracker backend is running' });
});

// Placeholder endpoints (to be implemented)
app.post('/api/analyze-jd', (req, res) => {
  res.status(501).json({ message: 'Endpoint not yet implemented' });
});

app.post('/api/evaluate-answer', (req, res) => {
  res.status(501).json({ message: 'Endpoint not yet implemented' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Interview Cracker backend listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
