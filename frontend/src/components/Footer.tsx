import { tournaments } from "@/data/tournaments";

const Footer = () => {
  const activeTournament = tournaments[0];

  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/logo.png" alt="SISA Logo" className="h-10 w-auto object-contain mb-3" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              South India Sports Association — Promoting competitive sports excellence across South India.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["About", "Tournament", "Rules", "Register", "Gallery", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase()}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
              <a
                href="/terms"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </a>
              <a href="/sponsor" className="block text-sm text-accent hover:text-accent-foreground transition-colors font-semibold pt-2">
                Become a Sponsor
              </a>
              <a href="/apply" className="block text-sm text-primary hover:text-primary-foreground transition-colors font-semibold">
                Host a Tournament
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4">Tournament</h4>
            {activeTournament ? (
              <>
                <p className="text-sm text-muted-foreground">{activeTournament.title}</p>
                <p className="text-sm text-primary font-semibold mt-1">{activeTournament.date}</p>
                <p className="text-sm text-muted-foreground mt-1">{activeTournament.venue}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming tournaments</p>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 text-center flex flex-col items-center justify-center gap-1.5">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} South India Sports Association. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <a
              href="https://portfolio-samiq-khan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-white transition-all duration-300 drop-shadow-[0_0_8px_rgba(51,149,255,0.7)] hover:drop-shadow-[0_0_15px_rgba(51,149,255,1)] tracking-wider hover:scale-105 inline-block"
            >
              Samiq
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
