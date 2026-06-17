import { SocialIconRow } from './SocialLinks';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-6 pb-8 transition-colors duration-300 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Row 1: Name and Socials with safe-area padding to avoid ScrollToTop overlap */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pr-16 md:pr-20">
          <a href="#home" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
            Esu<span className="text-gray-800 dark:text-white">balew</span>
          </a>

          <SocialIconRow className="gap-5" />
        </div>

        {/* Row 2: Centered Copyright */}
        <div className="flex justify-center border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center">
            &copy; {new Date().getFullYear()} Esubalew. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
