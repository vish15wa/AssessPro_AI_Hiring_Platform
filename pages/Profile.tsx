
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { User, AssessmentAttempt, Job } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    setAttempts(mockDb.getAttempts().filter(a => a.studentId === user.id));
    setJobs(mockDb.getJobs());
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 text-indigo-600 hover:text-indigo-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {user.fullName.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            <div className="mt-4 inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {user.role}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Contact</label>
                <p className="text-sm font-medium text-gray-900">{user.contactNumber}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Date of Birth</label>
                <p className="text-sm font-medium text-gray-900">{user.dob}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Joined On</label>
                <p className="text-sm font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Application History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Company/Job</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attempts.length > 0 ? attempts.map(attempt => {
                    const job = jobs.find(j => j.id === attempt.jobId);
                    return (
                      <tr key={attempt.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{job?.title || 'Unknown Role'}</div>
                          <div className="text-xs text-gray-400">Applied on {new Date(attempt.endTime || '').toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">{attempt.score}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            attempt.status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {attempt.status === 'QUALIFIED' ? 'Qualified' : 'Disqualified'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => navigate(`/report/${attempt.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
