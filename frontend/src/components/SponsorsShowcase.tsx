import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TournamentSponsors } from "@/data/tournaments";
import { Trophy, DollarSign, Award, Phone } from "lucide-react";

interface SponsorsShowcaseProps {
  sponsors?: TournamentSponsors;
}

const SponsorsShowcase = ({ sponsors }: SponsorsShowcaseProps) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  if (!sponsors || (!sponsors.trophyPrize.length && !sponsors.cashPrize.length)) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section ref={containerRef} className="section-padding relative overflow-hidden bg-badminton-lines">
      {/* Decorative gradient glowing backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-electric/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Our Valued Partners</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide">
            Event <span className="gradient-text">Sponsors</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-electric mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* TROPHY SPONSORS SECTION */}
        {sponsors.trophyPrize && sponsors.trophyPrize.length > 0 && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4"
            >
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Trophy className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  Trophy Prize Sponsors
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Sponsoring custom badminton trophies & medals</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {sponsors.trophyPrize.map((sponsor, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="group relative rounded-2xl overflow-hidden p-[1px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(5,255,213,0.15)] bg-gradient-to-b from-primary/20 to-border/10 hover:from-primary/50 hover:to-electric/40"
                >
                  <div className="bg-card/90 backdrop-blur-md rounded-[15px] p-6 flex flex-col items-center text-center h-full transition-transform duration-300 group-hover:scale-[0.99]">
                    {/* Sponsor Logo Container */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-background border border-border/50 flex items-center justify-center mb-4 relative group-hover:border-primary/40 transition-all duration-300">
                      <img
                        src={sponsor.photo}
                        alt={sponsor.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    {/* Sponsor Name & Company */}
                    <div className="mb-2">
                      <h4 className="font-display text-base md:text-lg font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors leading-tight">
                        {sponsor.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                        {sponsor.company}
                      </p>
                    </div>
                    {/* Badge / Subtext / Prize Value */}
                    <div className="flex flex-col gap-1.5 mt-2 items-center">
                      {sponsor.prizeValue && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                          Trophy Value: {sponsor.prizeValue}
                        </span>
                      )}
                      {sponsor.subText && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                          <Trophy className="w-3 h-3" /> {sponsor.subText}
                        </span>
                      )}
                    </div>
                    {/* Phone Number */}
                    {sponsor.phone && (
                      <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                        {sponsor.phone.split(",").map((num, idx) => {
                          const cleanNum = num.trim();
                          return (
                            <a
                              key={idx}
                              href={`tel:${cleanNum}`}
                              className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors bg-secondary/30 hover:bg-secondary/60 px-2.5 py-1 rounded-full border border-border/40 font-mono"
                            >
                              <Phone className="w-3 h-3 text-primary shrink-0" />
                              <span>{cleanNum}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* CASH SPONSORS SECTION */}
        {sponsors.cashPrize && sponsors.cashPrize.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4"
            >
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <DollarSign className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  Cash Prize Sponsors
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Empowering the tournament prize pool</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {sponsors.cashPrize.map((sponsor, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="group relative rounded-2xl overflow-hidden p-[1px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] bg-gradient-to-b from-accent/20 to-border/10 hover:from-accent/50 hover:to-electric/40"
                >
                  <div className="bg-card/90 backdrop-blur-md rounded-[15px] p-6 flex flex-col items-center text-center h-full transition-transform duration-300 group-hover:scale-[0.99]">
                    {/* Sponsor Logo Container */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-background border border-border/50 flex items-center justify-center mb-4 relative group-hover:border-accent/40 transition-all duration-300">
                      <img
                        src={sponsor.photo}
                        alt={sponsor.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    {/* Sponsor Name & Company */}
                    <div className="mb-2">
                      <h4 className="font-display text-base md:text-lg font-bold uppercase tracking-wide text-foreground group-hover:text-accent transition-colors leading-tight">
                        {sponsor.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                        {sponsor.company}
                      </p>
                    </div>
                    {/* Badge / Subtext / Prize Value */}
                    <div className="flex flex-col gap-1.5 mt-2 items-center">
                      {sponsor.prizeValue && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                          Prize Value: {sponsor.prizeValue}
                        </span>
                      )}
                      {sponsor.subText && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent/80 bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                          <Award className="w-3 h-3" /> {sponsor.subText}
                        </span>
                      )}
                    </div>
                    {/* Phone Number */}
                    {sponsor.phone && (
                      <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                        {sponsor.phone.split(",").map((num, idx) => {
                          const cleanNum = num.trim();
                          return (
                            <a
                              key={idx}
                              href={`tel:${cleanNum}`}
                              className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground hover:text-accent transition-colors bg-secondary/30 hover:bg-secondary/60 px-2.5 py-1 rounded-full border border-border/40 font-mono"
                            >
                              <Phone className="w-3 h-3 text-accent shrink-0" />
                              <span>{cleanNum}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsShowcase;
