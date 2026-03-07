import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TournamentSection from "@/components/TournamentSection";
import RulesSection from "@/components/RulesSection";
import RegistrationSection from "@/components/RegistrationSection";
import RewardsSection from "@/components/RewardsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TournamentSection />
      <RulesSection />
      <RegistrationSection />
      <RewardsSection />
      <GallerySection />
      <ContactSection />
      <Footer />

      {/* Floating Register Button */}
      <a
        href="#register"
        className="fixed bottom-6 right-6 z-40 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full uppercase tracking-wider text-sm glow-primary hover:brightness-110 hover:scale-105 transition-all shadow-xl md:hidden"
      >
        Register
      </a>
    </div>
  );
};

export default Index;
