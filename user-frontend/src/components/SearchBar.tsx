// user-frontend/src/components/SearchBar.tsx
import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // In a real app, this would trigger a search API call on the backend
    // console.log("Searching for:", e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search anime..."
        className="py-2 pl-10 pr-4 rounded-full bg-orange-700 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 w-48 sm:w-64"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
