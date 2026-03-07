import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const rewards = [
  { tier: "100–250 Teams", reward: "30% per entry to organizer" },
  { tier: "250–500 Teams", reward: "35% per entry to organizer" },
  { tier: "500+ Teams", reward: "40% per entry to organizer" },
];

const fees = [
  { item: "Court Fees", amount: "₹10,000" },
  { item: "Umpire Fees", amount: "₹10,000" },
  { item: "Shuttle Cocks", amount: "₹5,000" },
  { item: "Tournament Management", amount: "₹15,000" },
];

const RewardsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-3">For Organizers</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Reward Structure</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-xl font-bold uppercase mb-4 text-primary">Organizer Rewards</h3>
            <div className="space-y-3">
              {rewards.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <span className="text-foreground font-medium">{r.tier}</span>
                  <span className="text-primary font-semibold">{r.reward}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-xl font-bold uppercase mb-4 text-electric">Fee Breakdown</h3>
            <div className="space-y-3">
              {fees.map((f, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <span className="text-foreground font-medium">{f.item}</span>
                  <span className="text-electric font-semibold">{f.amount}</span>
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
