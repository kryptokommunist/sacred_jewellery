import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [cartCount] = useState(2); // todo: remove mock functionality

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              Sacred Geometry
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#necklaces" className="text-foreground hover:text-primary transition-colors" data-testid="link-necklaces">
              Necklaces
            </a>
            <a href="#earrings" className="text-foreground hover:text-primary transition-colors" data-testid="link-earrings">
              Earrings
            </a>
            <a href="#rings" className="text-foreground hover:text-primary transition-colors" data-testid="link-rings">
              Rings
            </a>
            <a href="#customizer" className="text-foreground hover:text-primary transition-colors" data-testid="link-customizer">
              3D Designer
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  data-testid="badge-cart-count"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}