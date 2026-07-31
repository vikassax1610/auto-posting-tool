const Textarea = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`w-full resize-none rounded-xl border bg-bg px-3.5 py-3 text-sm leading-6 text-white placeholder:text-muted/70 outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? 'border-error' : 'border-border hover:border-muted/50'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  );
};

export default Textarea;
