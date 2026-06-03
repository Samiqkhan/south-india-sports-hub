import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, ShieldAlert, Award, CreditCard, RefreshCw, Scale, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  const lastUpdated = "June 2026";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction & Acceptance of Terms",
      icon: <FileText className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-3">
          <p>
            Welcome to the <strong>South India Sports Association (SISA)</strong>. These Terms and Conditions (&quot;Terms&quot;) govern your use of our website (
            <a href="https://www.southindiasportsassociation.in" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-foreground">
              https://www.southindiasportsassociation.in
            </a>
            ) and your participation in chess tournaments, championships, coaching programs, memberships, and other sports activities organized by SISA.
          </p>
          <p>
            By accessing our website, registering for events, or subscribing to our membership, you agree to comply with and be bound by these Terms, as well as our Privacy Policy. If you do not agree to these Terms, you must refrain from using our services or registering for our events.
          </p>
        </div>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility for Participation",
      icon: <Award className="w-5 h-5 text-electric" />,
      content: (
        <div className="space-y-3">
          <p>
            SISA conducts tournaments, events, and coaching programs for various age groups, skill levels, and categories.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Participants must meet the specific age, rating, and gender criteria designated for each specific tournament or event as stated in the official circular.</li>
            <li>Minors (under the age of 18) must have explicit parental or guardian consent to register and participate.</li>
            <li>SISA reserves the right to request proof of age (such as Aadhaar Card, Passport, or Birth Certificate) and rating verification at any stage of registration or during the tournament.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "registration",
      title: "3. Registration Process & Responsibilities",
      icon: <Scale className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p>
            All registrations must be submitted via our official online forms, payment portals, or designated offline registration desks.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>You agree to provide accurate, complete, and current information during the registration process.</li>
            <li>Falsification of details (including but not limited to age, rating, AICF registration status, or district affiliation) will lead to immediate disqualification without any refund.</li>
            <li>Players are responsible for verifying that their entry has been successfully received and accepted by checking the published participant lists.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "payment",
      title: "4. Payment Terms & Gateway Disclaimer",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-3">
          <p>
            All entry fees, coaching fees, and membership charges must be paid in full prior to the registration deadline. 
          </p>
          <p>
            Payments are processed securely via third-party payment gateways and UPI applications (including Razorpay, PhonePe, Google Pay, Paytm, or net banking channels). SISA is not responsible for transaction failures, double debits, or network latencies on the payment gateway&#39;s side. In case of payment disputes, participants should provide their unique transaction ID and receipt to SISA support for verification.
          </p>
        </div>
      ),
    },
    {
      id: "refund",
      title: "5. Refund & Cancellation Policy",
      icon: <RefreshCw className="w-5 h-5 text-electric" />,
      content: (
        <div className="space-y-3 border-l-2 border-primary/30 pl-4 py-1 bg-secondary/10 rounded-r-lg">
          <p className="font-semibold text-foreground">Please read our refund terms carefully before completing payments:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>Organizer Approval:</strong> All refunds are subject to review and final approval by the SISA organizing committee.</li>
            <li><strong>Cancellation Window:</strong> Refund requests made before the official registration close date or 48 hours prior to the event (whichever is earlier) may be considered, subject to a deduction of payment gateway convenience fees.</li>
            <li><strong>No Refund After Commencement:</strong> Once a tournament draws are made, pairings are published, or the event commences, no refunds or transfers of fees will be processed under any circumstances, regardless of participation.</li>
            <li><strong>Processing Timeline:</strong> Approved refunds will be credited back to the original payment source within <strong>5 to 7 business days</strong>.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "rules",
      title: "6. Tournament Rules & Code of Conduct",
      icon: <ShieldAlert className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p>
            SISA tournaments strictly adhere to FIDE (International Chess Federation) laws, All India Chess Federation (AICF) guidelines, and standard sportsmanship rules.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>Fair Play & anti-cheating:</strong> Any form of cheating, engine assistance, external help, colluding, or device usage (smartphones, smartwatches, etc.) in the playing venue is strictly prohibited and will result in immediate disqualification and reporting to higher chess federations.</li>
            <li><strong>Code of Conduct:</strong> Participants, coaches, and parents must maintain professional behavior and respect tournament arbiters, volunteers, and opponents. Verbal abuse, physical aggression, or damage to property will lead to immediate expulsion from the venue.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "modifications",
      title: "7. Modifications & Cancellations by Organizer",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-3">
          <p>
            SISA reserves the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Modify schedules, change tournament structures, rounds, or shift venues under unforeseen circumstances, force majeure events (weather, public emergencies, government restrictions), or technical challenges.</li>
            <li>Cancel an event if sufficient registrations are not met. In the case of complete cancellation by the organizer, a 100% refund of the tournament entry fee will be issued to registered players. SISA is not liable for personal travel or accommodation expenses incurred due to cancellations or changes.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "disqualification",
      title: "8. Disqualification Policy",
      icon: <ShieldAlert className="w-5 h-5 text-electric" />,
      content: (
        <div className="space-y-3">
          <p>
            SISA reserves the absolute right to disqualify any participant, suspend memberships, or ban individuals from future events in case of:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Misconduct, behavioral issues, or disruption of tournaments by players, or associated guardians/coaches.</li>
            <li>Breach of fair play regulations or proven cheating.</li>
            <li>Provision of fraudulent documentation or details.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "9. Intellectual Property",
      icon: <FileText className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            All content, visuals, logos, graphics, tournament booklets, website design, trademarks, and media assets displayable on the website and events are the exclusive intellectual property of the South India Sports Association. 
          </p>
          <p>
            Unauthorized reproduction, modification, distribution, or commercial reuse of SISA branding material is strictly prohibited. SISA reserves the right to capture photos/videos of participants during tournaments for promotional purposes, newsletter updates, and website display.
          </p>
        </div>
      ),
    },
    {
      id: "liability",
      title: "10. Limitation of Liability",
      icon: <Scale className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            South India Sports Association (including its trustees, directors, arbiters, volunteers, and partners) shall not be held liable for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Any personal injury, sickness, or accident sustained by players, guardians, or visitors at tournament venues or during coaching activities.</li>
            <li>Loss, theft, or damage of personal belongings, including chess equipment, electronics, or vehicles.</li>
            <li>Indirect, incidental, or consequential losses, including travel, food, lodging, or transport expenses caused by tournament delays or modifications.</li>
            <li>Technical failures, server downtime, or transactional errors during online registrations.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "11. Privacy & Data Usage",
      icon: <Award className="w-5 h-5 text-electric" />,
      content: (
        <div className="space-y-3">
          <p>
            By registering, you consent to SISA collecting, storing, and utilizing your personal data (name, email, age, contact numbers, FIDE ID, state, rating) to maintain tournament records, publish standings, compile start lists, and send communication updates. Please refer to our Privacy Policy to understand how we protect your personal information.
          </p>
        </div>
      ),
    },
    {
      id: "governing-law",
      title: "12. Governing Law & Jurisdiction",
      icon: <Scale className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of India. Any legal actions, claims, or disputes arising out of these terms, registrations, or SISA events shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu, India.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full text-foreground font-body">
      <Navbar />

      <main className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-8">
            <div>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider mb-2 inline-block">
                Legal Framework
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
                Terms & <span className="gradient-text">Conditions</span>
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Last Updated: <span className="text-foreground font-semibold">{lastUpdated}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quick Nav Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-1 space-y-2 sticky top-28 self-start">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Table of Contents</h3>
            <div className="flex flex-col gap-1 border-l border-border/50 pl-3">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 block hover:translate-x-1 duration-200"
                >
                  {sec.title.split(". ")[1]}
                </a>
              ))}
              <a
                href="#contact"
                className="text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 block hover:translate-x-1 duration-200 font-semibold text-accent"
              >
                Contact Information
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6 md:p-8 space-y-8"
            >
              {sections.map((sec) => (
                <div key={sec.id} id={sec.id} className="scroll-mt-28 space-y-4 border-b border-border/20 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {sec.icon}
                    <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-wider text-foreground">
                      {sec.title}
                    </h2>
                  </div>
                  <div className="text-sm md:text-base leading-relaxed text-muted-foreground pl-8 font-body">
                    {sec.content}
                  </div>
                </div>
              ))}

              {/* Contact Information Section */}
              <div id="contact" className="scroll-mt-28 space-y-4 pt-6 border-t border-border/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-wider text-foreground">
                    13. Contact Information
                  </h2>
                </div>
                <div className="text-sm md:text-base leading-relaxed text-muted-foreground pl-8 space-y-3 font-body">
                  <p>
                    If you have any questions, clarifications, feedback, or need assistance regarding these Terms & Conditions, please contact us:
                  </p>
                  <div className="bg-background/40 border border-border/50 rounded-xl p-6 space-y-2 mt-4 max-w-lg">
                    <p className="flex justify-between border-b border-border/20 pb-2">
                      <span className="font-bold text-foreground">Organization:</span>
                      <span>South India Sports Association (SISA)</span>
                    </p>
                    <p className="flex justify-between border-b border-border/20 pb-2">
                      <span className="font-bold text-foreground">Website:</span>
                      <a href="https://www.southindiasportsassociation.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        www.southindiasportsassociation.in
                      </a>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold text-foreground">Email:</span>
                      <a href="mailto:southindiasportsassociation1@gmail.com" className="text-primary hover:underline">
                        southindiasportsassociation1@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
