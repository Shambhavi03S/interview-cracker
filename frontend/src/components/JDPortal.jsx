import React, { useState } from 'react';
import { ErrorAlert, Button } from './UIComponents';
import { apiClient } from '../services/apiService';

function PageHeader({ onBack, title, subtitle }) {
  return (
    <>
      <button
        onClick={onBack}
        className="mb-8 text-sm text-ink-faint hover:text-ink transition-colors"
      >
        Back
      </button>
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-semibold mb-3">{title}</h1>
        <p className="text-lg text-ink-soft">{subtitle}</p>
      </div>
    </>
  );
}

export function JDInputPortal({ onJDSubmit, onBack }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMethod, setInputMethod] = useState('paste'); // paste, file

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
      setError(new Error('Add a job description before continuing.'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.analyzeJobDescription(jobDescription);
      onJDSubmit({ ...result.data, jobDescription });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <PageHeader
          onBack={onBack}
          title="Prepare for your interview"
          subtitle="Paste the job description or upload it as a file."
        />

        {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Method Tabs */}
          <div className="flex gap-8 border-b border-line">
            {[
              { id: 'paste', label: 'Paste text' },
              { id: 'file', label: 'Upload file' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setInputMethod(method.id)}
                className={`pb-3 font-medium transition-colors border-b-2 -mb-px ${
                  inputMethod === method.id
                    ? 'border-ink text-ink'
                    : 'border-transparent text-ink-faint hover:text-ink-soft'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Paste Method */}
          {inputMethod === 'paste' && (
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-3">
                Job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Copy and paste the full job description here…"
                className="w-full h-64 p-4 bg-white border border-line rounded-md text-ink placeholder-ink-faint focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink resize-none"
                disabled={isLoading}
              />
            </div>
          )}

          {/* File Upload Method */}
          {inputMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-3">
                Upload a job description file
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
                  className="block w-full p-10 border border-dashed border-line rounded-md text-center cursor-pointer hover:border-ink/40 hover:bg-brass-50/40 transition-colors"
                >
                  <p className="text-ink-soft font-medium">Drag a file here, or click to browse</p>
                  <p className="text-sm text-ink-faint mt-1">PDF, TXT, DOC or DOCX</p>
                </label>
              </div>
              {jobDescription && (
                <div className="mt-4 p-4 bg-white border border-line rounded-md">
                  <p className="text-sm text-ink-faint mb-1">File content loaded</p>
                  <p className="text-ink-soft line-clamp-3">{jobDescription}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onBack} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !jobDescription.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                'Analyze and start'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InterviewSummary({ data, onStart, onBack }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 text-sm text-ink-faint hover:text-ink transition-colors"
          >
            Back
          </button>
        )}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-semibold mb-3">Ready when you are</h1>
          <p className="text-lg text-ink-soft max-w-prose">
            We won't show you the questions in advance — the interviewer asks
            them live, one at a time, adapting to what you say as you go.
          </p>
        </div>

        {/* Role & Skills */}
        <div className="mb-12">
          <div className="border border-line rounded-lg bg-white p-6 mb-6">
            <p className="text-sm text-ink-faint mb-2">Seniority level</p>
            <p className="font-serif text-3xl font-semibold">{data.seniority}</p>
          </div>
          <p className="text-sm text-ink-faint mb-3">Skills this interview will probe</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-brass-50 border border-brass-400/40 rounded-md text-ink-soft text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button onClick={onStart} className="w-full">
          Start live interview
        </Button>
      </div>
    </div>
  );
}
