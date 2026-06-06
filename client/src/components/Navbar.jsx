import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { socialLinks } from './SocialLinks';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

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
    setIsMenuOpen(false); // Close mobile menu when clicked

    if (location.pathname !== '/') {
      // If we are not on the homepage, let the standard link behavior navigate to the homepage with the hash
      return;
    }

    e.preventDefault();
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
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' }, 
  ];

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed z-50 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl transition-all duration-500 ease-out ${isScrolled
        ? 'top-4 py-2.5 px-6 bg-white/70 dark:bg-black/60 border-neutral-200/60 dark:border-neutral-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-lg scale-[0.98] rounded-[24px]'
        : 'top-6 py-4 px-8 bg-white/40 dark:bg-black/30 border-neutral-200/30 dark:border-neutral-800/40 shadow-none backdrop-blur-md scale-100 rounded-[32px]'
        } border flex flex-col justify-center`}
    >
      <div className="flex justify-between items-center w-full">
        {/* Logo / Brand Name */}
        <motion.a
          href={location.pathname === '/' ? '#home' : '/'}
          onClick={(e) => scrollToSection(e, 'home')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-[22px] font-extrabold tracking-tight flex items-center gap-2 group cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            E
          </div>
          <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent transition-colors duration-300">
            Esu<span className="font-medium text-neutral-500 dark:text-neutral-400">balew</span>
          </span>
        </motion.a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-200/30 dark:bg-neutral-900/40 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-800/40">
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.id && location.pathname === '/';
            const href = link.id === 'experience'
              ? (location.pathname === '/' ? `#${link.id}` : `/${link.id}`)
              : (location.pathname === '/' ? `#${link.id}` : `/#${link.id}`);

            return (
              <a
                key={link.id}
                href={href}
                onClick={(e) => scrollToSection(e, link.id)}
                onPointerEnter={() => setHoveredIndex(index)}
                onPointerLeave={() => setHoveredIndex(null)}
                className={`relative px-5 py-2.5 text-[15px] font-medium rounded-full transition-colors duration-300 ${isActive
                  ? 'text-neutral-950 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover indicator */}
                {!isActive && hoveredIndex === index && (
                  <motion.span
                    layoutId="hover-nav-pill"
                    className="absolute inset-0 bg-neutral-300/40 dark:bg-neutral-800/30 rounded-full z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm dark:shadow-[0_0_12px_rgba(255,255,255,0.03)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 overflow-hidden group cursor-pointer"
            aria-label="Toggle Theme"
          >
            {/* Glow background effect */}
            <span className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                  ) : (
                    <Moon className="w-4 h-4 text-neutral-600 fill-neutral-600/10" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Dashboard Button */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/dashboard"
              className="relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-950 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.25)] border border-neutral-800 dark:border-neutral-200/80 group transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Dashboard</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Control Buttons */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle for Mobile */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.92 }}
            className="p-2.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-600 fill-neutral-600/10" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Menu Drawer Toggle */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.92 }}
            className="p-2.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <X className="w-4.5 h-4.5" />
                ) : (
                  <Menu className="w-4.5 h-4.5" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Expandable Glass Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden w-full flex flex-col mt-3"
          >
            <div className="h-[1px] bg-neutral-200/50 dark:bg-neutral-800/50 w-full my-2.5" />
            <div className="flex flex-col space-y-1.5 pb-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id && location.pathname === '/';
                const href = link.id === 'experience'
                  ? (location.pathname === '/' ? `#${link.id}` : `/${link.id}`)
                  : (location.pathname === '/' ? `#${link.id}` : `/#${link.id}`);

                return (
                  <a
                    key={link.id}
                    href={href}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={`block py-3 px-5 rounded-full text-[15px] font-medium tracking-wide transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/60'
                      }`}
                  >
                    {link.name}
                  </a>
                );
              })}

              <div className="h-[1px] bg-neutral-200/50 dark:bg-neutral-800/50 w-full my-2" />

              {/* Mobile Dashboard Link */}
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-full text-[15px] font-semibold tracking-wide bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Socials */}
            <div className="flex justify-center items-center py-4.5 border-t border-neutral-200/30 dark:border-neutral-800/30">
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
