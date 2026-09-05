import React, { useState } from 'react';
import './App.css';
import { JDInputPortal, InterviewSummary } from './components/JDPortal';
import { LiveInterviewScreen } from './components/InterviewScreens';
import { FinalReportScreen } from './components/ReportScreen';
import { Button } from './components/UIComponents';

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

      {/* Home */}
      {currentScreen === 'home' && (
        <div className="min-h-screen bg-paper text-ink">
          <header className="border-b border-line">
            <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <span className="font-serif text-xl font-semibold tracking-tight">Interview Cracker</span>
              <span className="text-sm text-ink-faint hidden sm:block">Practice out loud, before it counts</span>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-6 py-20">
            {/* Hero copy */}
            <div className="max-w-2xl">
              <h1 className="font-serif text-5xl leading-[1.1] font-semibold mb-6">
                Rehearse the interview before the interviewer does
              </h1>
              <p className="text-lg text-ink-soft mb-8 max-w-prose">
                Give us the job description and start talking. The interviewer
                asks one question at a time, live, and shapes every next
                question around what you just said — no script, no fixed
                question list.
              </p>
              <Button onClick={() => setCurrentScreen('jd-input')}>
                Start with a job description
              </Button>
            </div>

            {/* How it works — a genuine sequence, numbering earns its place */}
            <div className="mt-24 border-t border-line pt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { step: '1', title: 'Share the role', desc: 'Paste or upload the job description you\u2019re preparing for.' },
                  { step: '2', title: 'Start with an introduction', desc: 'The interview opens with "Tell me about yourself," then each next question is generated live from your answers and the role.' },
                  { step: '3', title: 'Read your report', desc: 'See scored feedback on content and clarity, question by question.' },
                ].map((item) => (
                  <div key={item.step}>
                    <p className="font-serif text-3xl text-brass-500 mb-3">{item.step}</p>
                    <p className="font-semibold mb-1">{item.title}</p>
                    <p className="text-ink-soft text-sm leading-relaxed">{item.desc}</p>
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
        <InterviewSummary
          data={interviewData}
          onStart={handleStartInterview}
          onBack={handleReset}
        />
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
