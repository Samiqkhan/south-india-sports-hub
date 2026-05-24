import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { SOUTH_INDIA_LOCATIONS, SouthIndiaState } from "@/data/locations";
import { addTournamentApplication } from "@/lib/storage";

const ApplyTournament = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizerName: "",
    tournamentTitle: "",
    sport: "",
    state: "" as SouthIndiaState | "",
    city: "",
    expectedDates: "",
    expectedTeams: "",
    email: "",
    phone: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value as SouthIndiaState, city: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to TiDB Cloud database via Express proxy
      await addTournamentApplication({
        organizerName: formData.organizerName,
        tournamentTitle: formData.tournamentTitle,
        sport: formData.sport,
        state: formData.state,
        city: formData.city,
        expectedDates: formData.expectedDates,
        expectedTeams: formData.expectedTeams,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
      });

      toast({
        title: "Application Submitted Successfully",
        description: "We've received your application and will get back to you shortly.",
      });

      setFormData({
        organizerName: "",
        tournamentTitle: "",
        sport: "",
        state: "",
        city: "",
        expectedDates: "",
        expectedTeams: "",
        email: "",
        phone: "",
        details: "",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "Could not connect to database. Please check connection parameters.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cities = formData.state ? SOUTH_INDIA_LOCATIONS[formData.state as SouthIndiaState] : [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      <Navbar />

      <section className="pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider mb-4 inline-block">
              Host With Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4">
              Apply to Host Your <span className="gradient-text">Tournament</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Fill out the form below to bring your game to the South India Sports Association platform. We provide end-to-end
              tournament management solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="organizerName" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Organizer / Company Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="organizerName"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                    placeholder="e.g. Smashers Club"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tournamentTitle" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Tournament Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="tournamentTitle"
                    name="tournamentTitle"
                    value={formData.tournamentTitle}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                    placeholder="e.g. Winter Open 2026"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="sport" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Sport Category <span className="text-primary">*</span>
                  </label>
                  <select
                    id="sport"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none"
                  >
                    <option value="" disabled>Select a sport</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="expectedDates" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Expected Dates
                  </label>
                  <input
                    type="text"
                    id="expectedDates"
                    name="expectedDates"
                    value={formData.expectedDates}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                    placeholder="e.g. October 15-20, 2026"
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
                  <label htmlFor="email" className="text-sm font-medium text-foreground uppercase tracking-wider">
                    Contact Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                    placeholder="you@example.com"
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

              <div className="space-y-2">
                <label htmlFor="expectedTeams" className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Expected Number of Teams / Participants
                </label>
                <select
                  id="expectedTeams"
                  name="expectedTeams"
                  value={formData.expectedTeams}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none"
                >
                  <option value="" disabled>Select expected scale</option>
                  <option value="Under 50">Under 50</option>
                  <option value="50 - 150">50 - 150</option>
                  <option value="150 - 300">150 - 300</option>
                  <option value="300+">300+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="details" className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Additional Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body resize-none"
                  placeholder="Tell us more about your tournament, specific requirements, or questions..."
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
                    Submit Application <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApplyTournament;
