import { LoaderCircle } from "lucide-react";

const LoadingScreen = ({ message = "Memuat sesi Anda..." }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
    <LoaderCircle className="size-6 animate-spin text-primary" />

    <p className="text-sm font-medium text-muted">{message}</p>
  </div>
);

export default LoadingScreen;
