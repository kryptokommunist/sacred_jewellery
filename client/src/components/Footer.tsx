import { Sparkles, Heart, Mail, Globe } from "lucide-react";
import SacredGeometryElements from "./SacredGeometryElements";

export default function Footer() {
  return (
    <footer className="relative bg-card border-t border-card-border mt-16">
      <SacredGeometryElements variant="background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl font-bold text-foreground">
                Sacred Geometry
              </span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Creating beautiful, customizable 3D printed jewelry inspired by ancient sacred geometry, 
              golden ratio proportions, and the mathematical patterns found in nature.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-primary" />
              <span>Handcrafted with love and precision</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-quick-links-title">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#necklaces" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-necklaces">
                  Necklaces
                </a>
              </li>
              <li>
                <a href="#earrings" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-earrings">
                  Earrings
                </a>
              </li>
              <li>
                <a href="#rings" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-rings">
                  Rings
                </a>
              </li>
              <li>
                <a href="#customizer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-customizer">
                  3D Designer
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-support-title">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-printing-guide">
                  3D Printing Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-size-guide">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-materials">
                  Materials & Care
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <SacredGeometryElements variant="divider" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span data-testid="text-copyright">© 2025 Sacred Geometry Jewelry. All rights reserved.</span>
            <div className="hidden sm:flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>Worldwide shipping available</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </a>
            <a href="mailto:hello@sacredgeometry.jewelry" className="flex items-center gap-1 hover:text-primary transition-colors" data-testid="link-footer-email">
              <Mail className="w-4 h-4" />
              <span>hello@sacredgeometry.jewelry</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}