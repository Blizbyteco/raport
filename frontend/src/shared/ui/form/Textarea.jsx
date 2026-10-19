const Textarea = ({ label, required = false, className = "", ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs sm:text-sm font-normal text-dark">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      <textarea
        className={`min-h-24 w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-dark outline-none transition-colors focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;
