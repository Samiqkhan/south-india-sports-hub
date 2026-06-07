import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop", alt: "Badminton match" },
  { src: "https://images.unsplash.com/photo-1613918431703-aa50889e3be4?w=600&h=400&fit=crop", alt: "Tournament venue" },
  { src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop", alt: "Awards ceremony" },
  { src: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=400&fit=crop", alt: "Badminton court" },
  { src: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop", alt: "Players warming up" },
  { src: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&h=400&fit=crop", alt: "Team celebration" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Moments</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Gallery</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setLightbox(i)}
              className="relative aspect-[3/2] rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity font-display uppercase tracking-wider text-sm">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={galleryImages[lightbox].src.replace("w=600&h=400", "w=1200&h=800")}
              alt={galleryImages[lightbox].alt}
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </div>
    </section>
    
  );
};

export default GallerySection;
