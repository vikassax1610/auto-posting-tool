const Textarea = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold text-muted uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`w-full resize-none rounded-xl border bg-bg px-4 py-3 text-sm text-white placeholder-muted/50 outline-none transition-colors focus:border-primary ${
          error ? 'border-muted' : 'border-border'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-muted font-medium">{error}</p>}
    </div>
  );
};

export default Textarea;
