import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Trophy, Users, MapPin, Target } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Players Registered" },
  { icon: Trophy, value: 25, suffix: "+", label: "Tournaments Held" },
  { icon: MapPin, value: 10, suffix: "+", label: "Cities Covered" },
  { icon: Target, value: 5, suffix: "+", label: "Sports Disciplines" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl font-bold gradient-text">
      {count}{suffix}
    </span>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Who We Are</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-6">
            About the Association
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The South India Sports Association (SISA) is dedicated to promoting competitive sports
            across South India. We organize professional-grade tournaments, nurture emerging talent,
            and build a vibrant sporting community that spans across states and cities.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center hover-lift"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
