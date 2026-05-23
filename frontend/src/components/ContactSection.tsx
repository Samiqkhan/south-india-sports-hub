import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-electric uppercase tracking-[0.2em] text-sm font-semibold mb-3">Get in Touch</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Contact Us</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Phone</p>
                <p className="text-foreground font-semibold">+91 90800 60483</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-electric/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-electric" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-foreground font-semibold">southindiasportsassociation.com</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, color: "text-accent" },
                  { icon: Facebook, color: "text-electric" },
                  { icon: Youtube, color: "text-destructive" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`w-11 h-11 rounded-lg bg-secondary flex items-center justify-center ${social.color} hover:scale-110 transition-transform`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl overflow-hidden h-[300px] md:h-auto relative group border border-border/50 hover:border-primary/30 transition-colors"
          >
            <iframe
              src="https://maps.google.com/maps?q=Sankagiri,%20Salem&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
              allowFullScreen
              loading="lazy"
              title="Location Map"
              className="min-h-[300px] h-full"
            />
            <a
              href="https://maps.app.goo.gl/or4cBwn3ir3sEKJq5"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-background/90 hover:bg-primary hover:text-primary-foreground backdrop-blur px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-border/50 transition-all duration-300 transform group-hover:scale-105"
            >
              Open in Maps 🗺️
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
