import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        await api.get('/api/auth/me');
        if (!cancelled) setAuthState('authenticated');
      } catch {
        if (!cancelled) setAuthState('unauthenticated');
      }
    };

    checkAuth();

    return () => { cancelled = true; };
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
