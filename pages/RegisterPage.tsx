
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: UserRole.STUDENT,
    contactNumber: '',
    dob: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email format. Must contain '@' and domain.";
    if (formData.password.length < 8) return "Security threshold: Password must be 8+ characters.";
    if (!/^\d{10}$/.test(formData.contactNumber)) return "Contact must be exactly 10 digits (no characters).";
    if (!formData.fullName || !formData.username || !formData.dob) return "All fields are mandatory.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    mockDb.addUser(newUser);
    setSuccess(true);
    setError('');
    
    setTimeout(() => {
      setSuccess(false);
      navigate('/login');
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-4xl font-black mb-10 text-center text-gray-900">Create Account</h2>
      
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-10 py-5 rounded-2xl shadow-2xl z-[200] font-black text-xl animate-bounce">
          Account Created Successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-8 border-red-500 p-5 mb-10 text-red-700 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Username</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Password</label>
          <input
            type="password"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Contact Number</label>
          <input
            type="tel"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.contactNumber}
            onChange={(e) => setFormData({...formData, contactNumber: e.target.value.replace(/\D/g,'')})}
            maxLength={10}
            placeholder="10 digit number"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Date of Birth</label>
          <input
            type="date"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Professional Role</label>
          <select
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <option value={UserRole.STUDENT}>Student / Candidate</option>
            <option value={UserRole.RECRUITER}>Recruiter / Company</option>
          </select>
        </div>

        <div className="md:col-span-2 pt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-xl active:scale-95"
          >
            Create Secure Profile
          </button>
        </div>
      </form>
      
      <button 
        onClick={() => navigate(-1)}
        className="mt-10 flex items-center justify-center w-full text-gray-400 hover:text-gray-700 text-sm font-black uppercase tracking-widest"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Login
      </button>
    </div>
  );
};

export default RegisterPage;
