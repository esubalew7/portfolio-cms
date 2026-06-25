import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const PRIMARY = '#2563eb';

export const TimelineLine = React.memo(({ progress }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0 w-0.5">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: isDarkMode
            ? 'rgba(37,99,235,0.08)'
            : 'rgba(37,99,235,0.04)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 rounded-full transition-all duration-200 ease-out"
        style={{
          height: `${Math.max(progress * 100, 2)}%`,
          backgroundColor: PRIMARY,
          boxShadow: isDarkMode
            ? `0 0 8px ${PRIMARY}40, 0 0 20px ${PRIMARY}15`
            : `0 0 8px ${PRIMARY}30, 0 0 20px ${PRIMARY}08`,
        }}
      />
    </div>
  );
});
