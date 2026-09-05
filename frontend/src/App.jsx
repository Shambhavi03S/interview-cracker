import React, { useState } from 'react';
import './App.css';
import { JDInputScreen, InterviewSummary } from './components/InterviewScreens';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [interviewData, setInterviewData] = useState(null);

  const handleJDSubmit = (data) => {
    setInterviewData(data);
    setCurrentScreen('interview-ready');
  };

  const handleStartInterview = () => {
    setCurrentScreen('interview');
  };

  const handleReset = () => {
    setInterviewData(null);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">Interview Cracker</h1>
            <p className="text-gray-600 text-sm">AI-Powered Mock Interview Platform</p>
          </div>
          {currentScreen !== 'home' && (
            <button
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800 text-sm font-semibold"
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

        {currentScreen === 'interview' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Interview screen coming soon...</p>
            <button
              onClick={() => setCurrentScreen('interview-ready')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
            >
              Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
