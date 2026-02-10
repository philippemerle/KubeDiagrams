/**
 * LoadingSpinner Component
 * Reusable loading spinner for asynchronous operations
 */

function LoadingSpinner({ size = 'md', color = 'blue', text = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          ${colorClasses[color] || colorClasses.blue}
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
