import { create } from 'zustand';
import { contentService } from '../services/contentService';

const initialState = {
  content: {
    sections: {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      experience: true,
      testimonials: false,
      terminal: false,
      contact: true,
    },
    navbar: {
      logo: '',
      navItems: [],
    },
    footer: {
      copyright: '',
      socials: [],
    },
    hero: { greeting: 'Hello, I am', name: '', titles: [], description: '', image: '', cta: { primary: { text: '', link: '' }, secondary: { text: '', link: '' } } },
    about: { title: 'About Me', subtitle: '', description: '', image: '', stats: [], cta: { text: '', link: '' } },
    skills: { title: 'Core Skills', subtitle: '', categories: [] },
    experience: { title: 'Experience', subtitle: '', categories: [] },
    testimonials: { title: 'Client Feedback', subtitle: '', items: [] },
    socialLinks: [],
    resume: { title: 'Resume', url: '', buttonText: 'Download Resume' },
    contactInfo: { email: '', phone: '', location: '', formTitle: 'Get in touch', formDescription: '', formButtonText: 'Send Message', successMessage: '' },
  },
  loading: true,
  error: null,
};

export const useContentStore = create((set, get) => ({
  ...initialState,

  fetchContent: async () => {
    try {
      set({ loading: true, error: null });
      const res = await contentService.getAll();
      if (res.success && res.data) {
        set({ content: res.data, error: null, loading: false });
      } else {
        set({ loading: false, error: 'Invalid response format' });
      }
    } catch (err) {
      const isNetworkError =
        err.code === 'ECONNABORTED' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('Failed to fetch') ||
        !err.response;

      if (isNetworkError) {
        set({ error: 'Server is waking up, please wait...', loading: true });
        setTimeout(() => get().fetchContent(), 3000);
      } else {
        set({ error: err.message || 'Failed to fetch content', loading: false });
      }
    }
  },

  retry: () => get().fetchContent(),

  reset: () => set(initialState),
}));
