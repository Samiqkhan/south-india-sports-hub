import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Tournament", href: "/#tournament" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Announcement Banner */}
      {isHome && (
        <div className="bg-gradient-to-r from-primary via-electric to-accent text-white text-center py-1.5 md:py-2 px-3 md:px-4 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider relative flex items-center justify-center gap-1 group overflow-hidden">
          <span className="relative z-10 flex items-center gap-1 flex-wrap justify-center">
            🏆 SISA Chess Tournament 2026 registration is live!
            <Link
              to="/tournament/chess-tournament-2026"
              className="underline hover:text-white/80 transition-colors uppercase tracking-widest font-bold flex items-center gap-1 ml-1"
            >
              Click here to redirect →
            </Link>
          </span>
          {/* Sliding glass reflection overlay */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
        </div>
      )}

      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-wider uppercase">
          <span className="gradient-text">SISA</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href.replace("/", "") : link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            
            <Link
              to="/apply"
              className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm uppercase tracking-wider glow-primary hover:brightness-110 transition-all"
            >
              Host Game
            </Link>
            <Link
              to="/sponsor"
              className="px-5 py-2 bg-accent text-accent-foreground font-semibold rounded-lg text-sm uppercase tracking-wider glow-accent hover:brightness-110 transition-all"
            >
              Sponsor
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 pb-6 px-6"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href.replace("/", "") : link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link
              to="/apply"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-sm uppercase tracking-wider glow-primary hover:brightness-110 transition-all"
            >
              Host a Game
            </Link>
            <Link
              to="/sponsor"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-5 py-3 bg-accent text-accent-foreground font-semibold rounded-lg text-sm uppercase tracking-wider glow-accent hover:brightness-110 transition-all"
            >
              Become a Sponsor
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
