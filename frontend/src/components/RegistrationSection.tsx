import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CheckCircle, Upload } from "lucide-react";
import { PlayerFee } from "@/data/tournaments";
import { SOUTH_INDIA_LOCATIONS, SouthIndiaState } from "@/data/locations";
import { addPlayerRegistration, createRazorpayOrder, verifyRazorpayPayment, getPaymentConfig } from "@/lib/storage";

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
      await addPlayerRegistration({
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
      setSubmitted(true);
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
        await addPlayerRegistration({
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
        setSubmitted(true);
      } catch (err) {
        console.error(err);
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

  if (submitted) {
    return (
      <section id="register" className="section-padding" ref={ref}>
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-12"
          >
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="font-display text-3xl font-bold uppercase mb-4">Registration Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for registering. We'll send a confirmation to your email shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
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
              className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg uppercase tracking-wider hover:bg-secondary transition-all"
            >
              Register Another Player
            </button>
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

        {playerFees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-xl mx-auto"
          >
            <div className="glass-card overflow-hidden border border-primary/20">
               <div className="bg-primary/10 p-3 border-b border-primary/20 text-center">
                  <h3 className="font-display font-bold uppercase tracking-widest text-primary text-xs">Pricing Table</h3>
               </div>
               <div className="overflow-x-auto w-full">
                 <table className="w-full text-center border-collapse text-sm">
                   <thead>
                     <tr className="bg-primary/5">
                       <th className="p-3 border-b sm:border-r border-primary/10 font-bold uppercase tracking-wider text-xs text-muted-foreground w-1/3">Age Group</th>
                       {categories.map((cat) => (
                         <th key={cat} className="p-3 border-b sm:border-r last:border-r-0 border-primary/10 font-bold uppercase tracking-wider text-xs text-muted-foreground">
                           {cat}
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {ageCategories.map((ageGroup, idx) => {
                        const hasAnyFee = categories.some(cat => 
                          playerFees.some(f => f.ageCategory === ageGroup && f.category.toLowerCase() === cat.toLowerCase())
                        );
                        if (!hasAnyFee) return null;

                        return (
                          <tr key={idx} className="hover:bg-secondary/30 transition-colors border-b border-border/30 last:border-b-0">
                            <td className="p-3 sm:border-r border-border/30 text-foreground font-semibold uppercase tracking-widest">{ageGroup}</td>
                            {categories.map((cat, cIdx) => {
                              const fee = playerFees.find(f => f.ageCategory === ageGroup && f.category.toLowerCase() === cat.toLowerCase())?.fee || "-";
                              return (
                                <td key={cat} className={`p-3 ${cIdx < categories.length - 1 ? "sm:border-r border-border/30" : ""} text-electric font-bold`}>
                                  {fee}
                                </td>
                              );
                            })}
                          </tr>
                        );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}

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
