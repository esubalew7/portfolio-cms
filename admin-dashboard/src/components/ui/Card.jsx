const Card = ({ children, className = '', padding = true, glass = false, hover = false }) => {
  const base = glass
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50'
    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800';

  return (
    <div
      className={`${base} shadow-sm rounded-2xl ${padding ? 'p-6' : ''} ${
        hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
