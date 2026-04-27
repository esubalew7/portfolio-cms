import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import DashboardProjects from './pages/DashboardProjects';
import { Loader } from './components/Loader';
import { ScrollToTop } from './components/ScrollToTop';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <ToastProvider>
            <AnimatePresence>
              {isLoading && <Loader key="loader" />}
            </AnimatePresence>

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<DashboardProjects />} />
                <Route path="messages" element={<Messages />} />
              </Route>
            </Routes>

            <ScrollToTop />
          </ToastProvider>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
