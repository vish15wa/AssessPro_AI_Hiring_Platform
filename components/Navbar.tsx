
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">AssessPro</Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-indigo-200 transition">Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
              <Link to="/profile" className="hover:text-indigo-200 transition">Profile</Link>
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-indigo-500">
                <span className="text-sm font-medium opacity-90">
                  {user.fullName} ({user.role})
                </span>
                <button 
                  onClick={() => { onLogout(); navigate('/login'); }}
                  className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link 
                to="/register" 
                className="bg-white text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
