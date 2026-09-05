import React, { useState, useEffect, useRef } from 'react';
import { ErrorAlert } from './UIComponents';

export function LiveInterviewScreen({ interviewData, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(null);

  const recognitionRef = useRef(null);
  const silenceThresholdRef = useRef(null);

  const currentQuestion = interviewData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewData.questions.length - 1;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(new Error('Speech Recognition not supported in your browser'));
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setShowNextBtn(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let finalText = currentTranscript;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += (finalText ? ' ' : '') + transcript;
        } else {
          interim += transcript;
        }
      }

      setCurrentTranscript(finalText + interim);

      // Clear previous silence timer
      if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);

      // Set new silence timer - auto-advance after 2 seconds of silence
      silenceThresholdRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
        handleAnswerComplete(finalText);
      }, 2000);
    };

    // Start listening immediately
    speakQuestionAndListen();

    return () => {
      recognitionRef.current?.abort();
      if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentQuestionIndex]);

  const speakQuestionAndListen = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setCurrentTranscript('');
    setShowNextBtn(false);

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      // Small delay before starting to listen
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerComplete = (finalAnswer) => {
    if (!finalAnswer.trim()) {
      setShowNextBtn(true);
      return;
    }

    // Mock feedback
    const mockFeedback = {
      contentAccuracy: Math.floor(Math.random() * 3) + 7,
      communicationClarity: Math.floor(Math.random() * 3) + 6,
      feedback: 'Good response with technical depth.',
      strengths: ['Technical knowledge', 'Problem-solving'],
      areasForImprovement: ['Clarity', 'Conciseness'],
    };

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        answer: finalAnswer,
        feedback: mockFeedback,
      },
    ]);

    setShowNextBtn(true);
  };

  const handleNextQuestion = () => {
    recognitionRef.current?.abort();
    if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentTranscript('');
      setShowNextBtn(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Live Interview</h1>
            <p className="text-slate-400 text-sm">
              Question {currentQuestionIndex + 1} of {interviewData.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-400">
              {((currentQuestionIndex + 1) / interviewData.questions.length * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / interviewData.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Interviewer & Question */}
          <div className="grid grid-cols-3 gap-8">
            {/* AI Avatar */}
            <div className="col-span-1">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl aspect-square flex flex-col items-center justify-center border-4 border-indigo-500 shadow-2xl sticky top-8">
                <div className="text-center">
                  <div className="text-8xl mb-4">🤖</div>
                  <p className="text-white font-semibold">Interview Assistant</p>
                  {isSpeaking && (
                    <div className="flex justify-center gap-1 h-6 mt-4">
                      <div className="w-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question & Transcript */}
            <div className="col-span-2 space-y-6">
              {/* Question */}
              <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8">
                <p className="text-slate-400 text-sm font-semibold mb-4">QUESTION {currentQuestionIndex + 1}</p>
                <h2 className="text-3xl font-bold text-white leading-tight mb-6">
                  {currentQuestion.question}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm">
                    {currentQuestion.difficulty}
                  </span>
                  {isSpeaking && (
                    <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm animate-pulse">
                      🔊 AI Speaking...
                    </span>
                  )}
                  {isListening && !isSpeaking && (
                    <span className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold text-sm animate-pulse">
                      🎤 Listening...
                    </span>
                  )}
                </div>
              </div>

              {/* Your Response Transcript */}
              <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-300 font-semibold">Your Response</p>
                  {isListening && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-400">Recording</span>
                    </div>
                  )}
                </div>
                <div className="bg-slate-700 rounded-xl p-6 min-h-32 text-white text-lg leading-relaxed">
                  {currentTranscript || (
                    <span className="text-slate-400 italic">
                      {isSpeaking ? 'Waiting for you to respond...' : 'Your answer will appear here'}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              {showNextBtn && (
                <div className="flex gap-4">
                  <button
                    onClick={speakQuestionAndListen}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    🔊 Repeat Question
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    {isLastQuestion ? '📊 View Report' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
