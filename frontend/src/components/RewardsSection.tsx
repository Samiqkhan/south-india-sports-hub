import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TournamentFee, TournamentReward } from "@/data/tournaments";

interface RewardsSectionProps {
  rewards?: TournamentReward[];
  fees?: TournamentFee[];
}

const RewardsSection = ({ rewards = [], fees = [] }: RewardsSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Group rewards dynamically
  const getGroup = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes("girls singles") || (lower.includes("girls") && !lower.includes("boys"))) return "Girls Singles";
    if (lower.includes("boys singles") || (lower.includes("boys") && !lower.includes("open"))) return "Boys Singles";
    if (lower.includes("open")) return "Open Category";
    return "Mixed / Youth";
  };

  const groups = Array.from(new Set(rewards.map(r => getGroup(r.level))));
  const [activeGroup, setActiveGroup] = useState("");

  // Sync active group when rewards change or load
  useEffect(() => {
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
  }, [rewards]);

  if (rewards.length === 0 && fees.length === 0) return null;

  const filteredRewards = rewards.filter(r => getGroup(r.level) === activeGroup);

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

        {/* Group Selector Tabs */}
        {groups.length > 1 && activeGroup && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-8 bg-secondary/30 p-1.5 rounded-xl border border-border/40 w-fit mx-auto">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 relative ${
                  activeGroup === group
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeGroup === group && (
                  <motion.div
                    layoutId="activeRewardTab"
                    className="absolute inset-0 bg-primary rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{group}</span>
              </button>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="font-display text-xl font-bold uppercase mb-6 text-primary text-center">Prizes</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRewards.map((r, i) => (
                <div key={i} className="bg-secondary/20 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all flex flex-col justify-between">
                  <h4 className="font-bold text-foreground mb-3 tracking-wide uppercase text-primary border-b border-border/50 pb-2 text-xs md:text-sm truncate" title={r.level}>
                    {r.level}
                  </h4>
                  <div className="space-y-2 text-xs md:text-sm">
                    {r.prizes.map((p, j) => (
                      <div key={j} className="flex justify-between items-center py-1 last:border-0">
                        {p.position && <span className="text-muted-foreground font-medium">{p.position}</span>}
                        <span className={`text-electric font-semibold text-right ${!p.position ? 'w-full text-center' : ''}`}>
                          {p.reward}
                        </span>
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
