
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Difficulty, Job } from '../types';

interface CreateJobProps {
  recruiterId: string;
}

const CreateJob: React.FC<CreateJobProps> = ({ recruiterId }) => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: Difficulty.MEDIUM,
    numQuestions: 10,
    durationMinutes: '', 
    deadline: '',
    threshold: 30,
    isCodingEnabled: true
  });

  useEffect(() => {
    if (id) {
      const existingJob = mockDb.getJobs().find(j => j.id === id);
      if (existingJob) {
        setFormData({
          title: existingJob.title,
          description: existingJob.description,
          difficulty: existingJob.difficulty,
          numQuestions: existingJob.numQuestions,
          durationMinutes: existingJob.durationMinutes.toString(),
          deadline: existingJob.deadline,
          threshold: existingJob.threshold,
          isCodingEnabled: existingJob.isCodingEnabled
        });
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const jobData: Job = {
      id: id || Math.random().toString(36).substr(2, 9),
      recruiterId,
      title: formData.title,
      description: formData.description,
      skills: formData.description.split(',').map(s => s.trim()),
      difficulty: formData.difficulty,
      numQuestions: formData.numQuestions || 10,
      durationMinutes: parseInt(formData.durationMinutes) || 30,
      deadline: formData.deadline,
      threshold: formData.threshold,
      isCodingEnabled: formData.isCodingEnabled,
      createdAt: new Date().toISOString()
    };

    if (id) {
      mockDb.updateJob(jobData);
      setSuccessMsg('Job Campaign Updated!');
    } else {
      mockDb.addJob(jobData);
      setSuccessMsg('Job Campaign Launched!');
    }

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center mb-10">
        <button onClick={() => navigate(-1)} className="mr-6 text-indigo-600 hover:bg-indigo-50 p-4 rounded-3xl transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">{id ? 'Edit Assessment' : 'New Assessment'}</h1>
      </div>

      {successMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-green-500 text-white px-10 py-5 rounded-[32px] font-black text-2xl shadow-2xl shadow-green-200 animate-bounce">
          {successMsg}
        </div>
      )}

      <div className="bg-white p-12 md:p-16 rounded-[48px] shadow-2xl border-2 border-gray-50">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div>
            <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Job Campaign Title</label>
            <input
              type="text"
              required
              className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-black text-xl outline-none focus:border-indigo-500 focus:bg-white transition-all"
              placeholder="e.g. Senior Software Engineer"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Job Description & Skills</label>
            <textarea
              required
              rows={6}
              className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-bold text-lg outline-none focus:border-indigo-500 transition-all"
              placeholder="Paste the full job description here. AI will extract skills automatically."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Assessment Level</label>
              <select
                className="w-full px-8 py-6 rounded-[24px] bg-gray-50 border-4 border-gray-50 text-black font-black text-lg outline-none focus:border-indigo-500 transition-all"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value as Difficulty})}
              >
                <option value={Difficulty.EASY}>Entry Level (Easy)</option>
                <option value={Difficulty.MEDIUM}>Intermediate (Medium)</option>
                <option value={Difficulty.HARD}>Expert Level (Hard)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Duration (Minutes)</label>
              <input
                type="number"
                required
                className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-black text-lg outline-none focus:border-indigo-500 transition-all"
                placeholder="Time limit..."
                value={formData.durationMinutes}
                onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Questions to Generate</label>
              <input
                type="number"
                className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-black text-lg outline-none focus:border-indigo-500 transition-all"
                value={formData.numQuestions}
                onChange={(e) => setFormData({...formData, numQuestions: e.target.value === '' ? 10 : parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Campaign Deadline</label>
              <input
                type="date"
                required
                className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-black text-lg outline-none focus:border-indigo-500 transition-all"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Qualifying Threshold (%)</label>
              <input
                type="number"
                className="w-full px-8 py-6 rounded-[24px] bg-white border-4 border-gray-50 text-black font-black text-lg outline-none focus:border-indigo-500 transition-all"
                value={formData.threshold}
                onChange={(e) => setFormData({...formData, threshold: e.target.value === '' ? 0 : parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-4 bg-indigo-50/50 p-6 rounded-[24px] border-4 border-indigo-50">
              <input
                type="checkbox"
                id="coding-enabled"
                className="w-8 h-8 text-indigo-600 border-gray-300 rounded-xl focus:ring-indigo-500"
                checked={formData.isCodingEnabled}
                onChange={(e) => setFormData({...formData, isCodingEnabled: e.target.checked})}
              />
              <label htmlFor="coding-enabled" className="text-lg font-black text-indigo-900 uppercase tracking-widest">Include Coding Tasks</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-8 rounded-[32px] font-black text-2xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 mr-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing with Cloud...
              </span>
            ) : id ? 'Update Campaign' : 'Launch Assessment Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
