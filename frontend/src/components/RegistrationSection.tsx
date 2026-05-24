import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CheckCircle, Upload, Download, FileText, AlertTriangle, ShieldAlert } from "lucide-react";
import { PlayerFee } from "@/data/tournaments";
import { SOUTH_INDIA_LOCATIONS, SouthIndiaState } from "@/data/locations";
import { addPlayerRegistration, createRazorpayOrder, verifyRazorpayPayment, getPaymentConfig } from "@/lib/storage";
import { jsPDF } from "jspdf";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

interface RegistrationSectionProps {
  tournamentTitle: string;
  categories?: string[];
  ageCategories?: string[];
  playerFees?: PlayerFee[];
}

const RegistrationSection = ({ tournamentTitle, categories = [], ageCategories = [], playerFees = [] }: RegistrationSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [age, setAge] = useState(ageCategories[0] || "");
  const [category, setCategory] = useState(categories[0] || "");
  const [partnerName, setPartnerName] = useState("");
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    id: string;
    playerName: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    ageCategory: string;
    category: string;
    partnerName?: string;
    tournamentTitle: string;
    amountPaid: string;
    status: string;
    date: string;
    razorpayPaymentId?: string;
  } | null>(null);

  const downloadInvoicePDF = (details: typeof successDetails) => {
    if (!details) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Brand Header background
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 40, "F");

    // Brand Logo and Accent line
    doc.setFillColor(5, 255, 213); // Neon Teal/Cyan accent color
    doc.rect(0, 40, 210, 2, "F");

    // Brand Title text
    doc.setTextColor(5, 255, 213);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SOUTH INDIA SPORTS HUB", 15, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Official Tournament Entry Ticket & Invoice", 15, 30);

    // Invoice Header details
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("REGISTRATION INVOICE", 125, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Invoice No: ${details.id}`, 125, 67);
    doc.text(`Date: ${new Date(details.date).toLocaleDateString("en-IN", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })}`, 125, 73);

    // Status Badge background and text
    const isPaidState = details.status.toLowerCase().includes("paid");
    if (isPaidState) {
      doc.setFillColor(220, 252, 231); // green-100
      doc.rect(125, 78, 48, 8, "F");
      doc.setTextColor(21, 128, 61); // green-700
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("STATUS: PAID & CONFIRMED", 127, 83.5);
    } else {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.rect(125, 78, 48, 8, "F");
      doc.setTextColor(180, 83, 9); // amber-700
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("STATUS: PENDING VERIFICATION", 127, 83.5);
    }

    // Horizontal Separator
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(15, 92, 195, 92);

    // Left Column: Player info
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BILL TO (PLAYER)", 15, 102);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Name: ${details.playerName}`, 15, 109);
    doc.text(`Phone: ${details.phone}`, 15, 115);
    doc.text(`Email: ${details.email}`, 15, 121);
    doc.text(`City: ${details.city}`, 15, 127);
    doc.text(`State: ${details.state}`, 15, 133);

    // Right Column: Tournament info
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOURNAMENT DETAILS", 110, 102);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Tournament: ${details.tournamentTitle}`, 110, 109);
    doc.text(`Event: ${details.category}`, 110, 115);
    doc.text(`Age Group: ${details.ageCategory}`, 110, 121);
    if (details.partnerName) {
      doc.text(`Partner Name: ${details.partnerName}`, 110, 127);
    }

    // Horizontal Separator
    doc.line(15, 142, 195, 142);

    // Invoice Table Header
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(15, 150, 180, 10, "F");

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("Registration Fee Description", 18, 156.5);
    doc.text("Qty", 140, 156.5);
    doc.text("Amount", 168, 156.5);

    // Invoice Table Row
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`Entry Registration - ${details.category} (${details.ageCategory})`, 18, 168);
    doc.text("1", 142, 168);
    doc.text(details.amountPaid, 168, 168);

    // Table divider line
    doc.line(15, 175, 195, 175);

    // Total Breakdown details
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Subtotal:", 135, 184);
    doc.text(details.amountPaid, 168, 184);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Total Paid:", 135, 191);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(details.amountPaid, 168, 191);

    if (details.razorpayPaymentId) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Razorpay ID: ${details.razorpayPaymentId}`, 15, 191);
    }

    // Policies Separator line
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.line(15, 203, 195, 203);

    // Policies section
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("REQUIRED TERMS & VENUE POLICIES", 15, 212);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    const pdfPolicies = [
      "1. COMPULSORY ENTRY VERIFICATION: This invoice is a mandatory requirement. You MUST present this invoice (printed copy or digital PDF) along with a valid Government-issued ID card at the entry gate and verification desk. Failing to produce this document will result in denial of entry.",
      "2. SCHEDULE & REPORTING TIME: All players are required to report at the registration counter at least 30 minutes prior to their scheduled match timings. Late arrivals exceeding 15 minutes past the scheduled call will lead to automatic walkover disqualification.",
      "3. REFUNDS & CANCELLATIONS: Registration fees paid are strictly non-refundable and non-transferable under any circumstances, except in the case of complete event cancellation by South India Sports Hub, in which case refunds will be processed within 7-10 working days.",
      "4. OFFICIAL RULES & DECISION MAKING: Standard governing federation rules for the respective sport shall apply. The decision of the chief referee/umpire is final and absolute. Any argument or unsportsmanlike behavior will lead to immediate disqualification without any fee refunds.",
      "5. EQUIPMENT & VENUE COMPLIANCE: Players must bring their own standard-compliant equipment (rackets, bats, etc.). Only non-marking sports shoes are permitted on indoor courts. Strict adherence to the venue clean-green code of conduct is expected."
    ];

    let currentY = 218;
    pdfPolicies.forEach((pLine) => {
      const splitLines = doc.splitTextToSize(pLine, 180);
      doc.text(splitLines, 15, currentY);
      currentY += (splitLines.length * 3.5) + 1.5;
    });

    // Footer copyright notes
    doc.setDrawColor(241, 245, 249);
    doc.line(15, 268, 195, 268);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for choosing South India Sports Hub. We look forward to seeing you compete!", 15, 275);
    doc.text("For tournament queries or support, please email support@sihsports.com or visit www.sihsports.com.", 15, 280);

    // Trigger PDF download
    doc.save(`SISA_Invoice_${details.id}.pdf`);
  };
  
  const [paymentConfig, setPaymentConfig] = useState<any>({ useRazorpay: false, upiId: "sihsports@okaxis" });
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getPaymentConfig();
        setPaymentConfig(config);
      } catch (err) {
        console.error("Failed to load payment config, using default QR", err);
      }
    };
    fetchConfig();
  }, []);

  const [formData, setFormData] = useState({
    playerName: "",
    phone: "",
    email: "",
    state: "" as SouthIndiaState | "",
    city: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData(prev => ({ ...prev, state: value as SouthIndiaState, city: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (amount: string) => {
    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const amountVal = parseInt(amount.replace(/[^\d]/g, ""), 10);
      const amountInPaise = isNaN(amountVal) ? 0 : amountVal * 100;

      // 1. Create order on the backend
      const order = await createRazorpayOrder(amountInPaise);

      // 2. Setup checkout options
      const options = {
        key: paymentConfig.razorpayKeyId || "rzp_test_Ssqkj7T7DivUDd",
        amount: order.amount,
        currency: order.currency,
        name: "South India Sports Hub",
        description: `Tournament Registration - ${tournamentTitle}`,
        order_id: order.id,
        prefill: {
          name: formData.playerName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#05ffd5", // electric neon
        },
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature on backend, which saves the record if verified
            const verificationResult = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationData: {
                playerName: formData.playerName,
                phone: formData.phone,
                email: formData.email,
                state: formData.state,
                city: formData.city,
                ageCategory: age,
                category: category,
                partnerName: category.toLowerCase().includes("doubles") ? partnerName : undefined,
                tournamentTitle: tournamentTitle,
                amountPaid: amount,
              }
            });

            if (verificationResult.success) {
              setSuccessDetails({
                id: verificationResult.id || `pr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                playerName: formData.playerName,
                phone: formData.phone,
                email: formData.email,
                state: formData.state,
                city: formData.city,
                ageCategory: age,
                category: category,
                partnerName: category.toLowerCase().includes("doubles") ? partnerName : undefined,
                tournamentTitle: tournamentTitle,
                amountPaid: amount,
                status: 'Paid',
                date: new Date().toISOString(),
                razorpayPaymentId: response.razorpay_payment_id,
              });
              setSubmitted(true);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (verifyErr: any) {
            console.error("Payment verification failed:", verifyErr);
            alert("Error verifying payment: " + verifyErr.message);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log("Razorpay checkout dismissed");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment flow failed:", error);
      alert("An error occurred during payment processing: " + error.message);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large. Please upload an image under 5MB.");
      return;
    }

    setUploadError("");
    setScreenshotName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleQrSubmit = async () => {
    if (!screenshotBase64) {
      setUploadError("Please upload your payment screenshot before submitting.");
      return;
    }

    setIsProcessing(true);

    const feeObj = playerFees.find(
      (f) =>
        f.category.toLowerCase() === category.toLowerCase() &&
        f.ageCategory.toLowerCase() === age.toLowerCase()
    );
    const selectedFee = feeObj ? feeObj.fee : "₹0";

    try {
      const result = await addPlayerRegistration({
        playerName: formData.playerName,
        phone: formData.phone,
        email: formData.email,
        state: formData.state,
        city: formData.city,
        ageCategory: age,
        category: category,
        partnerName: category.toLowerCase().includes("doubles") ? partnerName : undefined,
        tournamentTitle: tournamentTitle,
        amountPaid: selectedFee,
        status: 'Pending',
        screenshotUrl: screenshotBase64,
      });
      if (result) {
        setSuccessDetails({
          id: result.id,
          playerName: result.playerName,
          phone: result.phone,
          email: result.email,
          state: result.state,
          city: result.city,
          ageCategory: result.ageCategory,
          category: result.category,
          partnerName: result.partnerName,
          tournamentTitle: result.tournamentTitle,
          amountPaid: result.amountPaid,
          status: 'Pending Verification',
          date: result.date,
        });
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error("QR Registration failed:", error);
      alert("Failed to submit registration: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find amount
    const feeObj = playerFees.find(
      (f) =>
        f.category.toLowerCase() === category.toLowerCase() &&
        f.ageCategory.toLowerCase() === age.toLowerCase()
    );
    const selectedFee = feeObj ? feeObj.fee : "₹0";

    const amountVal = parseInt(selectedFee.replace(/[^\d]/g, ""), 10);
    const amountInPaise = isNaN(amountVal) ? 0 : amountVal * 100;

    if (amountInPaise === 0) {
      // Free registration, save directly without payment
      setIsProcessing(true);
      try {
        const result = await addPlayerRegistration({
          playerName: formData.playerName,
          phone: formData.phone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          ageCategory: age,
          category: category,
          partnerName: category.toLowerCase().includes("doubles") ? partnerName : undefined,
          tournamentTitle: tournamentTitle,
          amountPaid: selectedFee,
          status: 'Paid',
        });
        if (result) {
          setSuccessDetails({
            id: result.id,
            playerName: result.playerName,
            phone: result.phone,
            email: result.email,
            state: result.state,
            city: result.city,
            ageCategory: result.ageCategory,
            category: result.category,
            partnerName: result.partnerName,
            tournamentTitle: result.tournamentTitle,
            amountPaid: result.amountPaid,
            status: 'Paid',
            date: result.date,
          });
          setSubmitted(true);
        }
      } catch (err) {
        console.error(err);
        setSuccessDetails({
          id: `pr-free-${Date.now()}`,
          playerName: formData.playerName,
          phone: formData.phone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          ageCategory: age,
          category: category,
          partnerName: category.toLowerCase().includes("doubles") ? partnerName : undefined,
          tournamentTitle: tournamentTitle,
          amountPaid: selectedFee,
          status: 'Paid',
          date: new Date().toISOString(),
        });
        setSubmitted(true);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (paymentConfig.useRazorpay) {
      await handlePayment(selectedFee);
    } else {
      setStep(2);
    }
  };

  const cities = formData.state ? SOUTH_INDIA_LOCATIONS[formData.state as SouthIndiaState] : [];

  if (submitted && successDetails) {
    const isPaid = successDetails.status.toLowerCase().includes("paid");
    
    return (
      <section id="register" className="section-padding animate-fade-in" ref={ref}>
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden border border-primary/20 shadow-2xl relative"
          >
            {/* Success Banner */}
            <div className="bg-primary/10 p-6 md:p-8 text-center border-b border-primary/15 flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
                Registration Successful!
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                Your entry has been recorded in the database.
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* COMPULSORY DOWNLOAD ALERT BOX */}
              <div className="bg-destructive/15 border-2 border-destructive/30 rounded-xl p-5 flex items-start gap-4">
                <div className="bg-destructive/20 p-2.5 rounded-lg text-destructive shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-destructive mb-1">
                    Compulsory Action Required
                  </h4>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                    You <strong className="text-destructive underline">MUST</strong> download the PDF invoice below. It acts as your entry ticket. You will be required to present this invoice (printed or digital copy) along with a valid Govt Photo ID at the venue for verification. Entry will be denied without it.
                  </p>
                </div>
              </div>

              {/* Invoice visual preview card */}
              <div className="bg-secondary/15 rounded-xl border border-border/80 p-5 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border/50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                      Registration / Invoice ID
                    </span>
                    <h5 className="font-mono text-sm font-bold text-foreground">
                      {successDetails.id}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                    <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-full tracking-wider ${
                      isPaid ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {successDetails.status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <h6 className="text-xs uppercase font-extrabold text-primary tracking-widest border-b border-border/20 pb-1">
                      Participant Details
                    </h6>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Full Name</p>
                      <p className="font-semibold text-foreground">{successDetails.playerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Contact Info</p>
                      <p className="font-semibold text-foreground">{successDetails.phone}</p>
                      <p className="text-xs text-muted-foreground">{successDetails.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Location</p>
                      <p className="font-semibold text-foreground">{successDetails.city}, {successDetails.state}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <h6 className="text-xs uppercase font-extrabold text-primary tracking-widest border-b border-border/20 pb-1">
                      Tournament Details
                    </h6>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Event Name</p>
                      <p className="font-semibold text-foreground">{successDetails.tournamentTitle}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Category & Age Group</p>
                      <p className="font-semibold text-foreground">
                        {successDetails.category} — {successDetails.ageCategory}
                      </p>
                    </div>
                    {successDetails.partnerName && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Partner Name</p>
                        <p className="font-semibold text-foreground">{successDetails.partnerName}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Amount Paid</p>
                      <p className="text-lg font-bold text-electric">{successDetails.amountPaid}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Highlights section */}
              <div className="border-t border-border/50 pt-6">
                <h5 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4">
                  Important Venue Guidelines & Policies
                </h5>
                <ul className="space-y-3 text-xs text-muted-foreground pl-1 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>ID Verification:</strong> Present the downloaded PDF invoice and a valid Govt ID card at the entry gate. No entry without it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Reporting Time:</strong> Report at the registration desk 30 minutes before your scheduled match. Disqualification applies for 15+ min delay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Refund Policy:</strong> All fees are strictly non-refundable and non-transferable, unless the event is cancelled.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Code of Conduct:</strong> Fair play rules apply. Chief referee decisions are final. Indoor courts require non-marking shoes.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => downloadInvoicePDF(successDetails)}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  Download Invoice PDF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSuccessDetails(null);
                    setFormData({
                      playerName: "",
                      phone: "",
                      email: "",
                      state: "",
                      city: "",
                    });
                    setPartnerName("");
                    setVerificationDoc(null);
                    setStep(1);
                  }}
                  className="w-full py-3 bg-secondary/20 border border-border/40 text-foreground font-semibold rounded-lg text-sm uppercase tracking-wider hover:bg-secondary/40 transition-all cursor-pointer"
                >
                  Register Another Player
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (step === 2 && !submitted) {
    const feeObj = playerFees.find(
      (f) =>
        f.category.toLowerCase() === category.toLowerCase() &&
        f.ageCategory.toLowerCase() === age.toLowerCase()
    );
    const selectedFee = feeObj ? feeObj.fee : "₹0";
    const amountVal = parseInt(selectedFee.replace(/[^\d]/g, ""), 10);

    const upiUrl = `upi://pay?pa=${paymentConfig.upiId}&pn=SISA%20Sports%20Hub&am=${amountVal}&cu=INR&tn=SISA%20Registration`;
    const qrImageUrl = paymentConfig.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

    return (
      <section id="register" className="section-padding" ref={ref}>
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 space-y-6"
          >
            <h3 className="font-display text-3xl font-bold uppercase">UPI Payment</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Scan the QR code using any UPI App (GPay, PhonePe, Paytm) to make the payment of <strong className="text-primary">{selectedFee}</strong>.
            </p>

            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl max-w-[280px] mx-auto border border-border/80 shadow-md">
              <img
                src={qrImageUrl}
                alt="UPI Payment QR Code"
                className="w-full h-auto object-contain"
              />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">Scan to Pay</span>
            </div>

            <div className="md:hidden">
              <a
                href={upiUrl}
                className="inline-flex items-center gap-2 text-xs text-primary font-bold hover:underline"
              >
                Or click here to open in your UPI App
              </a>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-border/50">
              <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Upload Payment Screenshot <span className="text-primary">*</span>
              </label>

              <div className="relative border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl p-6 transition-all bg-secondary/15 flex flex-col items-center justify-center text-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  {screenshotName ? `Selected: ${screenshotName}` : "Click or Drag to Upload Receipt"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>

              {uploadError && (
                <p className="text-xs text-destructive font-semibold text-center mt-1">{uploadError}</p>
              )}

              {screenshotBase64 && (
                <div className="mt-3 relative rounded-lg border border-border p-2 bg-secondary/20 max-w-[150px] mx-auto">
                  <img
                    src={screenshotBase64}
                    alt="Receipt preview"
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotBase64(null);
                      setScreenshotName("");
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center hover:brightness-110 shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleQrSubmit}
                disabled={isProcessing || !screenshotBase64}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Submitting Registration..." : "Submit Registration"}
              </button>
              
              <button
                onClick={() => {
                  setStep(1);
                  setScreenshotBase64(null);
                  setScreenshotName("");
                  setUploadError("");
                }}
                disabled={isProcessing}
                className="w-full py-3 bg-secondary/20 text-foreground font-semibold rounded-lg text-sm uppercase tracking-wider hover:bg-secondary/50 transition-all disabled:opacity-50"
              >
                Back to Details
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-3">Join the Competition</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Register Now</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 max-w-xl mx-auto text-center"
        >
          <div className="glass-card p-6 border border-primary/20 bg-primary/5 rounded-xl glow-primary">
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-2">Tournament Entry Fee</p>
            <p className="text-4xl md:text-5xl font-bold text-primary font-display mb-2">₹400</p>
            <p className="text-[11px] sm:text-xs text-foreground font-semibold uppercase tracking-wider">For All Categories & Age Groups</p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-10 space-y-6"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Player Name
              </label>
              <input
                type="text"
                name="playerName"
                value={formData.playerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer font-body"
                >
                  <option value="" disabled>Select State</option>
                  {Object.keys(SOUTH_INDIA_LOCATIONS).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.state}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer font-body disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {ageCategories.length > 0 && categories.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="bg-secondary/20 p-5 rounded-xl border border-border/50 relative">
                <h4 className="font-bold text-foreground mb-4 tracking-wider uppercase text-primary border-b border-border/50 pb-2">
                  Event Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Age Category
                    </label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Age</option>
                      {ageCategories.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Event Type
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Type</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {category.toLowerCase().includes("doubles") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="pt-4 mt-4 border-t border-border/30"
                  >
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter partner's full name"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    />
                  </motion.div>
                )}
              </div>

              {/* Age Verification Document Upload */}
              <div className="bg-secondary/20 p-5 rounded-xl border border-border/50 relative">
                <h4 className="font-bold text-foreground mb-4 tracking-wider uppercase text-primary border-b border-border/50 pb-2">
                  Age Verification
                </h4>
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Upload Age Proof (Aadhaar Card, Passport, or Birth Certificate) <span className="text-primary">*</span>
                  </label>
                  <div className="relative group border border-dashed border-border hover:border-primary/50 rounded-lg p-5 bg-background/30 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[140px]">
                    <input
                      type="file"
                      accept=".pdf, image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setVerificationDoc(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                    {verificationDoc ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-primary" />
                        <p className="text-foreground font-semibold text-sm truncate max-w-[280px]">
                          {verificationDoc.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {(verificationDoc.size / (1024 * 1024)).toFixed(2)} MB - Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="text-foreground font-semibold text-sm">Choose file or drag here</p>
                        <p className="text-muted-foreground text-xs">PDF, PNG, JPG, or JPEG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg uppercase tracking-wider glow-primary hover:brightness-110 transition-all font-display disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing Payment..." : "Next: Payment"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RegistrationSection;
