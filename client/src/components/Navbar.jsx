import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { socialLinks } from './SocialLinks';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDarkMode, toggleTheme } = useTheme();

  // Watch for scroll position changes using Intersection Observer for precise active highlighting
  useEffect(() => {
    const handleScrollState = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScrollState);

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: "-20% 0px -70% 0px" // Trigger highlight when section nears upper half of viewport
    });

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScrollState);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Smooth scroll handler targeting exact section offset
  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu when clicked

    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-3'
        : 'bg-white dark:bg-gray-900 py-5'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide"
        >
          Esu<span className="text-gray-800 dark:text-white">balew</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`text-base font-large transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${activeSection === link.id
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-700 dark:text-gray-300'
                }`}
            >
              {link.name}
            </a>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>


          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Action Buttons */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isMenuOpen ? 'max-h-[30rem] opacity-100 py-4' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col px-6 space-y-2 pb-4 border-b border-gray-200 dark:border-gray-800">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${activeSection === link.id
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              {link.name}
            </a>
          ))}


          {/* Dashboard Link for Mobile */}
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 px-4 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Render Socials on Mobile Dropdown Bottom */}
        <div className="flex justify-center items-center py-6 px-4">
          <div className="flex gap-6">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
