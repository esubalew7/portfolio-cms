import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ContactSection } from '../sections/ContactSection';

export const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};
