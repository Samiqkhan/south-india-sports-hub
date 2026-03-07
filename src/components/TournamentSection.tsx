import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";

const TournamentSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tournament" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Coming Soon</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">
            Upcoming Tournament
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="bg-card p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                  Featured
                </span>
                <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase rounded-full tracking-wider">
                  Badminton
                </span>
              </div>

              <h3 className="font-display text-3xl md:text-4xl font-bold uppercase mb-8">
                South India Open
                <br />
                <span className="gradient-text">Badminton Tournament</span>
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: Calendar, label: "Date", value: "July 15-20, 2026" },
                  { icon: MapPin, label: "Venue", value: "Chennai Indoor Stadium" },
                  { icon: Trophy, label: "Prize Pool", value: "₹5,00,000" },
                  { icon: Users, label: "Categories", value: "Singles & Doubles" },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-5 text-center">
                    <item.icon className="w-6 h-6 text-electric mx-auto mb-2" />
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#register"
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all text-center"
                >
                  Register Now
                </a>
                <a
                  href="#rules"
                  className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg uppercase tracking-wider hover:bg-secondary transition-all text-center"
                >
                  View Rules
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TournamentSection;
