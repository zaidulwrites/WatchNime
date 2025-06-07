// user-frontend/src/components/Header.tsx

import React, { useState, useContext } from 'react';
import { AppContext } from '../App.tsx'; // Import AppContext

const Header: React.FC = () => {
  // Destructure setCurrentPage and setSearchTerm from AppContext
  const { setCurrentPage, setSearchTerm } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for side menu visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search bar visibility
  const [localSearchInput, setLocalSearchInput] = useState(''); // Local state for search input field

  // Toggles the visibility of the side menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false); // Close search bar when opening menu
  };

  // Toggles the visibility of the search bar
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false); // Close side menu when opening search bar
    if (!isSearchOpen) { // If opening the search bar, clear previous input and global search term
      setLocalSearchInput('');
      setSearchTerm(''); 
    }
  };

  // Handles search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setSearchTerm(localSearchInput); // Update global search term
    setCurrentPage('homepage'); // Navigate to homepage to display search results
    setIsSearchOpen(false); // Close search bar after submission
  };

  // Handles page navigation from menu items
  const handlePageChange = (page: string) => {
    setCurrentPage(page); // Set the current page in global state
    setIsMenuOpen(false); // Close menu after selection
    setIsSearchOpen(false); // Close search bar after page change
    setSearchTerm(''); // Clear search term on page change
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center relative"> {/* Added relative for search bar positioning */}
        {/* WatchNime Logo - Navigates to homepage */}
        <h1
          className="text-2xl font-extrabold text-orange-500 cursor-pointer flex items-center"
          onClick={() => handlePageChange('homepage')}
        >
          <span className="text-blue-400">Watch</span>Nime
          {/* Small play icon next to the logo */}
          <svg className="w-6 h-6 ml-2 text-white hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.26c0 .818.917 1.258 1.557.752l3.197-2.132a1 1 0 000-1.504z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </h1>
        
        {/* Search Icon and Hamburger Menu Icon */}
        <div className="flex items-center space-x-4"> {/* Provides spacing between the icons */}
          {/* Search Icon Button */}
          <button onClick={toggleSearch} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          {/* Hamburger Menu Icon */}
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar - Slides down from below the header */}
      <div className={`absolute left-0 w-full bg-gray-700 py-3 px-4 shadow-md transition-all duration-300 ease-in-out ${isSearchOpen ? 'top-full opacity-100 visible' : 'top-0 opacity-0 invisible'}`}>
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search anime title..." // Placeholder text
            className="flex-grow bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={localSearchInput}
            onChange={(e) => setLocalSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
          >
            Search {/* Button text */}
          </button>
        </form>
      </div>

      {/* Side Menu - Slides in from the right */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl focus:outline-none"
          >
            &times; {/* Close button icon */}
          </button>
        </div>
        <ul className="flex flex-col items-center space-y-6 text-xl p-4">
          <li>
            <button
              onClick={() => handlePageChange('homepage')}
              className="block w-full text-center py-2 px-3 text-white hover:text-orange-400 transition-colors duration-200"
            >
              Home {/* Menu item text */}
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageChange('contactUs')}
              className="block w-full text-center py-2 px-3 text-white hover:text-orange-400 transition-colors duration-200"
            >
              Contact Us {/* Menu item text */}
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageChange('requestAnime')}
              className="block w-full text-center py-2 px-3 text-white hover:text-orange-400 transition-colors duration-200"
            >
              Request Anime {/* Menu item text */}
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageChange('joinUs')}
              className="block w-full text-center py-2 px-3 text-white hover:text-orange-400 transition-colors duration-200"
            >
              Join Us {/* Menu item text */}
            </button>
          </li>
          <li>
            <button
              onClick={() => handlePageChange('license')}
              className="block w-full text-center py-2 px-3 text-white hover:text-orange-400 transition-colors duration-200"
            >
              License {/* Menu item text */}
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay to dim content when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu} // Allows closing menu by clicking outside
        ></div>
      )}
    </header>
  );
};

export default Header;
