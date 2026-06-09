export { default as Terminal } from './Terminal';
export { default as TerminalViewport } from './TerminalViewport';
export { default as TerminalLine } from './TerminalLine';
export { default as TerminalPrompt } from './TerminalPrompt';
export { default as TypingEffect } from './TypingEffect';
export { default as CommandParser } from './commandParser';
export { useTerminal } from './useTerminal';
export { COMMAND_REGISTRY, WELCOME_MESSAGE } from './commandRegistry';
export { TERMINAL_PROMPT, formatPrompt } from './terminalConstants';

// Legacy exports — kept for backward compatibility
export { default as TerminalDisplay } from './TerminalDisplay';
export { default as TerminalInput } from './TerminalInput';
