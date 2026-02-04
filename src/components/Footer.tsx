
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              AI Byte Consult Ltd.
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Intelligent Automation, Blockchain & Web3 Solutions — building the future
              of business technology within the NICS AI Ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#ecosystem" className="text-muted-foreground hover:text-primary transition-colors">
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link to="/#projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://estate.aibyteconsult.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  NICS Real Estate
                </a>
              </li>
              <li>
                <Link to="/insurance" className="text-muted-foreground hover:text-primary transition-colors">
                  NICS Insurance
                </Link>
              </li>
              <li>
                <Link to="/translation" className="text-muted-foreground hover:text-primary transition-colors">
                  NICS Translation
                </Link>
              </li>
              <li>
                <Link to="/furnishings" className="text-muted-foreground hover:text-primary transition-colors">
                  NICS Furnishings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <a
                href="mailto:info@aibyteconsult.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@aibyteconsult.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2011–{currentYear} AI Byte Consult Ltd. All rights reserved.
          </p>

          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            Made in EU 🇪🇺 for the World 🗺️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
