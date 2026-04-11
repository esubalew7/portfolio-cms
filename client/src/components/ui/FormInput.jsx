const FormInput = ({ 
  label, 
  error, 
  id, 
  type = 'text', 
  textarea = false, 
  ...props 
}) => {
  const inputStyles = `w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-sans ${
    error 
      ? 'border-red-500 dark:border-red-900/50' 
      : 'border-gray-200 dark:border-gray-700'
  }`;

  return (
    <div className="space-y-1.5 font-sans">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      {textarea ? (
        <textarea
          id={id}
          className={`${inputStyles} resize-none`}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputStyles}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
