import { LoaderCircle } from "lucide-react";

const sizeClasses = {
  S: "h-9 px-3 text-xs gap-2",
  M: "h-10 px-4 text-xs sm:text-sm gap-2",
  L: "h-12 px-5 text-sm sm:text-base gap-2",
};

const iconOnlySizeClasses = {
  S: "size-9",
  M: "size-10",
  L: "size-12",
};

const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-light hover:bg-secondary/90",
  danger: "bg-danger text-light hover:bg-danger/90",
  outline: "border border-border bg-transparent text-dark hover:bg-card",
  ghost: "bg-transparent text-dark hover:bg-card",
};

const Button = ({
  children,
  variant = "primary",
  size = "M",
  icon: Icon,
  iconPosition = "left",
  iconOnly = false,
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || isLoading;
  const sizeClass = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size];

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${sizeClass} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="size-4" />}
          {!iconOnly && children}
          {Icon && iconPosition === "right" && <Icon className="size-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
