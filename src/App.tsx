import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const JWTDecoder = lazy(() => import("./pages/JWTDecoder"));
const JsonToTypescript = lazy(() => import("./pages/JsonToTypescript"));
const SQLFormatter = lazy(() => import("./pages/SQLFormatter"));
const CronVisualizer = lazy(() => import("./pages/CronVisualizer"));
const RegexTester = lazy(() => import("./pages/RegexTester"));
const Base64Encoder = lazy(() => import("./pages/Base64Encoder"));
const CurlConverter = lazy(() => import("./pages/CurlConverter"));
const YamlJsonConverter = lazy(() => import("./pages/YamlJsonConverter"));
const MarkdownPreviewer = lazy(() => import("./pages/MarkdownPreviewer"));
const PasswordGenerator = lazy(() => import("./pages/PasswordGenerator"));

const queryClient = new QueryClient();

function ToolSkeleton() {
  return (
    <div className="pt-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-surface2 rounded" />
        <div className="h-10 w-96 bg-surface2 rounded" />
        <div className="h-4 w-64 bg-surface2 rounded" />
        <div className="h-6 w-48 bg-surface2 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="h-64 bg-surface2 rounded-lg" />
          <div className="h-64 bg-surface2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<ToolSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jwt-decoder" element={<JWTDecoder />} />
              <Route path="/json-to-typescript" element={<JsonToTypescript />} />
              <Route path="/sql-formatter" element={<SQLFormatter />} />
              <Route path="/cron-visualizer" element={<CronVisualizer />} />
              <Route path="/regex-tester" element={<RegexTester />} />
              <Route path="/base64-encoder" element={<Base64Encoder />} />
              <Route path="/curl-converter" element={<CurlConverter />} />
              <Route path="/yaml-json-converter" element={<YamlJsonConverter />} />
              <Route path="/markdown-previewer" element={<MarkdownPreviewer />} />
              <Route path="/password-generator" element={<PasswordGenerator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
