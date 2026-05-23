import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, MonitorPlay, ArrowRight } from "lucide-react";

const HostGameSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Online Registrations",
      description: "Hassle-free digital entry forms, automated fee collection, and dynamic draw management.",
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      title: "Live Scoring",
      description: "Real-time match updates, digital scoreboards, and instant results broadcasts.",
      icon: <MonitorPlay className="w-8 h-8 text-primary" />,
    },
    {
      title: "Complete Management",
      description: "Professional arbiters & umpires, top-tier venues, official equipment, and end-to-end event execution.",
      icon: <Trophy className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">
              Partner With Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6">
              Host Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-electric">
                Tournament
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">
              Want to organize an unforgettable sports tournament? We provide the digital infrastructure and operational expertise to make your event a massive success.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all group"
            >
              Contact to Host
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 md:p-8 flex gap-6 items-start hover:border-primary/50 transition-colors group"
              >
                <div className="p-4 bg-secondary/50 rounded-2xl group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl uppercase tracking-wider mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HostGameSection;
