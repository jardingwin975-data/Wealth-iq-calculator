import Home from "./pages/Home";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return <Home />;
}
