import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Analyzes a job description and generates interview questions
 * @param {string} jobDescription - The job description to analyze
 * @returns {Promise<Object>} Object containing skills, seniority, and interview questions
 */
export async function analyzeJobDescription(jobDescription) {
  if (!jobDescription || jobDescription.trim().length === 0) {
    throw new Error('Job description cannot be empty');
  }

  const prompt = `You are an expert technical interviewer. Analyze the following job description and:

1. Extract the top 5-7 key technical skills required
2. Determine the seniority level (Junior, Mid-level, Senior, or Lead)
3. Generate 5-6 thoughtful, role-specific interview questions that test these skills

Return your response as a valid JSON object with this exact structure:
{
  "skills": ["skill1", "skill2", ...],
  "seniority": "Mid-level",
  "questions": [
    {"question": "...", "difficulty": "medium"},
    ...
  ]
}

Job Description:
${jobDescription}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response (Gemini may wrap it in markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!parsed.skills || !Array.isArray(parsed.skills)) {
      throw new Error('Invalid response: missing skills array');
    }
    if (!parsed.seniority) {
      throw new Error('Invalid response: missing seniority level');
    }
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response: missing questions array');
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Evaluates an interview answer
 * @param {string} question - The interview question
 * @param {string} answer - The user's answer
 * @param {Array<string>} skills - Relevant skills for this question
 * @returns {Promise<Object>} Feedback on content accuracy and communication
 */
export async function evaluateAnswer(question, answer, skills) {
  if (!question || !answer) {
    throw new Error('Question and answer cannot be empty');
  }

  const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question: "${question}"
Candidate's Answer: "${answer}"
Relevant Skills: ${skills.join(', ')}

Evaluate the answer on two dimensions:
1. Content Accuracy: How technically correct and complete is the answer? (0-10)
2. Communication Clarity: How well is the answer articulated and explained? (0-10)

Provide constructive feedback and a brief summary of strengths and areas to improve.

Return your response as a valid JSON object with this exact structure:
{
  "contentAccuracy": 7,
  "communicationClarity": 8,
  "feedback": "Brief feedback here",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (typeof parsed.contentAccuracy !== 'number' || typeof parsed.communicationClarity !== 'number') {
      throw new Error('Invalid response: missing or invalid scores');
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
    throw error;
  }
}
