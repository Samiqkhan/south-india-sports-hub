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
          {tournaments.map((t, i) => {
            const isChess = t.sport.toLowerCase() === "chess";
            const borderClass = isChess ? "gradient-border-chess" : "gradient-border-badminton";
            const bgPatternClass = isChess ? "bg-chess-checkers" : "bg-badminton-lines";
            const statusBadgeClass = isChess 
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/10" 
              : "bg-primary/20 text-primary border border-primary/10";
            const sportBadgeClass = isChess 
              ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/10" 
              : "bg-electric/20 text-electric border border-electric/10";
            const subtitleClass = isChess
              ? "bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"
              : "bg-clip-text text-transparent bg-gradient-to-r from-primary via-electric to-blue-400";
            const iconClass = isChess ? "text-amber-500" : "text-electric";
            const linkTextClass = isChess ? "text-amber-400" : "text-primary";
            const arrowIconClass = isChess ? "text-amber-400" : "text-primary";
            const watermarkEmoji = isChess ? "♞" : "🏸";
            const watermarkColor = isChess ? "text-amber-500/5" : "text-primary/5";

            return (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
              >
                <Link to={`/tournament/${t.slug}`} className="block group">
                  <div className={`${borderClass} rounded-2xl overflow-hidden hover-lift`}>
                    <div className={`bg-card ${bgPatternClass} p-8 relative overflow-hidden min-h-[340px] flex flex-col justify-between`}>
                      {/* Watermark Logo */}
                      <div className={`absolute right-4 bottom-4 ${watermarkColor} text-9xl pointer-events-none select-none font-bold translate-x-4 translate-y-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        {watermarkEmoji}
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 ${statusBadgeClass} text-xs font-bold uppercase rounded-full tracking-wider`}>
                            {t.status}
                          </span>
                          <span className={`px-3 py-1 ${sportBadgeClass} text-xs font-bold uppercase rounded-full tracking-wider`}>
                            {t.sport}
                          </span>
                        </div>

                        <h3 className="font-display text-2xl font-bold uppercase mb-1">
                          {t.title}
                        </h3>
                        <p className={`${subtitleClass} font-display text-lg font-bold uppercase mb-6`}>
                          {t.subtitle}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Calendar className={`w-4 h-4 ${iconClass}`} />
                            {t.date}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className={`w-4 h-4 ${iconClass}`} />
                            {t.venue}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Trophy className={`w-4 h-4 ${iconClass}`} />
                            {t.prize}
                          </div>
                        </div>
                      </div>

                      <div className={`relative z-10 flex items-center gap-2 ${linkTextClass} font-semibold uppercase tracking-wider text-sm group-hover:gap-4 transition-all`}>
                        View Details & Register <ArrowRight className={`w-4 h-4 ${arrowIconClass}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TournamentSection;
