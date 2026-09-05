import express from 'express';
import { analyzeJobDescription, evaluateAnswer, generateNextQuestion } from '../services/anthropicService.js';

const router = express.Router();

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

/**
 * POST /api/interview/next-turn
 * Takes the answer the candidate just gave, scores it (unless it was the
 * opening introduction), and — unless this was the final question — asks the
 * AI to generate the next question based on the job description and the
 * full conversation so far. This is what makes the interview dynamic instead
 * of stepping through a fixed list.
 */
router.post('/next-turn', async (req, res, next) => {
  try {
    const {
      jobDescription,
      skills,
      seniority,
      history,
      currentQuestion,
      currentAnswer,
      isIntroduction,
      isFinal,
    } = req.body;

    if (!currentQuestion || !currentAnswer) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'currentQuestion and currentAnswer are required',
      });
    }

    if (!isIntroduction && !jobDescription) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'jobDescription is required to generate the next question',
      });
    }

    const skillsArray = Array.isArray(skills) ? skills : [];
    const priorHistory = Array.isArray(history) ? history : [];

    let feedback = null;
    if (!isIntroduction) {
      feedback = await evaluateAnswer(currentQuestion, currentAnswer, skillsArray);
    }

    let nextQuestion = null;
    if (!isFinal) {
      const transcript = [...priorHistory, { question: currentQuestion, answer: currentAnswer }];
      nextQuestion = await generateNextQuestion(jobDescription, skillsArray, seniority, transcript);
    }

    res.json({
      success: true,
      data: { feedback, nextQuestion },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/interview/analyze-jd
 * Analyzes a job description and extracts the skills and seniority level
 * used to steer the live, dynamically-generated interview.
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