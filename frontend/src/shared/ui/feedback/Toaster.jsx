import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { subscribeToasts } from "./toast";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-success",
  },
  danger: {
    icon: CircleAlert,
    iconClass: "text-danger",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-warning",
  },
  info: {
    icon: Info,
    iconClass: "text-primary",
  },
};

const MAX_VISIBLE = 4;

const ToastItem = ({ toast, onDismiss }) => {
  const config = toastConfig[toast.type] ?? toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (!toast.duration) return;

    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`mt-0.5 size-5 shrink-0 ${config.iconClass}`} />

        <p className="flex-1 text-sm font-medium text-card-foreground">
          {toast.message}
        </p>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
          aria-label="Tutup notifikasi"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(
    () =>
      subscribeToasts((action) => {
        if (action.type === "add") {
          setToasts((current) =>
            [...current, action.toast].slice(-MAX_VISIBLE),
          );
          return;
        }

        if (action.type === "dismiss") {
          setToasts((current) =>
            current.filter((item) => item.id !== action.id),
          );
          return;
        }

        if (action.type === "clear") {
          setToasts([]);
        }
      }),
    [],
  );

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end sm:px-0"
    >
      {toasts.map((item) => (
        <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
      ))}
    </div>
  );
};

export default Toaster;
