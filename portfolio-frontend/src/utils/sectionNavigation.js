/** Section IDs used by the homepage — keep in sync with section components */
export const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
];

export const MOBILE_MENU_CLOSE_MS = 360;

export const getSectionHref = (sectionId, pathname = '/') =>
  pathname === '/' ? `#${sectionId}` : `/#${sectionId}`;

/**
 * Scroll to a section using native scroll-margin (see index.css).
 * Returns false if the target element is missing.
 */
export const scrollToSectionById = (sectionId, behavior = 'smooth') => {
  if (!SECTION_IDS.includes(sectionId)) {
    console.warn(`[nav] Unknown section id: ${sectionId}`);
    return false;
  }

  const element = document.getElementById(sectionId);
  if (!element) {
    console.warn(`[nav] Section element not found: #${sectionId}`);
    return false;
  }

  element.scrollIntoView({ behavior, block: 'start' });
  return true;
};

export const isValidSectionId = (id) => SECTION_IDS.includes(id);
