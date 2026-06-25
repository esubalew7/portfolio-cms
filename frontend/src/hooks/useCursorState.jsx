import { createContext, useContext, useState, useCallback, useRef } from 'react';

const CursorStateContext = createContext(null);

export function CursorStateProvider({ children, onStateChange }) {
  const [cursorState, setCursorStateRaw] = useState('default');
  const [label, setLabel] = useState('');
  const previousState = useRef('default');

  const setCursorState = useCallback(
    (newState, newLabel) => {
      if (previousState.current !== newState) {
        previousState.current = newState;
        setCursorStateRaw(newState);
        setLabel(newLabel || '');
        onStateChange?.(newState, newLabel || '');
      }
    },
    [onStateChange]
  );

  const resetCursorState = useCallback(() => {
    previousState.current = 'default';
    setCursorStateRaw('default');
    setLabel('');
    onStateChange?.('default', '');
  }, [onStateChange]);

  return (
    <CursorStateContext.Provider
      value={{ cursorState, label, setCursorState, resetCursorState }}
    >
      {children}
    </CursorStateContext.Provider>
  );
}

export function useCursorState() {
  const context = useContext(CursorStateContext);
  if (!context) {
    throw new Error('useCursorState must be used within a CursorStateProvider');
  }
  return context;
}
