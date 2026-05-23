import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TournamentFee, TournamentReward } from "@/data/tournaments";

interface RewardsSectionProps {
  rewards?: TournamentReward[];
  fees?: TournamentFee[];
}

const RewardsSection = ({ rewards = [], fees = [] }: RewardsSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  if (rewards.length === 0 && fees.length === 0) return null;

  return (
    <section className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">For Players & Organizers</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Event Levels & Prizes</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="font-display text-xl font-bold uppercase mb-4 text-primary text-center">Prizes</h3>
            <div className="space-y-6">
              {rewards.map((r, i) => (
                <div key={i} className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                  <h4 className="font-bold text-foreground mb-3 tracking-wider uppercase text-primary border-b border-border/50 pb-2">{r.level}</h4>
                  <div className="space-y-2">
                    {r.prizes.map((p, j) => (
                      <div key={j} className="flex justify-between items-center py-2 last:border-0">
                        {p.position && <span className="text-foreground font-medium">{p.position}</span>}
                        <span className={`text-electric font-semibold ${!p.position ? 'w-full' : ''}`}>{p.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
