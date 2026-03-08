import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle, Upload } from "lucide-react";
import { PlayerFee } from "@/data/tournaments";

interface RegistrationSectionProps {
  categories?: string[];
  ageCategories?: string[];
  playerFees?: PlayerFee[];
}

const RegistrationSection = ({ categories = [], ageCategories = [], playerFees = [] }: RegistrationSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [age, setAge] = useState(ageCategories[0] || "");
  const [category, setCategory] = useState(categories[0] || "");
  const [partnerName, setPartnerName] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
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

  if (step === 2 && !submitted) {
    const feeObj = playerFees.find(
      (f) =>
        f.category.toLowerCase() === category.toLowerCase() &&
        f.ageCategory.toLowerCase() === age.toLowerCase()
    );
    const selectedFee = feeObj ? feeObj.fee : "₹0";

    return (
      <section id="register" className="section-padding" ref={ref}>
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12"
          >
            <h3 className="font-display text-3xl font-bold uppercase mb-8">Payment Details</h3>
            
            <div className="mb-8 space-y-6">
              <div className="text-left space-y-3 bg-secondary/10 p-4 rounded-xl border border-border/50">
                <p className="text-muted-foreground uppercase tracking-wider text-xs font-semibold mb-2">Selected Event</p>
                <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border border-border/50 text-sm">
                  <span className="font-semibold uppercase tracking-wider">{age} - {category}</span>
                  <span className="text-primary font-bold">{selectedFee}</span>
                </div>
              </div>
              
              <div className="p-6 bg-secondary/30 rounded-xl border border-border">
                <p className="text-muted-foreground uppercase tracking-wider text-sm font-semibold mb-2">Total Amount</p>
                <p className="text-5xl font-bold text-primary">{selectedFee}</p>
              </div>
            </div>
            
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-4 bg-[#3395FF] text-white font-bold rounded-lg text-lg uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-3 drop-shadow-md"
            >
              Pay with Razorpay
            </button>
            
            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 py-3 bg-secondary/20 text-foreground font-semibold rounded-lg text-sm uppercase tracking-wider hover:bg-secondary/50 transition-all"
            >
               Back to Details
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

        {playerFees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-xl mx-auto"
          >
            <div className="glass-card overflow-hidden border border-primary/20">
               <div className="bg-primary/10 p-3 border-b border-primary/20 text-center">
                  <h3 className="font-display font-bold uppercase tracking-widest text-primary text-xs">Pricing Table</h3>
               </div>
               <div className="overflow-x-auto w-full">
                 <table className="w-full text-center border-collapse text-sm">
                   <thead>
                     <tr className="bg-primary/5">
                       <th className="p-3 border-b sm:border-r border-primary/10 font-bold uppercase tracking-wider text-xs text-muted-foreground w-1/3">Age Group</th>
                       <th className="p-3 border-b sm:border-r border-primary/10 font-bold uppercase tracking-wider text-xs text-muted-foreground w-1/3">Singles</th>
                       <th className="p-3 border-b border-primary/10 font-bold uppercase tracking-wider text-xs text-muted-foreground w-1/3">Doubles</th>
                     </tr>
                   </thead>
                   <tbody>
                     {ageCategories.map((ageGroup, idx) => {
                        const singlesFee = playerFees.find(f => f.ageCategory === ageGroup && f.category.toLowerCase() === "singles")?.fee || "-";
                        const doublesFee = playerFees.find(f => f.ageCategory === ageGroup && f.category.toLowerCase() === "doubles")?.fee || "-";
                        
                        if (singlesFee === "-" && doublesFee === "-") return null;

                        return (
                          <tr key={idx} className="hover:bg-secondary/30 transition-colors border-b border-border/30 last:border-b-0">
                            <td className="p-3 sm:border-r border-border/30 text-foreground font-semibold uppercase tracking-widest">{ageGroup}</td>
                            <td className="p-3 sm:border-r border-border/30 text-electric font-bold">{singlesFee}</td>
                            <td className="p-3 text-electric font-bold">{doublesFee}</td>
                          </tr>
                        );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}

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

          {ageCategories.length > 0 && categories.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="bg-secondary/20 p-5 rounded-xl border border-border/50 relative">
                <h4 className="font-bold text-foreground mb-4 tracking-wider uppercase text-primary border-b border-border/50 pb-2">
                  Event Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Age Category
                    </label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Age</option>
                      {ageCategories.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Event Type
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Type</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {category.toLowerCase().includes("doubles") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="pt-4 mt-4 border-t border-border/30"
                  >
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter partner's full name"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all"
          >
            Next: Payment
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RegistrationSection;
