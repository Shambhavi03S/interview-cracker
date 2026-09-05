import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-600">Interview Cracker</h1>
          <p className="text-gray-600 text-sm">AI-Powered Mock Interview Platform</p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {currentScreen === 'home' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Interview Cracker
            </h2>
            <p className="text-gray-600 mb-8">
              Paste a job description and practice with an AI-generated mock interview
              tailored to your role.
            </p>
            <button
              onClick={() => setCurrentScreen('jd-input')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Start Interview
            </button>
          </div>
        )}

        {currentScreen === 'jd-input' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Paste Job Description
            </h2>
            <textarea
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Paste the job description here..."
            />
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setCurrentScreen('home')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Generate Interview
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
