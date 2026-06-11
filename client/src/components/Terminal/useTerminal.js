import { useState, useRef, useCallback, useEffect } from 'react';
import CommandParser from './commandParser';
import { COMMAND_REGISTRY, WELCOME_MESSAGE } from './commandRegistry';
import { createLineId } from './terminalConstants';

const COMMAND_LIST = Object.keys(COMMAND_REGISTRY.commands);

export function useTerminal({ welcomeMessage = WELCOME_MESSAGE } = {}) {
  const parserRef = useRef(new CommandParser(COMMAND_REGISTRY));
  const viewportRef = useRef(null);

  const [lines, setLines] = useState([
    { id: createLineId(), type: 'welcome', content: welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [savedInput, setSavedInput] = useState('');

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const appendLine = useCallback((line) => {
    setLines((prev) => [...prev, { id: createLineId(), ...line }]);
  }, []);

  const handleSideEffect = useCallback((result) => {
    if (result.type === 'link') {
      setTimeout(() => {
        window.open(result.url, '_blank', 'noopener,noreferrer');
      }, 200);
      return;
    }

    if (result.type === 'download') {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = result.fileUrl;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 200);
    }
  }, []);

  const executeCommand = useCallback(
    (rawCommand) => {
      const command = rawCommand.trim();
      if (!command) return;

      appendLine({ type: 'command', content: command });
      setCommandHistory((prev) => [...prev, command]);

      const parsed = parserRef.current.parse(command);
      const result = parserRef.current.execute(parsed);

      if (result.type === 'clear') {
        setLines([]);
        setInput('');
        setHistoryIndex(null);
        return;
      }

      if (result.type === 'error') {
        appendLine({ type: 'error', content: result.output });
      } else {
        appendLine({
          type: 'output',
          content: result.output,
          animated: result.animated ?? false,
        });
        handleSideEffect(result);
      }

      setInput('');
      setHistoryIndex(null);
      setSavedInput('');
    },
    [appendLine, handleSideEffect]
  );

  const clearTerminal = useCallback(() => {
    setLines([
      {
        id: createLineId(),
        type: 'output',
        content: "Terminal cleared. Type 'help' to see available commands.",
        animated: false,
      },
    ]);
    setInput('');
    setHistoryIndex(null);
  }, []);

  const navigateHistory = useCallback(
    (direction) => {
      if (commandHistory.length === 0) return;

      if (historyIndex === null && direction === 1) return;

      let nextIndex;
      if (historyIndex === null) {
        setSavedInput(input);
        nextIndex = commandHistory.length - 1;
      } else {
        nextIndex = historyIndex + direction;
      }

      if (nextIndex < 0) {
        nextIndex = 0;
      } else if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInput(savedInput);
        return;
      }

      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    },
    [commandHistory, historyIndex, input, savedInput]
  );

  const autocomplete = useCallback(() => {
    const trimmed = input.toLowerCase().trim();
    if (!trimmed) return;

    const matches = COMMAND_LIST.filter((cmd) => cmd.startsWith(trimmed));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      const currentIndex = matches.indexOf(input.toLowerCase().trim());
      const nextIndex = (currentIndex + 1) % matches.length;
      setInput(matches[nextIndex]);
    }
  }, [input]);

  const handleInputChange = useCallback((value) => {
    setInput(value);
    setHistoryIndex(null);
  }, []);

  return {
    lines,
    input,
    setInput: handleInputChange,
    executeCommand,
    clearTerminal,
    navigateHistory,
    autocomplete,
    viewportRef,
    commands: COMMAND_LIST,
    commandCount: commandHistory.length,
  };
}
