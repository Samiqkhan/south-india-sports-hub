import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TournamentSection from "@/components/TournamentSection";
import GallerySection from "@/components/GallerySection";
import SponsorSection from "@/components/SponsorSection";
import HostGameSection from "@/components/HostGameSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TournamentSection />
      <SponsorSection />
      <HostGameSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
