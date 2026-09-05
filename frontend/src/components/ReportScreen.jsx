import React from 'react';
import { Button } from './UIComponents';

export function FinalReportScreen({ allAnswers, interviewData, onReset }) {
  // Calculate overall scores
  const avgContentAccuracy = (
    allAnswers.reduce((sum, a) => sum + a.feedback.contentAccuracy, 0) / allAnswers.length
  ).toFixed(1);

  const avgCommunication = (
    allAnswers.reduce((sum, a) => sum + a.feedback.communicationClarity, 0) / allAnswers.length
  ).toFixed(1);

  // Aggregate strengths and areas
  const allStrengths = new Set();
  const allAreas = new Set();
  allAnswers.forEach((a) => {
    a.feedback.strengths.forEach((s) => allStrengths.add(s));
    a.feedback.areasForImprovement.forEach((area) => allAreas.add(area));
  });

  const getPerformanceLevel = (score) => {
    if (score >= 8) return { text: 'Excellent', color: 'text-moss-700' };
    if (score >= 6) return { text: 'Good', color: 'text-brass-600' };
    return { text: 'Needs work', color: 'text-clay-700' };
  };

  const contentLevel = getPerformanceLevel(avgContentAccuracy);
  const commLevel = getPerformanceLevel(avgCommunication);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl font-semibold mb-3">Your interview report</h1>
          <p className="text-lg text-ink-soft">A full breakdown of how you answered each question.</p>
        </div>

        {/* Overall Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-line rounded-lg bg-white p-8">
            <p className="text-sm text-ink-faint mb-3">Content accuracy</p>
            <div className="flex items-end gap-3 mb-2">
              <div className="font-serif text-5xl font-semibold">{avgContentAccuracy}</div>
              <span className="text-ink-faint mb-1.5">/10</span>
            </div>
            <p className={`font-medium ${contentLevel.color}`}>{contentLevel.text}</p>
          </div>

          <div className="border border-line rounded-lg bg-white p-8">
            <p className="text-sm text-ink-faint mb-3">Communication clarity</p>
            <div className="flex items-end gap-3 mb-2">
              <div className="font-serif text-5xl font-semibold">{avgCommunication}</div>
              <span className="text-ink-faint mb-1.5">/10</span>
            </div>
            <p className={`font-medium ${commLevel.color}`}>{commLevel.text}</p>
          </div>
        </div>

        {/* Role Summary */}
        <div className="border border-line rounded-lg bg-white p-8">
          <h2 className="text-lg font-semibold mb-4">Role: {interviewData.seniority}</h2>
          <p className="text-sm text-ink-faint mb-3">Required skills</p>
          <div className="flex flex-wrap gap-2">
            {interviewData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-brass-50 border border-brass-400/40 rounded-md text-ink-soft text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Question Breakdown */}
        <div>
          <h2 className="text-lg font-semibold mb-6">Question breakdown</h2>
          <div className="divide-y divide-line border-t border-b border-line">
            {allAnswers.map((answer, idx) => (
              <div key={idx} className="py-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <p className="font-medium max-w-prose">
                    <span className="text-ink-faint font-serif mr-2">{String(idx + 1).padStart(2, '0')}</span>
                    {answer.question}
                  </p>
                  <div className="flex gap-6 whitespace-nowrap text-right">
                    <div>
                      <p className="text-xs text-ink-faint">Content</p>
                      <p className="font-serif text-lg font-semibold text-brass-500">
                        {answer.feedback.contentAccuracy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-faint">Clarity</p>
                      <p className="font-serif text-lg font-semibold text-brass-500">
                        {answer.feedback.communicationClarity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-line rounded-md p-4 mb-4">
                  <p className="text-sm text-ink-soft italic">{answer.answer}</p>
                </div>

                <p className="text-sm text-ink-soft mb-4">{answer.feedback.feedback}</p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-moss-700 mb-2">Strengths</p>
                    <ul className="text-sm text-ink-soft space-y-1">
                      {answer.feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-clay-700 mb-2">To improve</p>
                    <ul className="text-sm text-ink-soft space-y-1">
                      {answer.feedback.areasForImprovement.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Strengths & Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-line rounded-lg bg-white p-8">
            <h3 className="font-semibold text-moss-700 mb-4">Key strengths</h3>
            <ul className="space-y-2">
              {Array.from(allStrengths).map((strength, idx) => (
                <li key={idx} className="text-ink-soft text-sm">{strength}</li>
              ))}
            </ul>
          </div>

          <div className="border border-line rounded-lg bg-white p-8">
            <h3 className="font-semibold text-clay-700 mb-4">Areas to develop</h3>
            <ul className="space-y-2">
              {Array.from(allAreas).map((area, idx) => (
                <li key={idx} className="text-ink-soft text-sm">{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="border border-line rounded-lg bg-white p-8">
          <h3 className="font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>Practice explaining technical concepts in plain language to sharpen communication clarity.</li>
            <li>Keep deepening your knowledge in the key skills this role calls for.</li>
            <li>Time your answers so you can be thorough within a realistic interview pace.</li>
            <li>Run another mock interview in a week or two to track your progress.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={onReset} className="flex-1">
            Start another interview
          </Button>
          <Button variant="secondary" onClick={() => window.print()} className="flex-1">
            Print report
          </Button>
        </div>
      </div>
    </div>
  );
}
