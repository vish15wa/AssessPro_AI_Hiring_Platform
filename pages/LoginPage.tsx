
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please check for @ and domain.');
      return;
    }

    const users = mockDb.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      mockDb.setCurrentUser(user);
      onLogin(user);
      navigate('/dashboard');
    } else {
      setError('Wrong credentials. Access denied.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-4xl font-black mb-8 text-center text-gray-900">Sign In</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 font-bold text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-8">
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Secure Password</label>
          <input
            type="password"
            required
            className="w-full px-5 py-4 rounded-xl bg-white border-2 border-gray-100 text-black font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl active:scale-95"
        >
          Access Dashboard
        </button>
      </form>
      
      <p className="mt-10 text-center text-gray-500 font-bold">
        New here? <Link to="/register" className="text-indigo-600 hover:underline">Create an Account</Link>
      </p>
      
      <button 
        onClick={() => navigate(-1)}
        className="mt-8 flex items-center justify-center w-full text-gray-400 hover:text-gray-600 text-sm font-black"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Go Back
      </button>
    </div>
  );
};

export default LoginPage;
