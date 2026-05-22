import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Briefcase, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { SOUTH_INDIA_LOCATIONS, SouthIndiaState } from "@/data/locations";

const SponsorRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    state: "" as SouthIndiaState | "",
    city: "",
    sponsorshipLevel: "",
    interestedTournaments: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value as SouthIndiaState, city: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Registration Submitted Successfully",
        description: "Thank you for your interest! Our team will contact you soon.",
      });
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        state: "",
        city: "",
        sponsorshipLevel: "",
        interestedTournaments: "",
        message: "",
      });
    }, 1500);
  };

  const cities = formData.state ? SOUTH_INDIA_LOCATIONS[formData.state as SouthIndiaState] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="grid md:grid-cols-5 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 space-y-8"
            >
              <div>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider mb-4 inline-block">
                  Partner With Us
                </span>
                <h1 className="font-display text-4xl font-bold uppercase mb-4 leading-tight">
                  Become a <span className="gradient-text">Sponsor</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Join South India Sports Hub to elevate your brand presence across premier sporting events. Connect with thousands of athletes and spectators.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-secondary/50 p-3 rounded-lg text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase mb-1">Brand Visibility</h3>
                    <p className="text-sm text-muted-foreground">Prominent placement on arenas, jerseys, and digital platforms.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-secondary/50 p-3 rounded-lg text-electric">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase mb-1">Exclusive VIP Access</h3>
                    <p className="text-sm text-muted-foreground">Premium seating, networking events, and direct engagement with players.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-3 glass-card p-6 md:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Company / Brand Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                      placeholder="e.g. SportsGear Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contactPerson" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Contact Person <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Contact Phone <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      State <span className="text-primary">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none"
                    >
                      <option value="" disabled>Select state</option>
                      {Object.keys(SOUTH_INDIA_LOCATIONS).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      City <span className="text-primary">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={!formData.state}
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Select city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="sponsorshipLevel" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Sponsorship Tier
                    </label>
                    <select
                      id="sponsorshipLevel"
                      name="sponsorshipLevel"
                      value={formData.sponsorshipLevel}
                      onChange={handleChange}
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none"
                    >
                      <option value="" disabled>Select tier</option>
                      <option value="Title Sponsor">Title Sponsor</option>
                      <option value="Co-Sponsor">Co-Sponsor</option>
                      <option value="Associate Sponsor">Associate Sponsor</option>
                      <option value="Equipment Partner">Equipment Partner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="interestedTournaments" className="text-sm font-medium text-foreground uppercase tracking-wider">
                      Interested Tournaments
                    </label>
                    <input
                      type="text"
                      id="interestedTournaments"
                      name="interestedTournaments"
                      value={formData.interestedTournaments}
                      onChange={handleChange}
                      className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                      placeholder="e.g. South India Open, All"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Additional Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body resize-none"
                    placeholder="Tell us about your brand goals or specific sponsorship requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-lg glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Become a Sponsor <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SponsorRegistration;
