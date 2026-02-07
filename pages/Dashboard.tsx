
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { User, UserRole, Job, AssessmentAttempt } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);

  useEffect(() => {
    setJobs(mockDb.getJobs());
    setAttempts(mockDb.getAttempts());
  }, []);

  const isRecruiter = user.role === UserRole.RECRUITER;
  const now = new Date();

  // Recruiters see all their jobs. 
  // Students see all jobs that haven't passed the deadline (11:59 PM of deadline day).
  const visibleJobs = isRecruiter 
    ? jobs.filter(j => j.recruiterId === user.id)
    : jobs.filter(j => {
        const deadline = new Date(j.deadline);
        deadline.setHours(23, 59, 59, 999);
        return now <= deadline;
      });

  const studentAttempts = attempts.filter(a => a.studentId === user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 font-bold">Welcome back, <span className="text-indigo-600">{user.fullName}</span></p>
        </div>
        
        {isRecruiter && (
          <Link 
            to="/create-job" 
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            Post New Job
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">
            {isRecruiter ? 'Active Campaigns' : 'Assignments Available'}
          </h3>
          <p className="text-5xl font-black text-indigo-600">
            {visibleJobs.length}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">
            {isRecruiter ? 'Total Evaluated' : 'Tests Completed'}
          </h3>
          <p className="text-5xl font-black text-emerald-600">
            {isRecruiter 
              ? attempts.filter(a => visibleJobs.some(j => j.id === a.jobId)).length
              : studentAttempts.length
            }
          </p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Selection Status</h3>
          <p className="text-5xl font-black text-amber-500">
            {isRecruiter ? 'LIVE' : 'ACTIVE'}
          </p>
        </div>
      </div>

      {isRecruiter ? (
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900">Your Posted Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-black tracking-widest">
                <tr>
                  <th className="px-10 py-6">Job Title</th>
                  <th className="px-10 py-6">Deadline</th>
                  <th className="px-10 py-6">Applicants</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleJobs.length > 0 ? visibleJobs.map(job => (
                  <tr key={job.id} className="hover:bg-indigo-50/30 transition-all">
                    <td className="px-10 py-8">
                      <div className="font-black text-gray-900 text-lg">{job.title}</div>
                      <div className="text-sm font-bold text-gray-400">{job.difficulty} • {job.durationMinutes} mins</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-sm font-black ${new Date(job.deadline) < now ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-2xl text-lg font-black">
                        {attempts.filter(a => a.jobId === job.id).length}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right space-x-6">
                      <Link to={`/edit-job/${job.id}`} className="text-indigo-600 hover:underline font-black">Edit</Link>
                      <Link to={`/leaderboard/${job.id}`} className="text-emerald-600 hover:underline font-black">Results</Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-bold">No active job campaigns found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Available Skill Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleJobs.length > 0 ? visibleJobs.map(job => {
              const hasAttempted = studentAttempts.find(a => a.jobId === job.id);
              return (
                <div key={job.id} className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all group">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <p className="text-gray-500 font-medium mb-8 line-clamp-3 leading-relaxed">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-10">
                    <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">{job.difficulty}</span>
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">{job.durationMinutes} MINS</span>
                  </div>

                  {hasAttempted ? (
                    <div className="space-y-4">
                      <Link 
                        to={`/report/${hasAttempted.id}`}
                        className="block w-full text-center py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100"
                      >
                        Performance Report
                      </Link>
                      <Link to={`/leaderboard/${job.id}`} className="block text-center text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">
                        View Leaderboard
                      </Link>
                    </div>
                  ) : (
                    <Link 
                      to={`/assessment/${job.id}`}
                      className="block w-full text-center py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all"
                    >
                      Apply & Start Test
                    </Link>
                  )}
                </div>
              );
            }) : (
              <div className="col-span-full py-32 text-center bg-gray-50 rounded-[48px] border-4 border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-2xl uppercase tracking-widest">No Active Assessments Found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
