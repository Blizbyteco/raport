import { X } from "lucide-react";

const sizeClasses = {
  S: "max-w-sm",
  M: "max-w-lg",
  L: "max-w-2xl",
  XL: "max-w-4xl",
};

const Modal = ({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = "M",
  closeOnOverlayClick = true,
  showClose = true,
  className = "",
}) => {
  if (!open) return null;

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`w-full ${sizeClasses[size]} overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl ${className}`}
      >
        {(title || description || showClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              {title && (
                <h2 id="modal-title" className="text-base font-bold">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-muted">{description}</p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                title="Tutup"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        <div className="px-5 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
