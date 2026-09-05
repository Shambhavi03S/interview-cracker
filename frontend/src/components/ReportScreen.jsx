import React from 'react';

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
    if (score >= 8) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 6) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { text: 'Needs Work', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const contentLevel = getPerformanceLevel(avgContentAccuracy);
  const commLevel = getPerformanceLevel(avgCommunication);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Interview Complete! 🎉</h1>
        <p className="text-indigo-100">Here's your comprehensive performance report</p>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${contentLevel.bg} rounded-lg p-8 border-2 border-green-200`}>
          <p className="text-sm text-gray-600 mb-2">Content Accuracy</p>
          <div className="flex items-end gap-4 mb-4">
            <div className={`text-5xl font-bold ${contentLevel.color}`}>{avgContentAccuracy}</div>
            <span className="text-gray-600 mb-2">/10</span>
          </div>
          <p className={`font-semibold ${contentLevel.color}`}>{contentLevel.text}</p>
        </div>

        <div className={`${commLevel.bg} rounded-lg p-8 border-2 border-blue-200`}>
          <p className="text-sm text-gray-600 mb-2">Communication Clarity</p>
          <div className="flex items-end gap-4 mb-4">
            <div className={`text-5xl font-bold ${commLevel.color}`}>{avgCommunication}</div>
            <span className="text-gray-600 mb-2">/10</span>
          </div>
          <p className={`font-semibold ${commLevel.color}`}>{commLevel.text}</p>
        </div>
      </div>

      {/* Role Summary */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Role: {interviewData.seniority}</h2>
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {interviewData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Question Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Breakdown</h2>
        <div className="space-y-6">
          {allAnswers.map((answer, idx) => (
            <div key={idx} className="border-l-4 border-indigo-600 pl-6 pb-6">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Q{idx + 1}: {answer.question}</h3>
                </div>
                <div className="flex gap-4 whitespace-nowrap">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Content</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {answer.feedback.contentAccuracy}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Communication</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {answer.feedback.communicationClarity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <p className="text-sm text-gray-700 italic">"{answer.answer}"</p>
              </div>

              <p className="text-sm text-gray-700 mb-3">{answer.feedback.feedback}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2">Strengths</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {answer.feedback.strengths.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-700 mb-2">To Improve</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {answer.feedback.areasForImprovement.map((a, i) => (
                      <li key={i}>→ {a}</li>
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
        <div className="bg-green-50 rounded-lg shadow-lg p-8 border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">💪 Key Strengths</h3>
          <ul className="space-y-2">
            {Array.from(allStrengths).map((strength, idx) => (
              <li key={idx} className="text-gray-700 flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 rounded-lg shadow-lg p-8 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-orange-800 mb-4">📈 Areas to Develop</h3>
          <ul className="space-y-2">
            {Array.from(allAreas).map((area, idx) => (
              <li key={idx} className="text-gray-700 flex items-center gap-2">
                <span className="text-orange-600 font-bold">→</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-8 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4">💡 Recommendations</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Focus on improving communication clarity - practice explaining technical concepts simply</li>
          <li>• Continue deepening your technical knowledge in the key skills required for this role</li>
          <li>• Practice answering questions within your time limit to improve efficiency</li>
          <li>• Consider doing another mock interview to track progress</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
        >
          Start Another Interview
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
        >
          Print Report
        </button>
      </div>
    </div>
  );
}
