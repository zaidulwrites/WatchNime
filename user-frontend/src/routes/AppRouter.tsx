// user-frontend/src/routes/AppRouter.tsx
import React, { useContext } from 'react';
import { AppContext } from '../App'; // Import AppContext

// Import page components
import HomePage from '../pages/HomePage.tsx';
import AnimeDetailPage from '../pages/AnimeDetailPage.tsx';
import SeasonPage from '../pages/SeasonPage.tsx';
import ContactUsPage from '../pages/ContactUsPage.tsx';
import RequestAnimePage from '../pages/RequestAnimePage.tsx';
import JoinUsPage from '../pages/JoinUsPage.tsx';
import LicensePage from '../pages/LicensePage.tsx'; // Import License Page

const AppRouter: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppRouter must be used within an AppProvider');
  }

  const { currentPage, loading, error } = context;

  // Display loading spinner if data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    );
  }
  // Display error message if an error occurred during data fetching
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center text-xl p-4 text-center">
        {error}
      </div>
    );
  }

  // Render the appropriate page component based on `currentPage`
  switch (currentPage) {
    case 'homepage':
      return <HomePage />;
    case 'animeDetail':
      return <AnimeDetailPage />;
    case 'seasonDetail':
      return <SeasonPage />;
    case 'contactUs':
      return <ContactUsPage />;
    case 'requestAnime':
      return <RequestAnimePage />;
    case 'joinUs':
      return <JoinUsPage />;
    case 'license': // Case for License Page
      return <LicensePage />;
    default:
      return <HomePage />; // Fallback to homepage
  }
};

export default AppRouter;
