import React, { useState } from 'react';
import { Loading, ErrorAlert } from './UIComponents';
import { apiClient } from '../services/apiService';

export function InterviewScreen({ interviewData, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = interviewData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewData.questions.length - 1;

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!currentAnswer.trim()) {
      setError(new Error('Please provide an answer'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when Gemini key is fixed
      // const result = await apiClient.evaluateAnswer(
      //   currentQuestion.question,
      //   currentAnswer,
      //   interviewData.skills
      // );

      // Mock feedback for now
      const mockFeedback = {
        contentAccuracy: Math.floor(Math.random() * 3) + 7,
        communicationClarity: Math.floor(Math.random() * 3) + 6,
        feedback: 'Good response with technical depth. Could improve on clarity.',
        strengths: ['Technical knowledge', 'Problem-solving approach'],
        areasForImprovement: ['Clarity of explanation', 'Time management'],
      };

      setFeedback(mockFeedback);
      setAnswers([
        ...answers,
        {
          question: currentQuestion.question,
          answer: currentAnswer,
          feedback: mockFeedback,
        },
      ]);
      setShowFeedback(true);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentAnswer('');
      setShowFeedback(false);
      setFeedback(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Question {currentQuestionIndex + 1} of {interviewData.questions.length}
          </span>
          <span className="text-xs text-gray-500">
            {((currentQuestionIndex + 1) / interviewData.questions.length * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / interviewData.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            Difficulty: {currentQuestion.difficulty}
          </span>
        </div>

        {error && !showFeedback && (
          <ErrorAlert error={error} onDismiss={() => setError(null)} />
        )}

        {!showFeedback ? (
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here... Be clear and concise."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                disabled={isLoading || currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentAnswer('');
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }}
                className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-bold py-2 px-6 rounded-lg transition"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">📊 Feedback</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Content Accuracy</p>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-indigo-600">
                    {feedback.contentAccuracy}
                  </div>
                  <span className="text-sm text-gray-500">/10</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Communication</p>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-indigo-600">
                    {feedback.communicationClarity}
                  </div>
                  <span className="text-sm text-gray-500">/10</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{feedback.feedback}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">✓ Strengths</h4>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">→ Areas to Improve</h4>
                <ul className="space-y-1">
                  {feedback.areasForImprovement.map((area, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      • {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
            >
              {isLastQuestion ? 'View Final Report' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function JDInputScreen({ onJDSubmit, onBack }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      setError(new Error('Please enter a job description'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when Gemini key is fixed
      // const result = await apiClient.analyzeJobDescription(jobDescription);
      // onJDSubmit(result.data);

      // Mock data for now
      const mockData = {
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Problem Solving'],
        seniority: 'Mid-level',
        questions: [
          { question: 'Describe your experience building React applications and the challenges you faced.', difficulty: 'medium' },
          { question: 'How would you optimize a React component for performance?', difficulty: 'medium' },
          { question: 'Explain the concept of closures in JavaScript and provide a real-world example.', difficulty: 'hard' },
          { question: 'Describe your experience with backend development and API design.', difficulty: 'medium' },
          { question: 'How do you approach debugging a production issue in a Node.js application?', difficulty: 'hard' },
          { question: 'Tell us about a time you worked on a complex project. What was your role and what did you learn?', difficulty: 'medium' },
        ],
      };

      onJDSubmit(mockData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Paste Job Description</h2>
      <p className="text-gray-600 mb-6">
        Paste the job description below. We'll analyze it and generate tailored interview questions.
      </p>

      {error && (
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
          disabled={isLoading}
        />

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Analyzing...
              </>
            ) : (
              'Generate Interview'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function InterviewSummary({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Seniority */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Seniority Level</h3>
          <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-lg font-bold">
            {data.seniority}
          </div>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Interview Questions</h3>
        <div className="space-y-4">
          {data.questions.map((q, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-600">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-gray-800 font-semibold">Q{idx + 1}: {q.question}</p>
                </div>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {q.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
