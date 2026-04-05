import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import DashboardProjects from './pages/DashboardProjects';
import { Loader } from './components/Loader';
import { ScrollToTop } from './components/ScrollToTop';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate initial loading time for components/assets to mount (2 seconds)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Loader layered on top gracefully transitions out while React roots render underneath */}
        <AnimatePresence>
          {isLoading && <Loader key="loader" />}
        </AnimatePresence>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/projects" element={<DashboardProjects />} />
          </Route>
        </Routes>

        <ScrollToTop />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
