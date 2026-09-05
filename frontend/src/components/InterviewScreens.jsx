import React, { useState, useEffect, useRef } from 'react';
import { ErrorAlert } from './UIComponents';

export function InterviewScreen({ interviewData, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  const currentQuestion = interviewData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewData.questions.length - 1;

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setMicActive(true);
      };

      recognitionRef.current.onend = () => {
        setMicActive(false);
      };

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setCurrentAnswer((prev) => prev + (prev ? ' ' : '') + transcript);
          } else {
            interim += transcript;
          }
        }
      };
    }

    // Speak the current question when it loads
    speakQuestion();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, [currentQuestionIndex]);

  const speakQuestion = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setCurrentAnswer('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!currentAnswer.trim()) {
      setError(new Error('Please provide an answer'));
      return;
    }

    setIsListening(false);
    recognitionRef.current?.stop();
    setIsLoading(true);
    setError(null);

    try {
      // Mock feedback
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Interview Session</h1>
            <p className="text-slate-400 text-sm">Question {currentQuestionIndex + 1} of {interviewData.questions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-400">
              {((currentQuestionIndex + 1) / interviewData.questions.length * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / interviewData.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {!showFeedback ? (
          <div className="h-full flex flex-col gap-6 p-8">
            {/* Interviewer Section */}
            <div className="flex-1 flex gap-8">
              {/* Interviewer Video/Avatar */}
              <div className="w-2/5 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl aspect-video flex items-center justify-center border-4 border-indigo-500 shadow-2xl relative overflow-hidden">
                  {/* AI Avatar Animation */}
                  <div className="text-center">
                    <div className="text-8xl mb-4 animate-bounce">🤖</div>
                    <p className="text-xl font-semibold text-white mb-4">Interview Assistant</p>
                    {isSpeaking && (
                      <div className="flex justify-center gap-1 h-6">
                        <div className="w-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Display */}
              <div className="w-3/5 flex flex-col justify-center">
                <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8">
                  <p className="text-slate-400 text-sm font-semibold mb-2">QUESTION {currentQuestionIndex + 1}</p>
                  <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                    {currentQuestion.question}
                  </h2>
                  <div className="flex gap-4">
                    <span className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold">
                      Difficulty: {currentQuestion.difficulty}
                    </span>
                    {isSpeaking && (
                      <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold animate-pulse">
                        🔊 Listening...
                      </span>
                    )}
                  </div>
                  <button
                    onClick={speakQuestion}
                    disabled={isSpeaking}
                    className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    🔊 Repeat Question
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate Response Section */}
            <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Response</h3>
                  <p className="text-slate-400 text-sm">Use your microphone or type your answer</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  micActive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                }`}>
                  🎤 {micActive ? 'Recording...' : 'Microphone Ready'}
                </div>
              </div>

              {error && !showFeedback && (
                <ErrorAlert error={error} onDismiss={() => setError(null)} />
              )}

              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Your response will appear here (speak or type)..."
                  className="w-full h-32 p-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none resize-none font-mono text-base leading-relaxed"
                  disabled={isLoading}
                />

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`flex-1 font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white disabled:opacity-50`}
                  >
                    🎤 {isListening ? 'Stop Recording' : 'Start Recording'}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading || currentQuestionIndex === 0}
                    onClick={() => {
                      setCurrentAnswer('');
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setShowFeedback(false);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition"
                  >
                    ← Previous
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isLoading ? '⏳ Evaluating...' : '✓ Submit Answer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Feedback Section */
          <div className="p-8">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 border-2 border-indigo-500 mb-6">
              <h3 className="text-3xl font-bold text-white mb-6">📊 Feedback</h3>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 rounded-xl p-6 border-2 border-green-500">
                  <p className="text-slate-300 text-sm font-semibold mb-2">CONTENT ACCURACY</p>
                  <div className="text-6xl font-bold text-green-400">{feedback.contentAccuracy}</div>
                  <p className="text-slate-400 text-xs mt-2">/10</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border-2 border-blue-500">
                  <p className="text-slate-300 text-sm font-semibold mb-2">COMMUNICATION CLARITY</p>
                  <div className="text-6xl font-bold text-blue-400">{feedback.communicationClarity}</div>
                  <p className="text-slate-400 text-xs mt-2">/10</p>
                </div>
              </div>

              <p className="text-white text-lg mb-6">{feedback.feedback}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-400 mb-3 text-lg">✓ Strengths</h4>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx} className="text-white flex items-center gap-2">
                        <span className="text-green-400">•</span> {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-orange-400 mb-3 text-lg">→ Areas to Improve</h4>
                  <ul className="space-y-2">
                    {feedback.areasForImprovement.map((area, idx) => (
                      <li key={idx} className="text-white flex items-center gap-2">
                        <span className="text-orange-400">•</span> {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition text-lg"
            >
              {isLastQuestion ? '📊 View Final Report' : 'Next Question →'}
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
