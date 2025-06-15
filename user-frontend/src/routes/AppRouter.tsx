// user-frontend/src/routes/AppRouter.tsx
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';

// Import page components
import HomePage from '../pages/HomePage';
import AnimeDetailPage from '../pages/AnimeDetailPage';
import SeasonPage from '../pages/SeasonPage';
import ContactUsPage from '../pages/ContactUsPage';
import RequestAnimePage from '../pages/RequestAnimePage';
import JoinUsPage from '../pages/JoinUsPage';
import LicensePage from '../pages/LicensePage';

const AppRouter: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppRouter must be used within an AppProvider');
  }

  const { currentPage, setCurrentPage, loading, error } = context;

  // Push state when currentPage changes (for back button support)
  useEffect(() => {
    window.history.pushState({ page: currentPage }, '', '');
  }, [currentPage]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || 'homepage';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentPage]);

  // Display loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center text-xl p-4 text-center">
        {error}
      </div>
    );
  }

  // Render the appropriate page component
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
    case 'license':
      return <LicensePage />;
    default:
      return <HomePage />;
  }
};

export default AppRouter;
