import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";
import { tournaments } from "@/data/tournaments";

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
          <p className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">Compete & Win</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">
            Our Tournaments
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tournaments.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <Link to={`/tournament/${t.slug}`} className="block group">
                <div className="gradient-border rounded-2xl overflow-hidden hover-lift">
                  <div className="bg-card p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                        {t.status}
                      </span>
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase rounded-full tracking-wider">
                        {t.sport}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold uppercase mb-1">
                      {t.title}
                    </h3>
                    <p className="gradient-text font-display text-lg font-bold uppercase mb-6">
                      {t.subtitle}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-electric" />
                        {t.date}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-electric" />
                        {t.venue}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4 text-electric" />
                        {t.prize}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-sm group-hover:gap-4 transition-all">
                      View Details & Register <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentSection;
