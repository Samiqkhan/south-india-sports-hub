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
                <p className="text-foreground font-semibold">+91 98765 43210</p>
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
            className="rounded-xl overflow-hidden h-[300px] md:h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497511.23481098043!2d79.87933364999999!3d13.047985949999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              title="Location Map"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
