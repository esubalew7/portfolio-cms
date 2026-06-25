export const INTERACTION_ELEMENTS = {
  button: {
    selector: 'button, [role="button"], .btn, input[type="submit"], input[type="button"]',
    state: 'click',
    label: 'CLICK',
  },
  link: {
    selector: 'a[href], [role="link"]',
    state: 'visit',
    label: 'VISIT',
  },
  project: {
    selector: '[data-cursor="project"], .project-card, [data-cursor="explore"]',
    state: 'explore',
    label: 'EXPLORE',
  },
  github: {
    selector: '[data-cursor="code"], .github-link, [href*="github"]',
    state: 'code',
    label: 'CODE',
  },
  skill: {
    selector: '[data-cursor="view"], .skill-node, [data-cursor="skill"]',
    state: 'view',
    label: 'VIEW',
  },
  social: {
    selector: '[data-cursor="open"], .social-link, .social-icon',
    state: 'open',
    label: 'OPEN',
  },
  save: {
    selector: '[data-cursor="save"]',
    state: 'save',
    label: 'SAVE',
  },
  delete: {
    selector: '[data-cursor="delete"]',
    state: 'delete',
    label: 'DELETE',
  },
  upload: {
    selector: '[data-cursor="upload"]',
    state: 'upload',
    label: 'UPLOAD',
  },
};

export function getInteractionState(target) {
  const element = target.closest(
    Object.values(INTERACTION_ELEMENTS)
      .map((e) => e.selector)
      .join(',')
  );
  if (!element) return null;

  for (const [, config] of Object.entries(INTERACTION_ELEMENTS)) {
    if (element.closest(config.selector)) {
      return { state: config.state, label: config.label, element };
    }
  }
  return null;
}

export function setupInteractionObserver() {
  const observer = new MutationObserver(() => {
    const elements = document.querySelectorAll('[data-cursor]');
    for (const el of elements) {
      const state = el.dataset.cursor;
      if (state && INTERACTION_ELEMENTS[state]) {
        el.dataset.cursorState = INTERACTION_ELEMENTS[state].state;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
