
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Job, AssessmentAttempt, User } from '../types';

const Leaderboard: React.FC = () => {
  const { jobId } = useParams<{jobId: string}>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const foundJob = mockDb.getJobs().find(j => j.id === jobId);
    setJob(foundJob || null);
    setAttempts(mockDb.getAttempts().filter(a => a.jobId === jobId && a.status === 'QUALIFIED'));
    setUsers(mockDb.getUsers());
  }, [jobId]);

  const sortedAttempts = [...attempts].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-4 text-indigo-600 hover:text-indigo-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500">{job?.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white uppercase text-xs font-bold">
            <tr>
              <th className="px-8 py-5">Rank</th>
              <th className="px-8 py-5">Candidate</th>
              <th className="px-8 py-5 text-center">Score</th>
              <th className="px-8 py-5 text-right">Date Attempted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedAttempts.length > 0 ? sortedAttempts.map((attempt, index) => {
              const student = users.find(u => u.id === attempt.studentId);
              return (
                <tr key={attempt.id} className={`${index < 3 ? 'bg-amber-50' : 'hover:bg-gray-50'} transition`}>
                  <td className="px-8 py-6">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="font-bold text-gray-400">#{index + 1}</span>}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{student?.fullName || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">@{student?.username}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xl font-extrabold text-indigo-600">{attempt.score}</span>
                  </td>
                  <td className="px-8 py-6 text-right text-sm text-gray-500">
                    {new Date(attempt.endTime || '').toLocaleDateString()}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-400">No qualified candidates found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
