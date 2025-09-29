import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : 'border-gray-200 hover:border-orange-200';
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;