import { SocialIconRow } from './SocialLinks';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-10 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="mb-6">
          <a href="#home" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
            Esu<span className="text-gray-800 dark:text-white">balew</span>
          </a>
        </div>
        
        {/* Render beautifully styled row of SVGs directly from standard component */}
        <div className="mb-6">
          <SocialIconRow className="gap-6" />
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Esubalew. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
