import { ChevronDown } from "lucide-react";

const sizeClasses = {
  S: "h-9 px-3 text-xs",
  M: "h-10 px-3.5 text-sm",
  L: "h-12 px-4 text-base",
};

const Select = ({
  label,
  required = false,
  icon: Icon,
  iconPosition = "left",
  size = "M",
  className = "",
  children,
  ...props
}) => {
  const hasIcon = Boolean(Icon);
  const paddingClass = hasIcon
    ? iconPosition === "left"
      ? "pl-10 pr-9"
      : "pl-3.5 pr-9"
    : "pl-3.5 pr-9";

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-xs sm:text-sm font-normal text-foreground">
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

        {hasIcon && iconPosition === "right" && (
          <Icon
            className="pointer-events-none absolute right-9 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        )}

        <select
          required={required}
          className={`w-full appearance-none rounded-lg border border-border bg-card font-medium text-foreground outline-none transition-colors focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${paddingClass} ${className}`}
          {...props}
        >
          {children}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Select;
