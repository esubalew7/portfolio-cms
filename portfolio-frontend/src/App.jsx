import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { useContentStore } from './store/contentStore';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Loader } from './components/Loader';
import { ScrollToTop } from './components/ScrollToTop';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const fetchContent = useContentStore((s) => s.fetchContent);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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
          <AnimatePresence>
            {isLoading && <Loader key="loader" />}
          </AnimatePresence>

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>

          <ScrollToTop />
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
