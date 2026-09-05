import express from 'express';
import { analyzeJobDescription, evaluateAnswer } from '../services/anthropicService.js';

/**
 * POST /api/interview/evaluate-answer
 * Evaluates an interview answer and provides feedback
 */
router.post('/evaluate-answer', async (req, res, next) => {
  try {
    const { question, answer, skills } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Question and answer are required',
      });
    }

    const skillsArray = Array.isArray(skills) ? skills : [];
    const result = await evaluateAnswer(question, answer, skillsArray);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

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
