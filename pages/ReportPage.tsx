
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { AssessmentAttempt, Job, User, UserRole } from '../types';

interface ReportPageProps {
  user: User;
}

const ReportPage: React.FC<ReportPageProps> = ({ user }) => {
  const { attemptId } = useParams<{attemptId: string}>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [showSuspiciousModal, setShowSuspiciousModal] = useState(false);

  useEffect(() => {
    const foundAttempt = mockDb.getAttempts().find(a => a.id === attemptId);
    if (foundAttempt) {
      setAttempt(foundAttempt);
      setJob(mockDb.getJobs().find(j => j.id === foundAttempt.jobId) || null);
      setCandidate(mockDb.getUsers().find(u => u.id === foundAttempt.studentId) || null);
      
      const storedEvals = localStorage.getItem(`eval_${attemptId}`);
      if (storedEvals) {
        setEvaluations(JSON.parse(storedEvals));
      }
    }
  }, [attemptId]);

  if (!attempt || !job) return <div className="p-20 text-center font-black">Generating Report...</div>;

  const isRecruiter = user.role === UserRole.RECRUITER;
  const isSelf = user.id === attempt.studentId;

  if (!isRecruiter && !isSelf) {
    return <div className="p-20 text-center text-red-600 font-black">ACCESS DENIED: Unauthorized Access to Confidential Data.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4 print-container">
      <div className="flex justify-between items-center mb-12 no-print">
        <button onClick={() => navigate('/dashboard')} className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-2xl font-black hover:bg-indigo-50 transition flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>
        <button onClick={() => window.print()} className="bg-gray-900 text-white px-10 py-3 rounded-2xl font-black hover:bg-black shadow-2xl transition active:scale-95">
          Download PDF Report
        </button>
      </div>

      <div className="bg-white p-12 md:p-20 rounded-[48px] shadow-2xl border-2 border-gray-100 space-y-20">
        <header className="flex flex-col md:flex-row justify-between items-start border-b-4 border-gray-50 pb-16">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Performance Analytics</h1>
            <p className="text-2xl text-indigo-600 font-black uppercase tracking-widest">{job.title}</p>
            <p className="text-gray-400 mt-2 font-bold">Report ID: {attempt.id.toUpperCase()}</p>
          </div>
          <div className="text-right mt-8 md:mt-0">
            <div className={`inline-block px-12 py-6 rounded-3xl text-5xl font-black shadow-xl ${
              attempt.status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {attempt.score} <span className="text-2xl opacity-50">/ 100</span>
            </div>
            <div className="mt-6 flex flex-col items-end">
              <p className={`text-sm font-black uppercase tracking-[0.3em] mb-1 ${attempt.status === 'QUALIFIED' ? 'text-green-600' : 'text-red-600'}`}>
                {attempt.status === 'QUALIFIED' ? 'Qualified' : 'Disqualified'}
              </p>
              <p className="text-gray-400 font-bold text-xs">Threshold Required: {job.threshold}%</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-10 rounded-[32px] border-2 border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-3 text-xs">01</span>
              Integrity Status
            </h2>
            <div className="flex items-center space-x-6">
              <div className={`h-6 w-6 rounded-full animate-pulse ${attempt.isSuspicious ? 'bg-red-600' : 'bg-green-600'}`}></div>
              <p className={`font-black text-2xl ${attempt.isSuspicious ? 'text-red-600' : 'text-green-600'}`}>
                {attempt.isSuspicious ? 'Suspicious Activity Detected' : 'Verified Submission'}
              </p>
            </div>
            {attempt.isSuspicious && (
              <button onClick={() => setShowSuspiciousModal(true)} className="mt-6 text-indigo-600 font-black text-lg underline hover:text-indigo-800">
                View Anomaly Details
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-10 rounded-[32px] border-2 border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-3 text-xs">02</span>
              Candidate Info
            </h2>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-indigo-200 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-700">
                {candidate?.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{candidate?.fullName}</p>
                <p className="text-indigo-500 font-bold">@{candidate?.username} | {candidate?.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <h2 className="text-3xl font-black text-gray-900 border-l-8 border-indigo-600 pl-6">Detailed Response Breakdown</h2>
          <div className="space-y-8">
            {evaluations.length > 0 ? evaluations.map((ev, idx) => (
              <div key={idx} className={`p-10 rounded-[40px] border-4 transition-all ${ev.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${ev.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {ev.isCorrect ? 'Correct' : 'Incorrect'} — {ev.marksObtained} Marks
                  </span>
                  <span className="text-gray-400 font-black">Q{idx + 1}</span>
                </div>
                
                <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">Evaluation: {ev.aiFeedback}</p>
                
                {!ev.isCorrect && ev.correctAnswer && (
                  <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-gray-100">
                    <p className="text-xs font-black text-gray-400 uppercase mb-2">Reference Correct Solution:</p>
                    <p className="text-indigo-600 font-black text-lg">{ev.correctAnswer}</p>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-10 bg-indigo-50 rounded-3xl text-center">
                <p className="text-indigo-900 font-bold">Standardized evaluation results are visible in summary score above.</p>
              </div>
            )}
          </div>
        </section>

        <footer className="pt-20 border-t-4 border-gray-50">
          <div className="bg-indigo-900 p-12 rounded-[40px] text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-[0.2em] text-indigo-300">AI Recruiter Summary</h3>
            <p className="text-2xl font-medium leading-relaxed italic opacity-90">
              "{attempt.feedback}"
            </p>
          </div>
        </footer>
      </div>

      {showSuspiciousModal && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-6 no-print">
          <div className="bg-white p-16 rounded-[48px] max-w-2xl w-full shadow-2xl">
            <div className="flex items-center text-red-600 mb-8">
              <svg className="w-12 h-12 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <h3 className="text-4xl font-black">Integrity Alert</h3>
            </div>
            <p className="text-2xl text-gray-700 mb-12 leading-relaxed font-bold">
              {attempt.suspiciousReason || "Multiple anomalies detected: High response speed coupled with low accuracy suggests random selection/guesswork. Resume mismatch also flagged."}
            </p>
            <button onClick={() => setShowSuspiciousModal(false)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-indigo-700 transition">
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
