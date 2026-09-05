import React, { useState } from 'react';
import { Loading, ErrorAlert } from './UIComponents';
import { apiClient } from '../services/apiService';

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
      const result = await apiClient.analyzeJobDescription(jobDescription);
      onJDSubmit(result.data);
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
