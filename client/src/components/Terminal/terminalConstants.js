export const TERMINAL_PROMPT = {
  user: 'esubalew',
  host: 'portfolio',
  path: '~',
};

export const formatPrompt = () =>
  `${TERMINAL_PROMPT.user}@${TERMINAL_PROMPT.host}:${TERMINAL_PROMPT.path}$`;

export const createLineId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
