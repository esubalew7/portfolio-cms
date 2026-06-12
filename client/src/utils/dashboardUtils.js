/**
 * Formats a timestamp into a human-readable date string.
 * @param {string|number|Date} timestamp - The date to format.
 * @returns {string} - Formatted date string or fallback message.
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'No date available';
  const date = new Date(timestamp);
  if (Number.isNaN(date.valueOf())) return 'No date available';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Normalizes text by providing a fallback for empty or null values.
 * @param {any} value - The value to normalize.
 * @param {string} fallback - The fallback text.
 * @returns {string} - The value or the fallback.
 */
export const normalizedText = (value, fallback = 'No data available') => {
  if (value === undefined || value === null || value === false) return fallback;
  if (typeof value === 'string' && !value.trim()) return fallback;
  return value;
};


