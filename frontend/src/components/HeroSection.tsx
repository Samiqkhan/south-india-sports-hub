import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-electric/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        
        {/* Shuttle SVGs floating */}
        <div className="absolute top-1/4 right-1/4 text-primary/20 animate-shuttle-float text-6xl">🏸</div>
        <div className="absolute bottom-1/3 left-1/5 text-electric/20 animate-shuttle-float text-4xl" style={{ animationDelay: "1.5s" }}>🏸</div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm md:text-base mb-4">
            Official Tournament Platform
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.95] mb-6">
            South India
            <br />
            <span className="gradient-text">Sports Association</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Empowering athletes across South India through world-class tournaments, 
            professional organization, and a passion for sporting excellence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md mx-auto sm:max-w-none"
        >
          <a
            href="#tournament"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg text-sm sm:text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all hover:scale-105"
          >
            Register for Tournament
          </a>
          <a
            href="/apply"
            className="px-6 py-3 sm:px-8 sm:py-4 border border-border text-foreground font-bold rounded-lg text-sm sm:text-lg uppercase tracking-wider hover:bg-secondary transition-all hover:scale-105"
          >
            Host a Game
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="text-muted-foreground" size={32} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
