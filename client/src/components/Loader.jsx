const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const Loader = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-primary border-t-transparent ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
