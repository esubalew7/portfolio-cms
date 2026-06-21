import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const contentCache = {};

export const useContentSection = (sectionName) => {
  const { showToast } = useToast();
  const [sectionData, setSectionData] = useState(null);
  const [allContent, setAllContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/content');
      if (res.success && res.data) {
        contentCache[sectionName] = res.data[sectionName];
        setSectionData(res.data[sectionName]);
        setAllContent(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load content');
      showToast('Failed to load content: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [sectionName, showToast]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchContent();
    }
  }, [fetchContent]);

  const update = useCallback((newData) => {
    setSectionData(newData);
  }, []);

  const save = useCallback(async () => {
    try {
      setSaving(true);
      await api.put('/api/content', { [sectionName]: sectionData });
      contentCache[sectionName] = sectionData;
      showToast(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section saved!`);
    } catch (err) {
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  }, [sectionName, sectionData, showToast]);

  return { data: sectionData, allContent, loading, saving, error, update, save, refetch: fetchContent };
};
