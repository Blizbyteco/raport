import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

const alertConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-success",
    progressClass: "bg-success",
  },
  danger: {
    icon: CircleAlert,
    iconClass: "text-danger",
    progressClass: "bg-danger",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-warning",
    progressClass: "bg-warning",
  },
  info: {
    icon: Info,
    iconClass: "text-primary",
    progressClass: "bg-primary",
  },
};

const Alert = ({ type = "info", message, duration = 3000, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setVisible(false);
        onClose?.();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  const config = alertConfig[type] ?? alertConfig.info;
  const Icon = config.icon;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow">
      <div className="flex items-start gap-3 p-4">
        <Icon className={`mt-0.5 size-5 shrink-0 ${config.iconClass}`} />

        <p className="flex-1 text-sm font-medium text-card-foreground">
          {message}
        </p>

        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-border/50">
        <div
          className={`h-full ${config.progressClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Alert;
