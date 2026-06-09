import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, Phone, Clock, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RulesSection from "@/components/RulesSection";
import RegistrationSection from "@/components/RegistrationSection";
import RewardsSection from "@/components/RewardsSection";
import VenueModal from "@/components/VenueModal";
import { tournaments } from "@/data/tournaments";
import { getGameFees, GameFee } from "@/lib/storage";

const TournamentDetail = () => {
  const { slug } = useParams();
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [gameFees, setGameFees] = useState<GameFee[]>([]);
  const tournament = tournaments.find((t) => t.slug === slug);

  // Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Load database game fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const fees = await getGameFees();
        setGameFees(fees);
      } catch (err) {
        console.error("Failed to load fees from database:", err);
      }
    };
    fetchFees();
  }, [slug]);

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

  if (tournament.lastDateToRegister) {
    details.push({ icon: Clock, label: "Last Date to Register", value: tournament.lastDateToRegister });
  }

  if (tournament.reportingTime) {
    details.push({ icon: Clock, label: "Reporting Time", value: tournament.reportingTime });
  }

  if (tournament.contactNumbers && tournament.contactNumbers.length > 0) {
    details.push({ icon: Phone, label: "Contact Numbers", value: tournament.contactNumbers.join(", ") });
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
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

            <h1 className="font-display text-2xl sm:text-4xl md:text-6xl font-bold uppercase mb-4 leading-tight">
              {tournament.title}
              <br />
              <span className="gradient-text">{tournament.subtitle}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed mb-10">
              {tournament.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {details.map((item) => {
                const isVenue = item.label === "Venue" && tournament.mapUrl;
                
                if (isVenue) {
                  return (
                    <a
                      key={item.label}
                      href={tournament.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card p-3.5 sm:p-5 text-center cursor-pointer hover:border-primary/50 transition-colors group relative hover-lift block"
                    >
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-electric mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="font-semibold text-xs sm:text-sm md:text-base text-foreground truncate" title={item.value}>{item.value}</p>
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest mt-12 bg-background/80 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1">
                          View on Maps <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </a>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className="glass-card p-3.5 sm:p-5 text-center hover-lift flex flex-col justify-center"
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-electric mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-foreground break-words" title={item.value}>{item.value}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Registration */}
      <RegistrationSection 
        tournamentTitle={tournament.title}
        categories={tournament.registrationCategories} 
        ageCategories={tournament.ageCategories}
        playerFees={(tournament.playerFees || []).map(pf => {
          const match = gameFees.find(gf => 
            gf.tournamentSlug === slug &&
            gf.ageCategory.toLowerCase() === pf.ageCategory.toLowerCase() &&
            gf.category.toLowerCase() === pf.category.toLowerCase()
          );
          return match ? { ...pf, fee: match.fee } : pf;
        })} 
      />

      {/* Rewards & Fees */}
      <RewardsSection 
        rewards={tournament.rewards} 
        fees={(tournament.fees || []).map(f => {
          if (f.item === "Entry Fee") {
            const dbFees = gameFees.filter(gf => gf.tournamentSlug === slug);
            if (dbFees.length > 0) {
              const distinctFees = Array.from(new Set(dbFees.map(x => x.fee)));
              return { ...f, amount: distinctFees.length === 1 ? distinctFees[0] : distinctFees.join(" - ") };
            }
          }
          return f;
        })} 
      />

      {/* Rules */}
      <RulesSection rules={tournament.rules} />

      {/* Sponsor CTA */}
      <section className="pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
           <div className="glass-card p-8 border-accent/30 text-center">
             <h3 className="font-display text-2xl font-bold uppercase mb-4">Want to Sponsor {tournament.title}?</h3>
             <p className="text-muted-foreground mb-6">Gain exclusive brand visibility and partner with us for this amazing event.</p>
             <Link to="/sponsor" className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg text-sm uppercase tracking-wider glow-accent hover:brightness-110 transition-all inline-block">
               Become a Sponsor
             </Link>
           </div>
        </div>
      </section>

      {tournament.venueDetails && (
        <VenueModal
          isOpen={isVenueModalOpen}
          onClose={() => setIsVenueModalOpen(false)}
          venues={tournament.venueDetails}
        />
      )}

      <Footer />
    </div>
  );
};

export default TournamentDetail;
