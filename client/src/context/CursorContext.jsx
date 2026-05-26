import { createContext, useContext, useState } from 'react';

/**
 * CursorContext
 * Exposes cursor state globally so any component can trigger
 * cursor variant changes without prop-drilling.
 *
 * Variants: 'default' | 'hover' | 'button' | 'link' | 'card' | 'drag' | 'text'
 */
const CursorContext = createContext(undefined);

export const CursorProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant, cursorText, setCursorText }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor must be used within CursorProvider');
  return ctx;
};
