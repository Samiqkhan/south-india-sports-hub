import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Trophy, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RulesSection from "@/components/RulesSection";
import RegistrationSection from "@/components/RegistrationSection";
import { tournaments } from "@/data/tournaments";

const TournamentDetail = () => {
  const { slug } = useParams();
  const tournament = tournaments.find((t) => t.slug === slug);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Tournament Not Found</h2>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const details = [
    { icon: Calendar, label: "Date", value: tournament.date },
    { icon: MapPin, label: "Venue", value: tournament.venue },
    { icon: Trophy, label: "Prize Pool", value: tournament.prize },
    { icon: Users, label: "Categories", value: tournament.categories },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                {tournament.status}
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase rounded-full tracking-wider">
                {tournament.sport}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4">
              {tournament.title}
              <br />
              <span className="gradient-text">{tournament.subtitle}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed mb-10">
              {tournament.description}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {details.map((item) => (
                <div key={item.label} className="glass-card p-5 text-center hover-lift">
                  <item.icon className="w-6 h-6 text-electric mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rules */}
      <RulesSection rules={tournament.rules} />

      {/* Registration */}
      <RegistrationSection categories={tournament.registrationCategories} />

      <Footer />
    </div>
  );
};

export default TournamentDetail;
