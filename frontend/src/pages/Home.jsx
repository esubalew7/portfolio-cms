import React, { Suspense } from 'react';
import { useContentStore } from '../store/contentStore';
import { HeroSection } from '../sections/HeroSection';

const AboutSection = React.lazy(() =>
  import('../sections/AboutSection').then(m => ({ default: m.AboutSection }))
);
const SkillsSection = React.lazy(() =>
  import('../sections/SkillsSection').then(m => ({ default: m.SkillsSection }))
);
const ProjectsSection = React.lazy(() =>
  import('../sections/ProjectsSection').then(m => ({ default: m.ProjectsSection }))
);
const TerminalSection = React.lazy(() =>
  import('../sections/TerminalSection').then(m => ({ default: m.TerminalSection }))
);
const ExperienceSection = React.lazy(() =>
  import('../sections/ExperienceSection').then(m => ({ default: m.default }))
);
const ContactSection = React.lazy(() =>
  import('../sections/ContactSection').then(m => ({ default: m.ContactSection }))
);

const SectionFallback = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const sectionWrapper = (Component, className = '') => (
  <div className={className}>
    <Suspense fallback={<SectionFallback />}>
      <Component />
    </Suspense>
  </div>
);

export const Home = () => {
  const sections = useContentStore((s) => s.content?.sections || {});

  return (
    <div className="relative isolate overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[45%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50rem] h-[50rem] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {sections.hero !== false && <HeroSection />}

      {sections.terminal !== false && sectionWrapper(TerminalSection, 'relative border-y border-gray-200/50 dark:border-white/5 backdrop-blur-sm bg-white/40 dark:bg-black/10 transition-colors')}

      {sections.about !== false && sectionWrapper(AboutSection, 'relative border-y border-gray-200/50 dark:border-white/5 backdrop-blur-sm bg-white/40 dark:bg-black/10 transition-colors')}

      {sections.skills !== false && sectionWrapper(SkillsSection, 'relative bg-gradient-to-b from-transparent via-gray-50/50 to-transparent dark:via-gray-900/30')}

      {sections.projects !== false && sectionWrapper(ProjectsSection)}

      {sections.experience !== false && sectionWrapper(ExperienceSection)}

      {sections.contact !== false && sectionWrapper(ContactSection, 'relative bg-gradient-to-t from-gray-50 dark:from-gray-950/80 to-transparent pt-10')}
    </div>
  );
};
