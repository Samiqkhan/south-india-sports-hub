import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { TournamentVenue } from "@/data/tournaments";

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  venues: TournamentVenue[];
}

const VenueModal = ({ isOpen, onClose, venues }: VenueModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 border-b border-border/50">
                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wider flex items-center gap-3">
                  <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  Tournament Venues
                </h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  Matches will be held across multiple locations grouped by district.
                </p>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  {venues.map((venueDistrict, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-primary uppercase tracking-widest font-bold text-sm mb-4 pb-2 border-b border-white/10">
                        {venueDistrict.district}
                      </h3>
                      <ul className="space-y-3">
                        {venueDistrict.locations.map((loc, locIndex) => (
                          <li
                            key={locIndex}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors gap-3"
                          >
                            <span className="font-medium text-foreground">{loc}</span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc + ', ' + venueDistrict.district)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-md text-sm font-semibold transition-colors w-fit"
                            >
                              <MapPin className="w-4 h-4" /> View on Map
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VenueModal;
