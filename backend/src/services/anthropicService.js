import Groq from 'groq-sdk';

let groq;

function getClient() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

const MODEL = 'openai/gpt-oss-120b';

/**
 * Helper: extract the first valid JSON object from the model's text response
 */
function extractJSON(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse model response as JSON');
  }
  return JSON.parse(jsonMatch[0]);
}

/**
 * Analyzes a job description to extract the skills and seniority level used to
 * steer the live, dynamically-generated interview. This no longer generates a
 * fixed question list — questions are produced turn by turn as the candidate answers.
 * @param {string} jobDescription - The job description to analyze
 * @returns {Promise<Object>} Object containing skills and seniority
 */
export async function analyzeJobDescription(jobDescription) {
  if (!jobDescription || jobDescription.trim().length === 0) {
    throw new Error('Job description cannot be empty');
  }

  const prompt = `You are an expert technical interviewer. Analyze the following job description and:

1. Extract the top 5-7 key skills required (technical and non-technical)
2. Determine the seniority level (Junior, Mid-level, Senior, or Lead)

Return ONLY a valid JSON object with this exact structure, and nothing else (no markdown, no preamble):
{
  "skills": ["skill1", "skill2", ...],
  "seniority": "Mid-level"
}

Job Description:
${jobDescription}`;

  try {
    const response = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 500,
    });

    const responseText = response.choices[0].message.content;
    const parsed = extractJSON(responseText);

    if (!parsed.skills || !Array.isArray(parsed.skills)) {
      throw new Error('Invalid response: missing skills array');
    }
    if (!parsed.seniority) {
      throw new Error('Invalid response: missing seniority level');
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse model response: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Dynamically generates the next interview question based on the job
 * description and everything the candidate has said so far, so the
 * interview adapts turn by turn instead of following a fixed script.
 * @param {string} jobDescription - The job description for this interview
 * @param {Array<string>} skills - Key skills to probe
 * @param {string} seniority - Seniority level, used to calibrate depth
 * @param {Array<{question: string, answer: string}>} transcript - Full conversation so far, including the turn just answered
 * @returns {Promise<Object>} The next question and its difficulty
 */
export async function generateNextQuestion(jobDescription, skills, seniority, transcript) {
  if (!jobDescription || jobDescription.trim().length === 0) {
    throw new Error('Job description cannot be empty');
  }

  const conversation = transcript
    .map((turn, idx) => `Turn ${idx + 1}\nInterviewer: ${turn.question}\nCandidate: ${turn.answer}`)
    .join('\n\n');

  const prompt = `You are conducting a live, adaptive interview for the role described below. Ask one question at a time, the way a thoughtful human interviewer would, adjusting based on what the candidate has already said.

Job description:
"""
${jobDescription}
"""

Key skills to probe: ${skills.join(', ')}
Seniority level: ${seniority}

Conversation so far:
${conversation}

Ask the single best next interview question. It should:
- Build on something specific the candidate just said, or open up a skill area from the job description that hasn't been explored yet
- Match the depth expected for the seniority level
- Never repeat a topic already covered
- Be answerable out loud in under two minutes

Return ONLY a valid JSON object with this exact structure, and nothing else (no markdown, no preamble):
{"question": "...", "difficulty": "easy"}

difficulty must be one of: easy, medium, hard.`;

  try {
    const response = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
    });

    const responseText = response.choices[0].message.content;
    const parsed = extractJSON(responseText);

    if (!parsed.question || typeof parsed.question !== 'string') {
      throw new Error('Invalid response: missing question');
    }

    return {
      question: parsed.question,
      difficulty: parsed.difficulty || 'medium',
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse model response: ${error.message}`);
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

Return ONLY a valid JSON object with this exact structure, and nothing else (no markdown, no preamble):
{
  "contentAccuracy": 7,
  "communicationClarity": 8,
  "feedback": "Brief feedback here",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"]
}`;

  try {
    const response = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 800,
    });

    const responseText = response.choices[0].message.content;
    const parsed = extractJSON(responseText);

    if (typeof parsed.contentAccuracy !== 'number' || typeof parsed.communicationClarity !== 'number') {
      throw new Error('Invalid response: missing or invalid scores');
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse model response: ${error.message}`);
    }
    throw error;
  }
}
