import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContentStore } from '../store/contentStore';
import { platformIcons } from './SocialLinks';
import {
  SECTION_IDS,
  MOBILE_MENU_CLOSE_MS,
  getSectionHref,
  scrollToSectionById,
  isValidSectionId,
} from '../utils/sectionNavigation';

const ACTIVE_LAYOUT_ID = 'nav-active-pill';
const ACTIVE_SPRING = { type: 'spring', stiffness: 400, damping: 34, mass: 0.8 };

const DesktopNavLink = memo(function DesktopNavLink({ link, isActive, pathname, onNavigate }) {
  return (
    <a
      href={getSectionHref(link.id, pathname)}
      onClick={(e) => onNavigate(e, link.id)}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'relative isolate px-5 py-2.5 text-[15px] font-medium rounded-full',
        'transition-[color,background-color] duration-200 ease-out',
        isActive
          ? 'text-neutral-950 dark:text-white'
          : [
              'text-neutral-500 dark:text-neutral-400',
              'hover:text-neutral-800 dark:hover:text-neutral-100',
              'hover:bg-neutral-500/[0.07] dark:hover:bg-white/[0.06]',
            ].join(' '),
      ].join(' ')}
    >
      {isActive && (
        <motion.span
          layoutId={ACTIVE_LAYOUT_ID}
          className="absolute inset-0 rounded-full bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)] dark:ring-1 dark:ring-white/[0.04]"
          transition={ACTIVE_SPRING}
        />
      )}
      <span className="relative z-10 select-none">{link.label}</span>
    </a>
  );
});

const MobileNavLink = memo(function MobileNavLink({ link, isActive, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(link.id)}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full text-left py-3 px-5 rounded-full text-[15px] font-medium tracking-wide transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
          : 'text-neutral-700 dark:text-neutral-300 active:bg-neutral-100 dark:active:bg-neutral-900/60'
      }`}
    >
      {link.label}
    </button>
  );
});

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTimeoutRef = useRef(null);

  const content = useContentStore((s) => s.content);
  const socialLinks = content?.socialLinks || [];
  const navbar = content?.navbar || {};
  const hero = content?.hero || {};
  const isHomePage = location.pathname === '/';

  const sections = content?.sections || {};
  const brandName = hero.name || 'Esubalew';
  const logoUrl = navbar.logo;

  const visibleNavItems = useMemo(() => {
    return (navbar.navItems || []).filter((item) => sections[item.id] !== false);
  }, [navbar.navItems, sections]);

  const activeIndex = useMemo(() => {
    if (!isHomePage) return -1;
    return visibleNavItems.findIndex((link) => link.id === activeSection);
  }, [activeSection, isHomePage, visibleNavItems]);

  const runScroll = useCallback((sectionId, delay = 0) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const scroll = () => {
      if (scrollToSectionById(sectionId)) {
        setActiveSection(sectionId);
      }
    };

    if (delay > 0) {
      scrollTimeoutRef.current = setTimeout(scroll, delay);
    } else {
      scroll();
    }
  }, []);

  /** Central navigation — desktop (immediate scroll) & mobile (scroll after menu closes) */
  const navigateToSection = useCallback(
    (e, sectionId, { isMobile = false } = {}) => {
      e?.preventDefault();
      if (!isValidSectionId(sectionId, sections)) return;

      setIsMenuOpen(false);
      setActiveSection(sectionId);

      if (!isHomePage) {
        navigate('/', { state: { scrollTo: sectionId } });
        return;
      }

      runScroll(sectionId, isMobile ? MOBILE_MENU_CLOSE_MS : 0);
    },
    [isHomePage, navigate, runScroll, sections]
  );

  const handleMobileNavigate = useCallback(
    (sectionId) => navigateToSection(null, sectionId, { isMobile: true }),
    [navigateToSection]
  );

  // Scroll after cross-route navigation (e.g. /experience → Home section)
  useEffect(() => {
    const pending = location.state?.scrollTo;
    if (!isHomePage || !pending || !isValidSectionId(pending, sections)) return;

    const timer = setTimeout(() => {
      scrollToSectionById(pending);
      setActiveSection(pending);
      navigate(location.pathname, { replace: true, state: {} });
    }, 150);

    return () => clearTimeout(timer);
  }, [isHomePage, location.pathname, location.state, navigate, sections]);

  // Handle direct hash URLs: /#projects
  useEffect(() => {
    if (!isHomePage || !location.hash) return;

    const sectionId = location.hash.replace('#', '');
    if (!isValidSectionId(sectionId, sections)) return;

    const timer = setTimeout(() => {
      scrollToSectionById(sectionId);
      setActiveSection(sectionId);
    }, 150);

    return () => clearTimeout(timer);
  }, [isHomePage, location.hash, sections]);

  // Active section tracking via IntersectionObserver (re-bind when home mounts)
  useEffect(() => {
    if (!isHomePage) return undefined;

    const handleScrollState = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScrollState, { passive: true });

    let observer;
    const setupObserver = () => {
      const sectionIds = visibleNavItems.map((item) => item.id);
      const selector = sectionIds.map((id) => `#${id}`).join(',');
      const sections = document.querySelectorAll(selector);

      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible[0]?.target?.id) {
            setActiveSection(visible[0].target.id);
          }
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      sections.forEach((section) => observer.observe(section));
    };

    const timer = setTimeout(setupObserver, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollState);
      observer?.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isHomePage, visibleNavItems]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`fixed z-50 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl transition-all duration-500 ease-out ${
        isScrolled
          ? 'top-4 py-2.5 px-6 bg-white/70 dark:bg-black/60 border-neutral-200/60 dark:border-neutral-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-lg scale-[0.98] rounded-[24px]'
          : 'top-6 py-4 px-8 bg-white/40 dark:bg-black/30 border-neutral-200/30 dark:border-neutral-800/40 shadow-none backdrop-blur-md scale-100 rounded-[32px]'
      } border flex flex-col justify-center`}
    >
      <div className="flex justify-between items-center w-full">
        <motion.a
          href={isHomePage ? '#home' : '/'}
          onClick={(e) =>
            navigateToSection(e, 'home', {
              isMobile: window.matchMedia('(max-width: 767px)').matches,
            })
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-[22px] font-extrabold tracking-tight flex items-center gap-2 group cursor-pointer select-none"
        >
          {logoUrl ? (
            <img src={logoUrl} alt={brandName} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              {brandName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
            {brandName}
          </span>
        </motion.a>

        <nav className="hidden md:flex items-center gap-1 bg-neutral-200/30 dark:bg-neutral-900/40 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-800/40">
          {visibleNavItems.map((link, index) => (
            <DesktopNavLink
              key={link.id}
              link={link}
              isActive={activeIndex === index}
              pathname={location.pathname}
              onNavigate={navigateToSection}
            />
          ))}
        </nav>

       <div className="hidden md:flex items-center gap-3">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm dark:shadow-[0_0_12px_rgba(255,255,255,0.03)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 overflow-hidden group cursor-pointer"
            aria-label="Toggle Theme"
          >
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
        </div>

        <div className="md:hidden flex items-center gap-2">
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

          <motion.button
            onClick={() => setIsMenuOpen((open) => !open)}
            whileTap={{ scale: 0.92 }}
            className="p-2.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden w-full flex flex-col mt-3"
            aria-label="Mobile navigation"
          >
            <div className="h-[1px] bg-neutral-200/50 dark:bg-neutral-800/50 w-full my-2.5" />
            <div className="flex flex-col space-y-1.5 pb-3">
              {visibleNavItems.map((link) => (
                <MobileNavLink
                  key={link.id}
                  link={link}
                  isActive={activeSection === link.id && isHomePage}
                  onNavigate={handleMobileNavigate}
                />
              ))}

            </div>

            <div className="flex justify-center items-center py-4.5 border-t border-neutral-200/30 dark:border-neutral-800/30">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {platformIcons[link.platform] || (
                      <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-neutral-200 dark:bg-neutral-700 rounded">
                        {link.platform[0]}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
