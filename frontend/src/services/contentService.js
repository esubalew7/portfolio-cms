import api from '../utils/api';

export const contentService = {
  getAll: () => api.get('/api/content'),
};
