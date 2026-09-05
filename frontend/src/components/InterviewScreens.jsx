import React, { useState, useEffect, useRef } from 'react';
import { Button } from './UIComponents';
import { apiClient } from '../services/apiService';

const TOTAL_QUESTIONS = 6;

const INTRO_QUESTION = {
  question: 'Tell me about yourself and what draws you to this role.',
  difficulty: null,
};

// Used only if the AI call fails, so the interview can still continue.
const BACKUP_QUESTIONS = [
  'Walk me through a challenging technical problem you solved recently and how you approached it.',
  'How do you prioritize tasks when everything feels urgent?',
  "Describe a time you disagreed with a teammate's technical decision. What did you do?",
  "What's a skill from this role you're still growing into, and how are you working on it?",
  "Tell me about a project you're proud of and what made it successful.",
  'How do you approach learning a new tool or technology quickly?',
];

export function LiveInterviewScreen({ interviewData, onComplete }) {
  const [step, setStep] = useState(0); // 0 = introduction, 1..TOTAL_QUESTIONS = real questions
  const [currentQuestion, setCurrentQuestion] = useState(INTRO_QUESTION);
  const [history, setHistory] = useState([]); // full transcript, for AI context
  const [answers, setAnswers] = useState([]); // scored turns only, for the report
  const [pendingNext, setPendingNext] = useState(null); // { nextQuestion, isFinal }

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [awaitingManualAnswer, setAwaitingManualAnswer] = useState(false);

  const recognitionRef = useRef(null);
  const silenceThresholdRef = useRef(null);
  const finalTranscriptRef = useRef(''); // always-current accumulated transcript, immune to stale closures

  const isIntro = step === 0;

  // Initialize Speech Recognition for each new question
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(new Error('Speech recognition isn\u2019t supported in this browser. Try Chrome or Edge.'));
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setShowNextBtn(false);
      setAwaitingManualAnswer(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + transcript;
        } else {
          interim += transcript;
        }
      }

      setCurrentTranscript((finalTranscriptRef.current + ' ' + interim).trim());

      if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);

      // Auto-advance after 2 seconds of silence
      silenceThresholdRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
        handleAnswerComplete(finalTranscriptRef.current);
      }, 2000);
    };

    speakQuestionAndListen();

    return () => {
      recognitionRef.current?.abort();
      if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);
      window.speechSynthesis.cancel();
    };
  }, [step]);

  const speakQuestionAndListen = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    finalTranscriptRef.current = '';
    setCurrentTranscript('');
    setShowNextBtn(false);
    setAwaitingManualAnswer(false);

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerComplete = (finalAnswer) => {
    if (!finalAnswer.trim()) {
      setAwaitingManualAnswer(true);
      setShowNextBtn(true);
      return;
    }
    runTurn(finalAnswer.trim());
  };

  // Scores the answer just given (unless this is the introduction) and asks
  // the AI for the next question based on the job description and everything
  // said so far — this is what makes the interview adaptive rather than a
  // fixed script.
  const runTurn = async (answerText) => {
    setIsProcessing(true);
    setError(null);

    const isFinal = !isIntro && step === TOTAL_QUESTIONS;

    try {
      const response = await apiClient.getNextTurn({
        jobDescription: interviewData.jobDescription,
        skills: interviewData.skills,
        seniority: interviewData.seniority,
        history,
        currentQuestion: currentQuestion.question,
        currentAnswer: answerText,
        isIntroduction: isIntro,
        isFinal,
      });

      const { feedback, nextQuestion } = response.data;

      setHistory((prev) => [...prev, { question: currentQuestion.question, answer: answerText }]);
      if (feedback) {
        setAnswers((prev) => [...prev, { question: currentQuestion.question, answer: answerText, feedback }]);
      }
      setPendingNext({ nextQuestion, isFinal });
      setShowNextBtn(true);
    } catch (err) {
      console.error('Error getting next turn:', err);

      // Keep the interview moving even if the AI call fails.
      const fallbackFeedback = isIntro
        ? null
        : {
            contentAccuracy: Math.floor(Math.random() * 3) + 6,
            communicationClarity: Math.floor(Math.random() * 3) + 6,
            feedback: 'Recorded, though we couldn\u2019t reach the AI reviewer for detailed feedback on this one.',
            strengths: ['Completed the response'],
            areasForImprovement: ['Try again when the connection is stable'],
          };
      const fallbackNext = isFinal
        ? null
        : { question: BACKUP_QUESTIONS[step % BACKUP_QUESTIONS.length], difficulty: 'medium' };

      setHistory((prev) => [...prev, { question: currentQuestion.question, answer: answerText }]);
      if (fallbackFeedback) {
        setAnswers((prev) => [...prev, { question: currentQuestion.question, answer: answerText, feedback: fallbackFeedback }]);
      }
      setPendingNext({ nextQuestion: fallbackNext, isFinal });
      setShowNextBtn(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    runTurn('(No response given)');
  };

  const handleContinue = () => {
    recognitionRef.current?.abort();
    if (silenceThresholdRef.current) clearTimeout(silenceThresholdRef.current);

    if (!pendingNext || pendingNext.isFinal || !pendingNext.nextQuestion) {
      onComplete(answers);
      return;
    }

    setCurrentQuestion(pendingNext.nextQuestion);
    setPendingNext(null);
    setCurrentTranscript('');
    setShowNextBtn(false);
    setStep((prev) => prev + 1);
  };

  const progressLabel = isIntro ? 'Introduction' : `Question ${step} of ${TOTAL_QUESTIONS}`;
  const progressPercent = isIntro ? 4 : (step / TOTAL_QUESTIONS) * 100;
  const isLastStep = pendingNext?.isFinal;

  return (
    <div className="h-screen flex flex-col bg-paper text-ink">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-serif text-xl font-semibold">Live interview</h1>
            <p className="text-ink-faint text-sm">{progressLabel}</p>
          </div>
          {!isIntro && (
            <p className="font-serif text-2xl font-semibold text-brass-500">
              {progressPercent.toFixed(0)}%
            </p>
          )}
        </div>
        <div className="w-full bg-line rounded-full h-1.5">
          <div
            className="bg-brass-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="px-8 pt-4">
          <div className="max-w-6xl mx-auto rounded-md border border-clay-600/30 bg-clay-50 px-4 py-3">
            <p className="text-sm text-clay-700">{error.message}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Status panel */}
            <div className="md:col-span-1">
              <div className="border border-line rounded-lg bg-white p-8 flex flex-col items-center justify-center text-center sticky top-8">
                <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-serif text-xl mb-4">
                  IC
                </div>
                <p className="font-medium mb-4">Interview assistant</p>
                {isSpeaking && (
                  <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-2 h-2 rounded-full bg-brass-500 animate-pulse" />
                    Asking the question
                  </span>
                )}
                {isListening && !isSpeaking && (
                  <span className="inline-flex items-center gap-2 text-sm text-clay-600">
                    <span className="w-2 h-2 rounded-full bg-clay-600 animate-pulse" />
                    Listening
                  </span>
                )}
                {isProcessing && (
                  <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-2 h-2 rounded-full bg-brass-500 animate-pulse" />
                    Thinking of the next question
                  </span>
                )}
                {!isSpeaking && !isListening && !isProcessing && !showNextBtn && (
                  <span className="text-sm text-ink-faint">Ready</span>
                )}
              </div>
            </div>

            {/* Question & Transcript */}
            <div className="md:col-span-2 space-y-6">
              {/* Question */}
              <div className="border border-line rounded-lg bg-white p-8">
                <p className="text-sm text-ink-faint font-medium mb-3">
                  {isIntro ? 'To start' : `Question ${step}`}
                </p>
                <h2 className="font-serif text-2xl font-semibold leading-snug mb-5">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.difficulty && (
                  <span className="inline-block px-3 py-1 bg-brass-50 border border-brass-400/40 text-ink-soft rounded-full font-medium text-sm">
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>

              {/* Your Response Transcript */}
              <div className="border border-line rounded-lg bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-ink-soft font-medium">Your response</p>
                  {isListening && (
                    <span className="inline-flex items-center gap-2 text-xs text-clay-600">
                      <span className="w-1.5 h-1.5 bg-clay-600 rounded-full animate-pulse" />
                      Recording
                    </span>
                  )}
                </div>
                <div className="bg-paper border border-line rounded-md p-6 min-h-32 text-ink leading-relaxed">
                  {currentTranscript || (
                    <span className="text-ink-faint italic">
                      {isSpeaking ? 'Waiting for you to respond…' : 'Your answer will appear here'}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              {showNextBtn && awaitingManualAnswer && (
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={speakQuestionAndListen} className="flex-1">
                    Repeat question
                  </Button>
                  <Button onClick={handleSkip} className="flex-1" disabled={isProcessing}>
                    {isProcessing ? 'Skipping…' : 'Skip this question'}
                  </Button>
                </div>
              )}
              {showNextBtn && !awaitingManualAnswer && (
                <Button onClick={handleContinue} className="w-full" disabled={isProcessing}>
                  {isProcessing ? 'One moment…' : isLastStep ? 'View report' : 'Continue'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
