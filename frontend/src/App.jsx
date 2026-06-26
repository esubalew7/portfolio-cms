import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { ContentProvider } from './context/ContentContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { ScrollToTop } from './components/ScrollToTop';
import { SEOHead } from './components/SEOHead';
import { Cursor } from './components/cursor/Cursor';
import { Preloader } from './components/preloader/Preloader';

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <HelmetProvider>
    <ThemeProvider>
      <ProjectProvider>
        <ContentProvider>
        <SEOHead />
        {showPreloader ? (
          <Preloader onComplete={handlePreloaderComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cursor>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Routes>
              <ScrollToTop />
            </BrowserRouter>
            </Cursor>
          </motion.div>
        )}
        </ContentProvider>
      </ProjectProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
