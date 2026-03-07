import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle, Upload } from "lucide-react";

interface RegistrationSectionProps {
  categories?: string[];
}

const RegistrationSection = ({ categories = ["singles", "doubles"] }: RegistrationSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="register" className="section-padding" ref={ref}>
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-12"
          >
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="font-display text-3xl font-bold uppercase mb-4">Registration Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for registering. We'll send a confirmation to your email shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg uppercase tracking-wider hover:bg-secondary transition-all"
            >
              Register Another Player
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Join the Competition</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Register Now</h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-10 space-y-6"
        >
          {[
            { name: "playerName", label: "Player Name", type: "text", placeholder: "Enter your full name" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
            { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
            { name: "city", label: "City", type: "text", placeholder: "Your city" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          ))}

          {categories.length > 1 && (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Category
              </label>
              <div className="flex gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex-1 py-3 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all ${
                      category === cat
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {category === "doubles" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Partner Name
              </label>
              <input
                type="text"
                placeholder="Enter partner's full name"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Payment Screenshot
            </label>
            <label className="flex items-center justify-center gap-3 w-full py-6 bg-secondary/30 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Click to upload screenshot</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all"
          >
            Submit Registration
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RegistrationSection;
