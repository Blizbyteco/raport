import { Component } from "react";

import Button from "@/shared/ui/button/Button";

class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error", error, info);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-lg font-bold text-foreground">
          Terjadi kesalahan pada aplikasi
        </h1>

        <p className="max-w-md text-sm text-muted">
          {error.message || "Silakan muat ulang halaman untuk melanjutkan."}
        </p>

        <Button onClick={() => window.location.assign("/")}>
          Muat Ulang
        </Button>
      </div>
    );
  }
}

export default AppErrorBoundary;
