import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Import components
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import JewelryGallery from "@/components/JewelryGallery";
import JewelryCustomizer from "@/components/JewelryCustomizer";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import SacredGeometryElements from "@/components/SacredGeometryElements";

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sacred Geometry Background */}
      <SacredGeometryElements variant="background" />
      
      {/* Navigation with Theme Toggle */}
      <div className="relative z-50">
        <Navigation />
        <div className="fixed top-4 right-20 z-50">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <Hero />

        {/* Gallery Section */}
        <JewelryGallery />

        {/* Sacred Geometry Divider */}
        <SacredGeometryElements variant="divider" />

        {/* Customizer Section */}
        <JewelryCustomizer />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;