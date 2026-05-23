import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Megaphone, Flag } from "lucide-react";

const SponsorSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: Megaphone,
      title: "Brand Exposure",
      description: "Gain massive visibility across our tournaments, digital platforms, and live audiences.",
    },
    {
      icon: Flag,
      title: "Exclusive Naming Rights",
      description: "Become a title or co-sponsor for premium tournaments and own the spotlight.",
    },
    {
      icon: Sparkles,
      title: "Community Impact",
      description: "Support local sports ecosystems and be recognized as a champion of athletic development.",
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background styling elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 blur-3xl rounded-full translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/5 to-transparent -z-10 blur-3xl rounded-full -translate-x-1/2" />

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Partner With Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-6 leading-tight">
              Empower <span className="gradient-text">Athletes</span> & Elevate Your Brand
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Join South India Sports Hub to elevate your brand presence across premier sporting events. We offer customizable sponsorship packages designed to maximize your ROI while supporting the next generation of champions.
            </p>

            <div className="space-y-6 mb-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 bg-secondary/80 p-3 rounded-lg text-primary shrink-0 h-fit">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase mb-1 text-foreground tracking-wide">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/sponsor"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all shadow-lg hover:-translate-y-1"
            >
              Become a Sponsor Today
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
             <div className="glass-card p-2 md:p-3 relative z-10 group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
               <img
                  src="/sponsorship_cover.png"
                  alt="Athletes celebrating on court"
                  className="rounded-lg object-cover w-full h-[260px] sm:h-[400px] md:h-[500px] shadow-2xl relative z-10 filter brightness-90 group-hover:brightness-100 transition-all duration-500"
               />
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="font-display font-bold text-lg uppercase tracking-wider text-foreground mb-1">Impact Driven</p>
                    <p className="text-sm text-muted-foreground">Reaching 50,000+ targeted sports enthusiasts yearly.</p>
               </div>
             </div>
             
             {/* Decorative accent elements */}
             <div className="absolute -hidden lg:block -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
             <div className="absolute -hidden lg:block -bottom-6 -left-6 w-24 h-24 border-b-2 border-l-2 border-accent/30 rounded-bl-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
