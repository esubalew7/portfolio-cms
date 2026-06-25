import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { ContentProvider } from './context/ContentContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Loader } from './components/Loader';
import { ScrollToTop } from './components/ScrollToTop';
import { SEOHead } from './components/SEOHead';
import { CursorSystem } from './components/cursor/CursorSystem';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <HelmetProvider>
    <ThemeProvider>
      <ProjectProvider>
        <ContentProvider>
        <SEOHead />
        <CursorSystem>
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
        </CursorSystem>
        </ContentProvider>
      </ProjectProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
