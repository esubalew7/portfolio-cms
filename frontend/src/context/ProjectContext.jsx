import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../utils/api';
import useRealtimeProjects from '../hooks/useRealtimeProjects';

const ProjectContext = createContext(undefined);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/projects');
      setProjects(Array.isArray(res) ? res : []);
      setError(null);
      setLoading(false);
    } catch (err) {
      const isNetworkError =
        err.code === 'ECONNABORTED' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('Failed to fetch') ||
        !err.response;

      if (isNetworkError) {
        setError('Server is waking up, please wait...');
        setTimeout(fetchProjects, 3000);
      } else {
        setError(err.message || 'Failed to fetch projects');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProjects, 300);
  }, [fetchProjects]);

  useRealtimeProjects(() => {
    refreshProjects();
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const addProject = useCallback(async (projectData) => {
    try {
      const response = await api.post('/api/projects', projectData);
      setProjects((prev) => [...prev, response]);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to add project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateProject = useCallback(async (id, projectData) => {
    try {
      const response = await api.put(`/api/projects/${id}`, projectData);
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? response : p))
      );
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const value = useMemo(() => ({
    projects, loading, error, fetchProjects, refreshProjects,
    addProject, updateProject, deleteProject
  }), [projects, loading, error, fetchProjects, refreshProjects, addProject, updateProject, deleteProject]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
