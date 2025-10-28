import { cn } from '../../utils/helpers';

/**
 * Professional button component with Tailwind styling
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-wider';
  
  const variants = {
    primary: 'bg-primary-800 text-white hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg focus:ring-primary-500 disabled:bg-gray-300 disabled:hover:translate-y-0 disabled:hover:shadow-none',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:-translate-y-0.5 hover:shadow-md focus:ring-gray-500 disabled:bg-gray-50 disabled:hover:translate-y-0',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg focus:ring-red-500 disabled:bg-red-300 disabled:hover:translate-y-0',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 focus:ring-gray-500 disabled:hover:translate-y-0',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
};

/**
 * Input component with Tailwind styling
 */
export const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Textarea component with Tailwind styling
 */
export const Textarea = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  rows = 3,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 resize-none leading-relaxed',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Card component with Tailwind styling
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-professional hover:shadow-professional-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Loading spinner component with Tailwind styling
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2', 
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-3',
  };

  return (
    <div className={cn('flex justify-center items-center p-4', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-gray-300 border-t-accent-600',
          sizes[size]
        )}
      />
    </div>
  );
};

/**
 * Alert/Message component with Tailwind styling
 */
export const Alert = ({ type = 'info', children, onClose, className = '' }) => {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-800 border-l-green-500',
    error: 'bg-red-50 border-red-200 text-red-800 border-l-red-500',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 border-l-amber-500',
    info: 'bg-blue-50 border-blue-200 text-blue-800 border-l-blue-500',
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-l-4 p-4 shadow-sm animate-fade-in',
        types[type],
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded hover:bg-white"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Metric card component with Tailwind styling
 */
export const MetricCard = ({ title, value, icon, className = '' }) => {
  return (
    <Card className={cn('p-6 text-center border-l-4 border-l-accent-500 hover-scale', className)}>
      <div className="flex items-center justify-center mb-2">
        {icon && <div className="mr-2 text-accent-600">{icon}</div>}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-accent-600 font-serif">{value}</p>
    </Card>
  );
};