import React, { useState } from 'react';
import { ErrorAlert } from './UIComponents';

export function JDInputPortal({ onJDSubmit, onBack }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMethod, setInputMethod] = useState('paste'); // paste, file, url

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setJobDescription(text);
        }
      } catch (err) {
        setError(new Error('Failed to read file'));
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError(new Error('Please provide a job description'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock data
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="mb-8 text-slate-400 hover:text-white transition flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Prepare for Your Interview</h1>
          <p className="text-xl text-slate-300">Upload or paste the job description to get started</p>
        </div>

        {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Method Tabs */}
          <div className="flex gap-4 border-b border-slate-700">
            {[
              { id: 'paste', label: '📋 Paste Text', icon: '📋' },
              { id: 'file', label: '📄 Upload File', icon: '📄' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setInputMethod(method.id)}
                className={`pb-4 px-4 font-semibold transition border-b-2 ${
                  inputMethod === method.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Paste Method */}
          {inputMethod === 'paste' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Copy and paste the full job description here..."
                className="w-full h-64 p-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                disabled={isLoading}
              />
            </div>
          )}

          {/* File Upload Method */}
          {inputMethod === 'file' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Upload JD File (PDF or TXT)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full p-8 border-2 border-dashed border-slate-600 rounded-xl text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-700 transition"
                >
                  <p className="text-3xl mb-2">📁</p>
                  <p className="text-slate-300">Drag and drop your file or click to browse</p>
                  <p className="text-xs text-slate-500 mt-2">PDF, TXT, DOC, DOCX</p>
                </label>
              </div>
              {jobDescription && (
                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-400">File content loaded:</p>
                  <p className="text-slate-200 line-clamp-3 mt-2">{jobDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !jobDescription.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analyzing...
                </>
              ) : (
                '✓ Analyze JD & Start'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InterviewSummary({ data, onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Interview Overview</h1>
          <p className="text-xl text-slate-300">Here's what we'll be discussing today</p>
        </div>

        {/* Role & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-8 border border-indigo-700">
            <h3 className="text-sm font-semibold text-indigo-300 mb-2">SENIORITY LEVEL</h3>
            <p className="text-4xl font-bold text-white">{data.seniority}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-8 border border-purple-700">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">QUESTIONS</h3>
            <p className="text-4xl font-bold text-white">{data.questions.length}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Required Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 font-semibold hover:bg-indigo-600 hover:border-indigo-500 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Questions Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Interview Questions</h2>
          <div className="space-y-3">
            {data.questions.map((q, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-indigo-400 font-semibold mb-2">QUESTION {idx + 1}</p>
                    <p className="text-white text-lg">{q.question}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full whitespace-nowrap">
                    {q.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition text-lg"
        >
          🎬 Start Live Interview
        </button>
      </div>
    </div>
  );
}
