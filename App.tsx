
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import Assessment from './pages/Assessment';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import ReportPage from './pages/ReportPage';
import { mockDb } from './services/mockDb';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockDb.getCurrentUser());

  useEffect(() => {
    const loggedUser = mockDb.getCurrentUser();
    if (loggedUser) setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    mockDb.logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/create-job" element={user?.role === 'RECRUITER' ? <CreateJob recruiterId={user.id} /> : <Navigate to="/login" />} />
            <Route path="/edit-job/:id" element={user?.role === 'RECRUITER' ? <CreateJob recruiterId={user.id} /> : <Navigate to="/login" />} />
            
            <Route path="/assessment/:jobId" element={user ? <Assessment user={user} /> : <Navigate to="/login" />} />
            <Route path="/leaderboard/:jobId" element={<Leaderboard />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/report/:attemptId" element={user ? <ReportPage user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AssessPro - An Intelligent Skill-Centric Hiring Assessment Platform.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
