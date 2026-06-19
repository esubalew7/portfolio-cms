import { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { useContentStore } from '../store/contentStore';
import useRealtimeContent from '../hooks/useRealtimeContent';
import useRealtimeProjects from '../hooks/useRealtimeProjects';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const fetchContent = useContentStore((s) => s.fetchContent);
  const debounceRef = useRef(null);

  const refreshContent = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchContent, 300);
  }, [fetchContent]);

  useRealtimeContent(() => {
    refreshContent();
  });

  useRealtimeProjects(() => {
    refreshContent();
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <ContentContext.Provider value={{ refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}
