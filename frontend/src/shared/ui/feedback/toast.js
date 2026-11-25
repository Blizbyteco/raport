const listeners = new Set();
const recentMessages = new Map();

let nextId = 0;

const DEFAULT_DURATION = 4000;
const DEFAULT_DEDUPE_WINDOW = 1200;
const RECENT_RETENTION = 10000;

const pruneRecent = (now) => {
  recentMessages.forEach((timestamp, key) => {
    if (now - timestamp > RECENT_RETENTION) {
      recentMessages.delete(key);
    }
  });
};

const emit = (type, message, options = {}) => {
  const text = typeof message === "string" ? message.trim() : "";

  if (!text) return null;

  const now = Date.now();
  const key = `${type}:${text}`;
  const dedupeWindow = options.dedupeMs ?? DEFAULT_DEDUPE_WINDOW;
  const lastSeen = recentMessages.get(key);

  if (lastSeen && now - lastSeen < dedupeWindow) {
    return null;
  }

  recentMessages.set(key, now);
  pruneRecent(now);

  const item = {
    id: ++nextId,
    type,
    message: text,
    duration: options.duration ?? DEFAULT_DURATION,
  };

  listeners.forEach((listener) => listener({ type: "add", toast: item }));

  return item.id;
};

const dismiss = (id) => {
  listeners.forEach((listener) => listener({ type: "dismiss", id }));
};

const clear = () => {
  listeners.forEach((listener) => listener({ type: "clear" }));
};

export const toast = {
  success: (message, options) => emit("success", message, options),
  danger: (message, options) => emit("danger", message, options),
  error: (message, options) => emit("danger", message, options),
  warning: (message, options) => emit("warning", message, options),
  info: (message, options) => emit("info", message, options),
  dismiss,
  clear,
};

export const subscribeToasts = (listener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};
