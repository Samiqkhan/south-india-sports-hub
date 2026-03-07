import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const rules = [
  {
    title: "1. Match Format",
    content: "All matches will be played in a best-of-3 games format. Each game is played to 21 points with a 2-point lead required. At 29-all, the side scoring the 30th point wins. Rally point scoring system applies throughout.",
  },
  {
    title: "2. Entry Rules",
    content: "Players must register at least 7 days before the tournament. Valid ID proof and age verification are mandatory. Registration fees are non-refundable. A maximum of 256 entries per category will be accepted on a first-come, first-served basis.",
  },
  {
    title: "3. Court Regulations",
    content: "All matches will be played on BWF-approved synthetic courts. Players must wear proper non-marking sports shoes. Only BWF-approved feather shuttlecocks will be used. Players are allowed a 60-second rest between games.",
  },
  {
    title: "4. Referee Decisions",
    content: "The referee's decision is final and binding. Video review may be used for semi-finals and finals. Players can request one challenge per game. Misconduct or unsportsmanlike behavior may result in immediate disqualification.",
  },
  {
    title: "5. Player Conduct",
    content: "Players must report to the venue 30 minutes before their scheduled match. Failure to report on time will result in a walkover. Players must adhere to the dress code and display their registration ID at all times. No coaching is allowed during live play.",
  },
];

const RulesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="rules" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-electric uppercase tracking-[0.2em] text-sm font-semibold mb-3">Know Before You Play</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">
            Tournament Rules
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {rules.map((rule, i) => (
              <AccordionItem
                key={i}
                value={`rule-${i}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="font-display text-lg font-semibold uppercase tracking-wide hover:text-primary transition-colors py-5 hover:no-underline">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default RulesSection;
