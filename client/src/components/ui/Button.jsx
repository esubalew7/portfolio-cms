import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  loading = false, 
  variant = 'primary', 
  className = '', 
  icon: Icon,
  type = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none font-sans";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20",
    outline: "border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="relative flex items-center justify-center gap-2">
        {loading && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        {!loading && Icon && (
          <Icon size={18} />
        )}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Button;
