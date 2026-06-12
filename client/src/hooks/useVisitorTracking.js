import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const trackedSections = new Set();

const trackPage = async (page) => {
  try {
    await api.post('/api/analytics/visit', { page });
  } catch {
  }
};

export const useVisitorTracking = () => {
  const location = useLocation();
  const prevPath = useRef('');

  useEffect(() => {
    const path = location.pathname;
    if (path === prevPath.current) return;
    prevPath.current = path;

    const pageMap = {
      '/': 'home',
      '/experience': 'experience',
    };

    const page = pageMap[path];
    if (page) {
      trackPage(page);
    }
  }, [location.pathname]);
};

export const useTrackSection = (sectionName) => {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || trackedSections.has(sectionName)) return;
    tracked.current = true;
    trackedSections.add(sectionName);
    trackPage(sectionName);
  }, [sectionName]);
};

