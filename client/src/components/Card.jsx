const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors duration-200 ${
        hover ? 'hover:border-primary/50 hover:bg-bg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
