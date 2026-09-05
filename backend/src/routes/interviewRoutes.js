import express from 'express';
import { analyzeJobDescription } from '../services/anthropicService.js';

const router = express.Router();

/**
 * POST /api/interview/analyze-jd
 * Analyzes a job description and generates interview questions
 */
router.post('/analyze-jd', async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Job description is required',
      });
    }

    const result = await analyzeJobDescription(jobDescription);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
