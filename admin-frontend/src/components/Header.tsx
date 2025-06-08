// admin-frontend/src/components/Header.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct path for .tsx

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth(); // Get user, logout, isAuthenticated

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* UPDATED: Changed logo text to "WatchNime Admin" with color split */}
        <Link to="/" className="text-2xl font-bold text-orange-500 flex items-center">
          <span className="text-blue-400">Watch</span>Nime Admin {/* Color split applied here */}
          {/* You can add a small admin-specific icon here if desired for professional touch */}
          {/* <svg className="w-6 h-6 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.33.832 2.25 2.25a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.942 1.543-.832 3.33-2.25 2.25a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.33-.832-2.25-2.25a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.942-1.543.832-3.33 2.25-2.25a1.724 1.724 0 002.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg> */}
        </Link>
        <nav>
          {isAuthenticated ? ( // Check isAuthenticated from context
            <div className="flex items-center space-x-4">
              {user && <span className="text-gray-300">Welcome, {user.username} ({user.role})</span>}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
