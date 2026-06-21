import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Settings as SettingsIcon, Code, Briefcase, Star, MessageSquare, Monitor, FolderOpen, Menu as MenuIcon } from 'lucide-react';
import Card from '../components/ui/Card';

const SECTIONS = [
  { path: '/dashboard/content/hero', label: 'Hero Section', icon: Eye, desc: 'Headline, typewriter, CTA buttons, profile image' },
  { path: '/dashboard/content/about', label: 'About Section', icon: FileText, desc: 'Bio, subtitle, stats counters, call-to-action' },
  { path: '/dashboard/content/skills', label: 'Skills Section', icon: Code, desc: 'Skill categories, proficiency bars, icons' },
  { path: '/dashboard/content/experience', label: 'Experience Section', icon: Briefcase, desc: 'Work history, education, timeline entries' },
  { path: '/dashboard/content/projects', label: 'Projects Section', icon: FolderOpen, desc: 'Featured projects, live demos, repositories' },
  { path: '/dashboard/content/testimonials', label: 'Testimonials Section', icon: Star, desc: 'Client feedback, ratings, marquee display' },
  { path: '/dashboard/content/terminal', label: 'Terminal Section', icon: Monitor, desc: 'Interactive terminal commands and responses' },
  { path: '/dashboard/content/contact', label: 'Contact Section', icon: MessageSquare, desc: 'Contact info, form settings, success message' },
  { path: '/dashboard/content/navbar', label: 'Navbar Editor', icon: MenuIcon, desc: 'Brand name, logo, resume button, navigation visibility' },
  { path: '/dashboard/content/seo', label: 'SEO Settings', icon: SettingsIcon, desc: 'Meta tags, Open Graph, social previews' },
];

const ContentIndex = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Content Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage every section of your portfolio independently.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="text-left group"
            >
              <Card className="h-full hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{section.desc}</p>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContentIndex;
