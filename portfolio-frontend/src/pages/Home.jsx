import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { TerminalSection } from '../sections/TerminalSection';
import ExperienceSection from '../sections/ExperienceSection';
import { ContactSection } from '../sections/ContactSection';

export const Home = () => {
  return (
    <div className="relative isolate overflow-hidden">
      {/* 
        Handcrafted Ambient Gradients
        These massive blurred orbs sit behind the sections and blend organically,
        creating a premium, template-free glassmorphism appearance.
      */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[45%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50rem] h-[50rem] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <HeroSection />

      <div className="relative border-y border-gray-200/50 dark:border-white/5 backdrop-blur-sm bg-white/40 dark:bg-black/10 transition-colors">
        <TerminalSection />
      </div>

      <div className="relative border-y border-gray-200/50 dark:border-white/5 backdrop-blur-sm bg-white/40 dark:bg-black/10 transition-colors">
        <AboutSection />
      </div>

      <div className="relative bg-gradient-to-b from-transparent via-gray-50/50 to-transparent dark:via-gray-900/30">
        <SkillsSection />
      </div>

      <ProjectsSection />



      <div className="relative bg-gradient-to-t from-gray-50 dark:from-gray-950/80 to-transparent pt-8">
        <ExperienceSection />
      </div>

      <div className="relative bg-gradient-to-t from-gray-50 dark:from-gray-950/80 to-transparent pt-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent"></div>
        <ContactSection />
      </div>
    </div>
  );
};
