import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const ContentContext = createContext(undefined);

const defaultContent = {
  hero: {
    greeting: "Hello, I am",
    name: "",
    titles: [],
    description: "",
    image: "",
    cta: { primary: { text: "", link: "" }, secondary: { text: "", link: "" } },
  },
  about: {
    title: "About Me",
    subtitle: "",
    description: "",
    image: "",
    stats: [],
    cta: { text: "", link: "" },
  },
  skills: { title: "Core Skills", subtitle: "", categories: [] },
  experience: { title: "Experience", subtitle: "", categories: [] },
  testimonials: { title: "Client Feedback", subtitle: "", items: [] },
  socialLinks: [],
  resume: { title: "Resume", url: "", buttonText: "Download Resume" },
  contactInfo: { email: "", phone: "", location: "", formTitle: "Get in touch", formDescription: "", formButtonText: "Send Message", successMessage: "" },
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/content');
      if (res.success && res.data) {
        setContent(res.data);
      }
      setError(null);
      setLoading(false);
    } catch (err) {
      const isNetworkError = err.code === 'ECONNABORTED' ||
        err.message.includes('Network Error') ||
        err.message.includes('Failed to fetch') ||
        !err.response;

      if (isNetworkError) {
        setError('Server is waking up, please wait...');
        setTimeout(fetchContent, 3000);
      } else {
        setError(err.message || 'Failed to fetch content');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const handleRetry = () => fetchContent();
    window.addEventListener('retryContent', handleRetry);
    return () => window.removeEventListener('retryContent', handleRetry);
  }, [fetchContent]);

  return (
    <ContentContext.Provider value={{ content, loading, error, fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
