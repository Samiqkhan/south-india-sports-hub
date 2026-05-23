import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  MapPin, 
  Briefcase, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  Sparkles,
  UserCheck,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Upload
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { 
  getPlayerRegistrations, 
  getTournamentApplications, 
  getSponsorRegistrations,
  deletePlayerRegistration,
  deleteTournamentApplication,
  deleteSponsorRegistration,
  updatePlayerStatus,
  updateTournamentStatus,
  updateSponsorStatus,
  resetToSeedData,
  clearAllData,
  PlayerRegistration,
  TournamentApplication,
  SponsorRegistration,
  getGameFees,
  updateGameFee,
  GameFee,
  getPaymentConfig,
  updatePaymentConfig,
  PaymentConfig
} from "@/lib/storage";

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"players" | "tournaments" | "sponsors" | "pricing" | "payments">("players");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Data States
  const [players, setPlayers] = useState<PlayerRegistration[]>([]);
  const [tournaments, setTournaments] = useState<TournamentApplication[]>([]);
  const [sponsors, setSponsors] = useState<SponsorRegistration[]>([]);
  const [gameFees, setGameFees] = useState<GameFee[]>([]);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editFeeValue, setEditFeeValue] = useState("");
  const [isSavingFee, setIsSavingFee] = useState(false);

  // Payment settings state
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    useRazorpay: false,
    upiId: "sihsports@okaxis",
    qrCodeUrl: null,
    razorpayKeyId: "",
    razorpayKeySecret: ""
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [qrUploadError, setQrUploadError] = useState("");

  // Receipt Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRegistration | null>(null);

  // Load all data
  const loadData = async () => {
    try {
      const pData = await getPlayerRegistrations();
      const tData = await getTournamentApplications();
      const sData = await getSponsorRegistrations();
      const fData = await getGameFees();
      setPlayers(pData);
      setTournaments(tData);
      setSponsors(sData);
      setGameFees(fData);

      try {
        const configData = await getPaymentConfig();
        setPaymentConfig(configData);
      } catch (configErr) {
        console.error("Error loading payment configuration:", configErr);
      }
    } catch (error) {
      console.error("Error loading data from TiDB:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Deletion
  const handleDeletePlayer = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this player registration?")) {
      try {
        const updated = await deletePlayerRegistration(id);
        setPlayers(updated);
        toast({
          title: "Registration Deleted",
          description: "The player registration record has been removed.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Delete Failed",
          description: "Could not delete record from database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tournament application?")) {
      try {
        const updated = await deleteTournamentApplication(id);
        setTournaments(updated);
        toast({
          title: "Application Deleted",
          description: "The tournament application record has been removed.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Delete Failed",
          description: "Could not delete record from database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sponsor registration?")) {
      try {
        const updated = await deleteSponsorRegistration(id);
        setSponsors(updated);
        toast({
          title: "Registration Deleted",
          description: "The sponsor registration record has been removed.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Delete Failed",
          description: "Could not delete record from database.",
          variant: "destructive"
        });
      }
    }
  };

  // Handlers for Status Changes
  const handlePlayerStatusChange = async (id: string, status: PlayerRegistration["status"]) => {
    try {
      const updated = await updatePlayerStatus(id, status);
      setPlayers(updated);
      toast({
        title: "Status Updated",
        description: `Player registration status changed to ${status}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not update status in database.",
        variant: "destructive"
      });
    }
  };

  const handleTournamentStatusChange = async (id: string, status: TournamentApplication["status"]) => {
    try {
      const updated = await updateTournamentStatus(id, status);
      setTournaments(updated);
      toast({
        title: "Status Updated",
        description: `Tournament application status changed to ${status}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not update status in database.",
        variant: "destructive"
      });
    }
  };

  const handleSponsorStatusChange = async (id: string, status: SponsorRegistration["status"]) => {
    try {
      const updated = await updateSponsorStatus(id, status);
      setSponsors(updated);
      toast({
        title: "Status Updated",
        description: `Sponsor status changed to ${status}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not update status in database.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFee = async (id: string) => {
    setIsSavingFee(true);
    try {
      let formattedFee = editFeeValue.trim();
      if (!formattedFee.startsWith("₹")) {
        formattedFee = "₹" + formattedFee;
      }
      const updated = await updateGameFee(id, formattedFee);
      setGameFees(updated);
      setEditingFeeId(null);
      toast({
        title: "Pricing Updated",
        description: `Game registration fee successfully updated to ${formattedFee}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not save the updated pricing to database.",
        variant: "destructive"
      });
    } finally {
      setIsSavingFee(false);
    }
  };

  // Database Reset/Clear
  const handleResetSeedData = async () => {
    if (window.confirm("This will restore the database to the initial mock records. Any new registrations will be lost. Proceed?")) {
      try {
        const success = await resetToSeedData();
        if (success) {
          await loadData();
          toast({
            title: "Database Reset",
            description: "Pre-seeded mock data has been reloaded.",
          });
        } else {
          throw new Error("Reset failed");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Reset Failed",
          description: "Could not reset TiDB Cloud database.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm("Are you absolutely sure you want to clear ALL registrations? This cannot be undone.")) {
      try {
        const success = await clearAllData();
        if (success) {
          await loadData();
          toast({
            title: "Database Cleared",
            description: "All registration tables are now empty.",
            variant: "destructive"
          });
        } else {
          throw new Error("Clear failed");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Clear Failed",
          description: "Could not clear TiDB Cloud database.",
          variant: "destructive"
        });
      }
    }
  };

  // Calculation of Stats
  const totalPlayers = players.length;
  
  const totalRevenue = players
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => {
      const val = parseInt(p.amountPaid.replace(/[^\d]/g, ""), 10);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

  const totalTournamentApps = tournaments.length;
  const totalSponsors = sponsors.length;

  // Filtered Lists based on search query and status filter
  const filteredPlayers = players.filter(p => {
    const matchesSearch = 
      p.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tournamentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = 
      t.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tournamentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSponsors = sponsors.filter(s => {
    const matchesSearch = 
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sponsorshipLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV Functionality
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (activeTab === "players") {
      headers = ["ID", "Player Name", "Phone", "Email", "State", "City", "Age Group", "Category", "Partner", "Tournament", "Amount Paid", "Status", "Registration Date"];
      rows = filteredPlayers.map(p => [
        p.id, p.playerName, p.phone, p.email, p.state, p.city, p.ageCategory, p.category, p.partnerName || "N/A", p.tournamentTitle, p.amountPaid, p.status, p.date
      ]);
      filename = `player_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeTab === "tournaments") {
      headers = ["ID", "Organizer Name", "Tournament Title", "Sport", "State", "City", "Expected Dates", "Expected Teams", "Email", "Phone", "Details", "Status", "Application Date"];
      rows = filteredTournaments.map(t => [
        t.id, t.organizerName, t.tournamentTitle, t.sport, t.state, t.city, t.expectedDates, t.expectedTeams, t.email, t.phone, t.details, t.status, t.date
      ]);
      filename = `tournament_applications_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      headers = ["ID", "Company Name", "Contact Person", "Email", "Phone", "State", "City", "Sponsorship Level", "Interested Tournaments", "Message", "Status", "Registration Date"];
      rows = filteredSponsors.map(s => [
        s.id, s.companyName, s.contactPerson, s.email, s.phone, s.state, s.city, s.sponsorshipLevel, s.interestedTournaments, s.message, s.status, s.date
      ]);
      filename = `sponsor_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${(val || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${rows.length} rows to ${filename}`,
    });
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <section className="pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 text-xs uppercase tracking-widest font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Exit Admin Hub
              </Link>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase flex items-center gap-3">
                <span className="gradient-text">Admin</span> Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Monitor and manage all player enrollments, hosting requests, and corporate sponsorships.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResetSeedData}
                className="px-4 py-2 border border-primary/20 hover:border-primary text-primary hover:bg-primary/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restore Seed Data
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 border border-destructive/30 hover:border-destructive text-destructive hover:bg-destructive/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Clear All Data
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="glass-card p-6 flex items-center justify-between hover-lift">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Registered Players</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{totalPlayers}</h3>
                <span className="text-[10px] text-primary flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Live Registrations
                </span>
              </div>
              <div className="bg-primary/15 p-4 rounded-xl text-primary glow-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between hover-lift">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Total Revenue</p>
                <h3 className="text-3xl font-display font-bold text-foreground">₹{totalRevenue}</h3>
                <span className="text-[10px] text-electric flex items-center gap-1 mt-1">
                  <UserCheck className="w-3 h-3" /> Confirmed Payments
                </span>
              </div>
              <div className="bg-electric/15 p-4 rounded-xl text-electric glow-electric">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between hover-lift">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Host Applications</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{totalTournamentApps}</h3>
                <span className="text-[10px] text-accent flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Venue Inquiries
                </span>
              </div>
              <div className="bg-accent/15 p-4 rounded-xl text-accent glow-accent">
                <MapPin className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between hover-lift">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Sponsor Leads</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{totalSponsors}</h3>
                <span className="text-[10px] text-primary flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" /> Corporate Partnerships
                </span>
              </div>
              <div className="bg-primary/15 p-4 rounded-xl text-primary glow-primary">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="glass-card p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body appearance-none cursor-pointer pr-8 relative"
                >
                  <option value="All">All Statuses</option>
                  {activeTab === "players" && (
                    <>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </>
                  )}
                  {activeTab === "tournaments" && (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </>
                  )}
                  {activeTab === "sponsors" && (
                    <>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Partnership Active">Partnership Active</option>
                      <option value="Closed">Closed</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Export */}
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/50 mb-6 gap-2">
            <button
              onClick={() => {
                setActiveTab("players");
                setStatusFilter("All");
              }}
              className={`pb-4 px-6 font-display font-semibold uppercase tracking-widest text-sm relative transition-all ${
                activeTab === "players" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Player Registrations ({filteredPlayers.length})
              {activeTab === "players" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("tournaments");
                setStatusFilter("All");
              }}
              className={`pb-4 px-6 font-display font-semibold uppercase tracking-widest text-sm relative transition-all ${
                activeTab === "tournaments" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hosting Applications ({filteredTournaments.length})
              {activeTab === "tournaments" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("sponsors");
                setStatusFilter("All");
              }}
              className={`pb-4 px-6 font-display font-semibold uppercase tracking-widest text-sm relative transition-all ${
                activeTab === "sponsors" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sponsorship Leads ({filteredSponsors.length})
              {activeTab === "sponsors" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("pricing");
                setStatusFilter("All");
              }}
              className={`pb-4 px-6 font-display font-semibold uppercase tracking-widest text-sm relative transition-all ${
                activeTab === "pricing" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Game Pricing ({gameFees.length})
              {activeTab === "pricing" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("payments");
                setStatusFilter("All");
              }}
              className={`pb-4 px-6 font-display font-semibold uppercase tracking-widest text-sm relative transition-all ${
                activeTab === "payments" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Payment Settings
              {activeTab === "payments" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>

          {/* Data Tables */}
          <div className="glass-card overflow-hidden border border-border/30">
            <div className="overflow-x-auto w-full">
              {activeTab === "players" && (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Player</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Contact</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Location</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Tournament & Event</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Fee</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Date</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <tr key={player.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-semibold text-foreground">
                            {player.playerName}
                            {player.partnerName && (
                              <div className="text-xs text-electric font-medium mt-1">
                                Partner: {player.partnerName}
                              </div>
                            )}
                            {player.screenshotUrl && (
                              <button
                                onClick={() => setSelectedPlayer(player)}
                                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold mt-2 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 transition-all cursor-pointer block"
                              >
                                View Receipt
                              </button>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5 text-primary/70" /> {player.email}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5 text-electric/70" /> {player.phone}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-foreground">{player.city}</p>
                            <p className="text-muted-foreground">{player.state}</p>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-foreground font-medium">{player.tournamentTitle}</p>
                            <p className="text-muted-foreground uppercase tracking-wider font-semibold text-[10px] mt-0.5">
                              {player.ageCategory} • {player.category}
                            </p>
                          </td>
                          <td className="p-4 text-center font-bold text-electric">
                            {player.amountPaid}
                          </td>
                          <td className="p-4">
                            <select
                              value={player.status}
                              onChange={(e) => handlePlayerStatusChange(player.id, e.target.value as PlayerRegistration["status"])}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                player.status === "Paid" 
                                  ? "bg-primary/10 border-primary/30 text-primary" 
                                  : player.status === "Pending" 
                                    ? "bg-accent/10 border-accent/30 text-accent" 
                                    : "bg-destructive/10 border-destructive/30 text-destructive"
                              }`}
                            >
                              <option value="Paid" className="bg-card text-foreground">Paid</option>
                              <option value="Pending" className="bg-card text-foreground">Pending</option>
                              <option value="Refunded" className="bg-card text-foreground">Refunded</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {formatDate(player.date)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                              title="Delete Registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-muted-foreground">
                          No player registrations found matching the criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "tournaments" && (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Organizer</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Proposed Tournament</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Details</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Contact</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Location</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Date</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredTournaments.length > 0 ? (
                      filteredTournaments.map((tournament) => (
                        <tr key={tournament.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-semibold text-foreground">
                            {tournament.organizerName}
                          </td>
                          <td className="p-4">
                            <p className="text-foreground font-medium">{tournament.tournamentTitle}</p>
                            <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded mt-1">
                              {tournament.sport}
                            </span>
                          </td>
                          <td className="p-4 text-xs max-w-xs">
                            <div className="flex flex-col gap-1.5 text-muted-foreground">
                              <span><strong className="text-foreground">Dates:</strong> {tournament.expectedDates}</span>
                              <span><strong className="text-foreground">Scale:</strong> {tournament.expectedTeams} teams</span>
                              <span className="line-clamp-2" title={tournament.details}>
                                <strong className="text-foreground">Note:</strong> {tournament.details}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5 text-primary/70" /> {tournament.email}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5 text-electric/70" /> {tournament.phone}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-foreground">{tournament.city}</p>
                            <p className="text-muted-foreground">{tournament.state}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={tournament.status}
                              onChange={(e) => handleTournamentStatusChange(tournament.id, e.target.value as TournamentApplication["status"])}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                tournament.status === "Approved" 
                                  ? "bg-primary/10 border-primary/30 text-primary" 
                                  : tournament.status === "Pending" 
                                    ? "bg-accent/10 border-accent/30 text-accent" 
                                    : "bg-destructive/10 border-destructive/30 text-destructive"
                              }`}
                            >
                              <option value="Pending" className="bg-card text-foreground">Pending</option>
                              <option value="Approved" className="bg-card text-foreground">Approved</option>
                              <option value="Rejected" className="bg-card text-foreground">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {formatDate(tournament.date)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTournament(tournament.id)}
                              className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-muted-foreground">
                          No hosting applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "sponsors" && (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Company</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Contact</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Level & Targets</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Message</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Location</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Date</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredSponsors.length > 0 ? (
                      filteredSponsors.map((sponsor) => (
                        <tr key={sponsor.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-semibold text-foreground">
                            {sponsor.companyName}
                          </td>
                          <td className="p-4">
                            <p className="text-foreground font-medium text-xs">{sponsor.contactPerson}</p>
                            <div className="flex flex-col gap-0.5 text-[11px] mt-1">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3 h-3 text-primary/70" /> {sponsor.email}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3 h-3 text-electric/70" /> {sponsor.phone}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-foreground font-semibold text-accent">{sponsor.sponsorshipLevel}</p>
                            <p className="text-muted-foreground mt-0.5 italic text-[11px] line-clamp-1" title={sponsor.interestedTournaments}>
                              Target: {sponsor.interestedTournaments}
                            </p>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-xs">
                            <p className="line-clamp-2" title={sponsor.message}>{sponsor.message}</p>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="text-foreground">{sponsor.city}</p>
                            <p className="text-muted-foreground">{sponsor.state}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={sponsor.status}
                              onChange={(e) => handleSponsorStatusChange(sponsor.id, e.target.value as SponsorRegistration["status"])}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                sponsor.status === "Partnership Active" 
                                  ? "bg-primary/10 border-primary/30 text-primary" 
                                  : sponsor.status === "Contacted" 
                                    ? "bg-electric/10 border-electric/30 text-electric" 
                                    : sponsor.status === "New" 
                                      ? "bg-accent/10 border-accent/30 text-accent" 
                                      : "bg-muted border-border/50 text-muted-foreground"
                              }`}
                            >
                              <option value="New" className="bg-card text-foreground">New</option>
                              <option value="Contacted" className="bg-card text-foreground">Contacted</option>
                              <option value="Partnership Active" className="bg-card text-foreground">Partnership Active</option>
                              <option value="Closed" className="bg-card text-foreground">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {formatDate(sponsor.date)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteSponsor(sponsor.id)}
                              className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                              title="Delete Sponsor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-muted-foreground">
                          No sponsor registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "pricing" && (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Tournament</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Age Group</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Event Type / Category</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Amount (INR)</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {gameFees.length > 0 ? (
                      gameFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-semibold text-foreground uppercase tracking-wider text-xs">
                            {fee.tournamentSlug.replace(/-/g, " ")}
                          </td>
                          <td className="p-4 text-foreground font-medium uppercase tracking-widest text-xs">
                            {fee.ageCategory}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {fee.category}
                          </td>
                          <td className="p-4 text-center font-bold text-electric">
                            {editingFeeId === fee.id ? (
                              <input
                                type="text"
                                value={editFeeValue}
                                onChange={(e) => setEditFeeValue(e.target.value)}
                                className="w-24 px-2 py-1 bg-background border border-primary/50 rounded text-foreground font-semibold focus:outline-none text-center"
                                placeholder="₹400"
                              />
                            ) : (
                              fee.fee
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {editingFeeId === fee.id ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleUpdateFee(fee.id)}
                                  disabled={isSavingFee}
                                  className="px-3 py-1 bg-primary text-primary-foreground font-bold text-xs rounded hover:brightness-110 disabled:opacity-50"
                                >
                                  {isSavingFee ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingFeeId(null)}
                                  className="px-3 py-1 bg-secondary/30 text-foreground font-semibold text-xs rounded hover:bg-secondary/50"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingFeeId(fee.id);
                                  setEditFeeValue(fee.fee);
                                }}
                                className="px-3 py-1.5 border border-primary/20 hover:border-primary text-primary hover:bg-primary/10 rounded font-semibold text-xs uppercase tracking-wider transition-all"
                              >
                                Edit Fee
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                          No game pricing entries found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "payments" && (
                <div className="p-6 md:p-8 space-y-8 bg-background/50">
                  <div className="flex flex-col gap-1 pb-4 border-b border-border/50">
                    <h3 className="font-display font-bold text-lg uppercase">System Payment Configuration</h3>
                    <p className="text-muted-foreground text-xs">
                      Switch between payment methods and update credentials. Changes take effect instantly.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Method Selector */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Active Payment Method
                        </label>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentConfig(prev => ({ ...prev, useRazorpay: true }))}
                            className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all cursor-pointer ${
                              paymentConfig.useRazorpay 
                                ? 'border-primary bg-primary/5 text-primary glow-primary-border' 
                                : 'border-border/60 bg-secondary/10 hover:border-border text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span className="font-display font-bold text-sm uppercase">Razorpay Gateway</span>
                            <span className="text-[10px] opacity-75 mt-1 text-center">Credit Card, Net Banking, UPI</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentConfig(prev => ({ ...prev, useRazorpay: false }))}
                            className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all cursor-pointer ${
                              !paymentConfig.useRazorpay 
                                ? 'border-primary bg-primary/5 text-primary glow-primary-border' 
                                : 'border-border/60 bg-secondary/10 hover:border-border text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span className="font-display font-bold text-sm uppercase">UPI QR Code</span>
                            <span className="text-[10px] opacity-75 mt-1 text-center">Direct scan & receipt upload</span>
                          </button>
                        </div>
                      </div>

                      {/* Config Form Fields based on selection */}
                      {paymentConfig.useRazorpay ? (
                        <div className="space-y-4 pt-2">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">Razorpay Credentials</h4>
                          
                          <div className="space-y-2">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Razorpay Key ID
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.razorpayKeyId || ""}
                              onChange={(e) => setPaymentConfig(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                              placeholder="rzp_test_..."
                              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-body"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Razorpay Key Secret
                            </label>
                            <input
                              type="password"
                              value={paymentConfig.razorpayKeySecret || ""}
                              onChange={(e) => setPaymentConfig(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                              placeholder="••••••••••••••••"
                              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-body"
                            />
                            <p className="text-[10px] text-muted-foreground">Saved credentials are securely encrypted on backend execution.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">UPI QR Settings</h4>
                          
                          <div className="space-y-2">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Merchant UPI ID
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.upiId || ""}
                              onChange={(e) => setPaymentConfig(prev => ({ ...prev, upiId: e.target.value }))}
                              placeholder="merchant@upi"
                              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-body"
                            />
                            <p className="text-[10px] text-muted-foreground">Required to generate user payment links dynamically if no custom QR image is uploaded.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* QR Code Upload Section */}
                    <div className="space-y-6 border-t md:border-t-0 md:border-l border-border/30 md:pl-8">
                      {!paymentConfig.useRazorpay && (
                        <div className="space-y-4">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">Upload Custom Business QR Code</h4>
                          <p className="text-muted-foreground text-xs">
                            Upload your official merchant QR code image. If uploaded, we will display this image to players instead of dynamically generating one.
                          </p>

                          <div className="relative border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl p-6 transition-all bg-secondary/15 flex flex-col items-center justify-center text-center cursor-pointer group min-h-[160px]">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!file.type.startsWith("image/")) {
                                  setQrUploadError("Please upload an image file (PNG, JPG, JPEG).");
                                  return;
                                }
                                if (file.size > 2 * 1024 * 1024) {
                                  setQrUploadError("QR Code image must be under 2MB.");
                                  return;
                                }
                                setQrUploadError("");
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setPaymentConfig(prev => ({ ...prev, qrCodeUrl: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform mb-2" />
                            <p className="text-sm font-semibold text-foreground">
                              Click or Drag to Upload QR Image
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG, JPEG up to 2MB</p>
                          </div>

                          {qrUploadError && (
                            <p className="text-xs text-destructive font-semibold text-center mt-1">{qrUploadError}</p>
                          )}

                          {paymentConfig.qrCodeUrl && (
                            <div className="flex flex-col items-center gap-3 p-4 border border-border bg-secondary/10 rounded-xl max-w-[200px] mx-auto relative">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Uploaded QR Preview</span>
                              <img
                                src={paymentConfig.qrCodeUrl}
                                alt="Merchant QR code"
                                className="w-full h-auto object-contain rounded border border-border bg-white p-1"
                              />
                              <button
                                type="button"
                                onClick={() => setPaymentConfig(prev => ({ ...prev, qrCodeUrl: null }))}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center hover:brightness-110 shadow cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {paymentConfig.useRazorpay && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-6 border border-primary/20 rounded-2xl bg-primary/5">
                          <Sparkles className="w-10 h-10 text-primary mb-3 glow-primary" />
                          <h4 className="font-display font-bold uppercase text-sm text-foreground">Razorpay Integration Active</h4>
                          <p className="text-muted-foreground text-xs max-w-xs mt-2">
                            Payments will be fully handled by the Razorpay Checkout gateway script automatically on the registration form.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="pt-6 border-t border-border/50 flex justify-end">
                    <button
                      type="button"
                      disabled={isSavingConfig}
                      onClick={async () => {
                        setIsSavingConfig(true);
                        try {
                          const success = await updatePaymentConfig(paymentConfig);
                          if (success) {
                            toast({
                              title: "Settings Saved",
                              description: "Payment configuration has been updated successfully.",
                            });
                          } else {
                            throw new Error("API responded with an error");
                          }
                        } catch (err: any) {
                          console.error(err);
                          toast({
                            title: "Save Failed",
                            description: "Could not update payment configuration.",
                            variant: "destructive"
                          });
                        } finally {
                          setIsSavingConfig(false);
                        }
                      }}
                      className="px-8 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg text-xs glow-primary hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingConfig ? "Saving Configuration..." : "Save Settings"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Receipt Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full overflow-hidden border border-border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/15">
              <div>
                <h3 className="font-display font-bold uppercase text-lg text-foreground">
                  Payment Receipt Proof
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Player: {selectedPlayer.playerName} • {selectedPlayer.tournamentTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold w-8 h-8 rounded-full border border-border/50 hover:bg-secondary/30 flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center bg-background/50">
              {selectedPlayer.screenshotUrl ? (
                <img
                  src={selectedPlayer.screenshotUrl}
                  alt="Payment screenshot"
                  className="max-w-full max-h-[50vh] object-contain rounded-lg border border-border shadow"
                />
              ) : (
                <div className="py-12 text-muted-foreground text-sm">No screenshot available.</div>
              )}
              
              <div className="w-full mt-6 p-4 rounded-lg bg-secondary/20 border border-border/50 text-xs space-y-1.5 text-left">
                <p><span className="text-muted-foreground font-semibold">Age Group & Event:</span> {selectedPlayer.ageCategory} • {selectedPlayer.category}</p>
                <p><span className="text-muted-foreground font-semibold">Phone:</span> {selectedPlayer.phone}</p>
                <p><span className="text-muted-foreground font-semibold">Email:</span> {selectedPlayer.email}</p>
                <p><span className="text-muted-foreground font-semibold">Amount:</span> <strong className="text-electric">{selectedPlayer.amountPaid}</strong></p>
                <p><span className="text-muted-foreground font-semibold">Current Status:</span> <strong className={selectedPlayer.status === 'Paid' ? 'text-primary' : 'text-accent'}>{selectedPlayer.status}</strong></p>
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3 bg-secondary/15">
              {selectedPlayer.status !== "Paid" && (
                <button
                  onClick={async () => {
                    await handlePlayerStatusChange(selectedPlayer.id, "Paid");
                    // Refresh the selected player status in-place so modal updates
                    setSelectedPlayer(prev => prev ? { ...prev, status: "Paid" } : null);
                  }}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-lg text-xs uppercase tracking-wider glow-primary hover:brightness-110 transition-all cursor-pointer"
                >
                  Approve & Mark Paid
                </button>
              )}
              <button
                onClick={() => setSelectedPlayer(null)}
                className="flex-1 py-3 bg-secondary/30 text-foreground font-semibold rounded-lg text-xs uppercase tracking-wider hover:bg-secondary/50 transition-all border border-border/50 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPanel;
