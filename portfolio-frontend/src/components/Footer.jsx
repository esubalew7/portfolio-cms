import { useContentStore } from '../store/contentStore';
import { SocialIconRow } from './SocialLinks';

export const Footer = () => {
  const content = useContentStore((s) => s.content);
  const footer = content?.footer || {};
  const hero = content?.hero || {};
  const title = hero.name || 'Esubalew';
  const copyright = footer.copyright || `${title}. All rights reserved.`;

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-6 pb-8 transition-colors duration-300 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pr-16 md:pr-20">
          <a href="#home" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
            {title}
          </a>

          <SocialIconRow links={footer.socials} className="gap-5" />
        </div>

        <div className="flex justify-center border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center">
            &copy; {new Date().getFullYear()} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
