import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
//import DashboardProjects from './pages/DashboardProjects';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import ContentIndex from './pages/ContentIndex';
import HeroEditor from './pages/content/HeroEditor';
import AboutEditor from './pages/content/AboutEditor';
import SkillsEditor from './pages/content/SkillsEditor';
import ExperienceEditor from './pages/content/ExperienceEditor';
import TestimonialsEditor from './pages/content/TestimonialsEditor';
import TerminalEditor from './pages/content/TerminalEditor';
import ContactEditor from './pages/content/ContactEditor';
import SEOEditor from './pages/content/SEOEditor';
import ProjectsEditor from './pages/content/ProjectsEditor';
import NavbarEditor from './pages/content/NavbarEditor';
import FooterEditor from './pages/content/FooterEditor';
import SocialLinksEditor from './pages/content/SocialLinksEditor';
import MediaLibrary from './pages/content/MediaLibrary';
import Security from './pages/Security';
import Verify2FA from './pages/auth/Verify2FA';
import PortfolioMetrics from './pages/dashboard/PortfolioMetrics';

const App = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify-2fa" element={<Verify2FA />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} /> 
                <Route path="messages" element={<Messages />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="security" element={<Security />} />
                <Route path="content" element={<ContentIndex />} />
                <Route path="content/hero" element={<HeroEditor />} />
                <Route path="content/about" element={<AboutEditor />} />
                <Route path="content/skills" element={<SkillsEditor />} />
                <Route path="content/experience" element={<ExperienceEditor />} />
                <Route path="content/testimonials" element={<TestimonialsEditor />} />
                <Route path="content/terminal" element={<TerminalEditor />} />
                <Route path="content/contact" element={<ContactEditor />} />
                <Route path="content/projects" element={<ProjectsEditor />} />
                <Route path="content/seo" element={<SEOEditor />} />
                <Route path="content/navbar" element={<NavbarEditor />} />
                <Route path="content/footer" element={<FooterEditor />} />
                <Route path="content/social-links" element={<SocialLinksEditor />} />
                <Route path="content/media-library" element={<MediaLibrary />} />
                <Route path="metrics" element={<PortfolioMetrics />} />
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </ToastProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
