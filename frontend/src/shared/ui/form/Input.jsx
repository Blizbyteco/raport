const sizeClasses = {
  S: "h-9 px-3 text-xs",
  M: "h-10 px-3.5 text-sm",
  L: "h-12 px-4 text-base",
};

const Input = ({
  label,
  labelProps = {},
  required = false,
  icon: Icon,
  iconPosition = "left",
  size = "M",
  error,
  className = "",
  ...props
}) => {
  const hasIcon = Boolean(Icon);

  const paddingClass = hasIcon
    ? iconPosition === "left"
      ? "pl-10"
      : "pr-10"
    : "";

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-2 block text-xs font-normal text-dark sm:text-sm"
          {...labelProps}
        >
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative w-full">
        {hasIcon && iconPosition === "left" && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        )}

        <input
          required={required}
          className={`
            w-full rounded-lg border bg-card font-normal text-dark
            placeholder:text-muted outline-none transition-colors
            disabled:cursor-not-allowed disabled:opacity-50
            ${sizeClasses[size]}
            ${paddingClass}
            ${
              error
                ? "border-danger focus:border-danger"
                : "border-border focus:border-foreground/50"
            }
            ${className}
          `}
          {...props}
        />

        {hasIcon && iconPosition === "right" && (
          <Icon
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Input;
