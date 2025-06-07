// admin-frontend/src/components/ProtectedRoute.tsx
// Note: In this setup, AdminRouter handles the main protection logic
// by checking isAuthenticated directly. This component can be used
// if you want to wrap specific parts of the UI that require auth,
// but for page-level routing, AdminRouter's switch case is primary.
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import LoginPage from '../pages/LoginPage'; // Assuming LoginPage is in pages

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // This should ideally not happen if App wraps everything with AuthProvider
    return <div className="text-red-500 text-center py-10">Application Error: AuthContext not found.</div>;
  }

  const { isAuthenticated, loading } = authContext;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
