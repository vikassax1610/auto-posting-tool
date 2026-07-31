const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 ${
        hover ? 'hover:border-primary/40 hover:bg-card-hover hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
