import React, { useState } from 'react';
import './App.css';
import { JDInputPortal, InterviewSummary } from './components/JDPortal';
import { LiveInterviewScreen } from './components/InterviewScreens';
import { FinalReportScreen } from './components/ReportScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [interviewData, setInterviewData] = useState(null);
  const [allAnswers, setAllAnswers] = useState(null);

  const handleJDSubmit = (data) => {
    setInterviewData(data);
    setCurrentScreen('interview-summary');
  };

  const handleStartInterview = () => {
    setCurrentScreen('interview');
  };

  const handleInterviewComplete = (answers) => {
    setAllAnswers(answers);
    setCurrentScreen('final-report');
  };

  const handleReset = () => {
    setInterviewData(null);
    setAllAnswers(null);
    setCurrentScreen('home');
  };

  return (
    <>
      {/* Full-screen Interview */}
      {currentScreen === 'interview' && interviewData && (
        <LiveInterviewScreen
          interviewData={interviewData}
          onComplete={handleInterviewComplete}
        />
      )}

      {/* Other Screens */}
      {currentScreen === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <nav className="border-b border-slate-700 px-6 py-6">
            <h1 className="text-4xl font-bold">Interview Cracker</h1>
            <p className="text-slate-400 text-sm mt-1">AI-Powered Mock Interview Platform</p>
          </nav>

          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Hero */}
              <div>
                <h2 className="text-5xl font-bold mb-6 leading-tight">
                  Practice Your <span className="text-indigo-400">Next Interview</span>
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Get real-time feedback on your technical knowledge and communication skills with our AI interview assistant.
                </p>
                <button
                  onClick={() => setCurrentScreen('jd-input')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
                >
                  Get Started →
                </button>
              </div>

              {/* Right Side - Features */}
              <div className="space-y-6">
                {[
                  { icon: '🎯', title: 'Role-Specific', desc: 'AI generates questions from your job description' },
                  { icon: '🎤', title: 'Voice Input', desc: 'Speak naturally just like a real interview' },
                  { icon: '📊', title: 'Instant Feedback', desc: 'Get scores and insights after each answer' },
                  { icon: '📈', title: 'Detailed Report', desc: 'Complete breakdown of your performance' },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition">
                    <p className="text-3xl mb-2">{feature.icon}</p>
                    <p className="font-bold text-white mb-2">{feature.title}</p>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'jd-input' && (
        <JDInputPortal
          onJDSubmit={handleJDSubmit}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'interview-summary' && interviewData && (
        <div className="relative">
          <button
            onClick={handleReset}
            className="absolute top-6 left-6 z-10 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back
          </button>
          <InterviewSummary
            data={interviewData}
            onStart={handleStartInterview}
          />
        </div>
      )}

      {currentScreen === 'final-report' && interviewData && allAnswers && (
        <FinalReportScreen
          allAnswers={allAnswers}
          interviewData={interviewData}
          onReset={handleReset}
        />
      )}
    </>
  );
}

export default App;
