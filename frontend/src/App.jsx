import React, { useState } from 'react';
import './App.css';
import { JDInputScreen, InterviewSummary, InterviewScreen } from './components/InterviewScreens';
import { FinalReportScreen } from './components/ReportScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [interviewData, setInterviewData] = useState(null);
  const [allAnswers, setAllAnswers] = useState(null);

  const handleJDSubmit = (data) => {
    setInterviewData(data);
    setCurrentScreen('interview-ready');
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
      {/* Interview Screen - Full Screen */}
      {currentScreen === 'interview' && interviewData && (
        <InterviewScreen
          interviewData={interviewData}
          onComplete={handleInterviewComplete}
        />
      )}

      {/* Other Screens with Normal Layout */}
      {currentScreen !== 'interview' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-indigo-600">Interview Cracker</h1>
                <p className="text-gray-600 text-sm">AI-Powered Mock Interview Platform</p>
              </div>
              {currentScreen !== 'home' && (
                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
                >
                  ← Back to Home
                </button>
              )}
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-6">
            {currentScreen === 'home' && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome to Interview Cracker
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Paste a job description and practice with an AI-powered video interview
                  tailored to the role. Get real-time feedback on your responses and build
                  confidence for your actual interviews.
                </p>
                <button
                  onClick={() => setCurrentScreen('jd-input')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition"
                >
                  Start Interview
                </button>
              </div>
            )}

            {currentScreen === 'jd-input' && (
              <JDInputScreen
                onJDSubmit={handleJDSubmit}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'interview-ready' && interviewData && (
              <div className="space-y-6">
                <InterviewSummary data={interviewData} />
                <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-indigo-200">
                  <p className="text-gray-600 mb-6 text-lg">
                    You're about to enter a live video interview with our AI interviewer. 
                    Make sure your microphone and speaker are working properly.
                  </p>
                  <div className="flex gap-4 justify-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Microphone ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Speaker ready</span>
                    </div>
                  </div>
                  <button
                    onClick={handleStartInterview}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition inline-block"
                  >
                    🎬 Start Live Interview
                  </button>
                </div>
              </div>
            )}

            {currentScreen === 'final-report' && interviewData && allAnswers && (
              <FinalReportScreen
                allAnswers={allAnswers}
                interviewData={interviewData}
                onReset={handleReset}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
