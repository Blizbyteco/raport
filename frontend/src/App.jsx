import Routers from "./app/router/router";
import AppErrorBoundary from "@/app/ErrorBoundary";
import Toaster from "@/shared/ui/feedback/Toaster";

const App = () => (
  <AppErrorBoundary>
    <Routers />
    <Toaster />
  </AppErrorBoundary>
);

export default App;
