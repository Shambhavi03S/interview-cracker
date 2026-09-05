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
              Paste a job description and practice with an AI-generated mock interview
              tailored to the role. Get detailed feedback on your responses across
              content accuracy and communication clarity.
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
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                Ready to start the mock interview? You'll be asked one question at a time.
              </p>
              <button
                onClick={handleStartInterview}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition"
              >
                Begin Interview
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'interview' && interviewData && (
          <InterviewScreen
            interviewData={interviewData}
            onComplete={handleInterviewComplete}
          />
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
  );
}

export default App;
