import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPlayerRegistrations, PlayerRegistration } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, ChevronDown, ChevronRight, Trophy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AGE_CATEGORIES = ["U-11", "U-15", "U-17", "U-19"];
const MATCH_CATEGORIES = ["Boys Singles", "Girls Singles", "Boys Doubles", "Girls Doubles", "Mixed Doubles"];

const PlayersList = () => {
  const [players, setPlayers] = useState<PlayerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAgeCategory, setExpandedAgeCategory] = useState<string | null>("U-11");
  const [expandedMatchCategory, setExpandedMatchCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayerRegistrations();
        // Only show approved/paid players in the public list
        setPlayers(data.filter(p => p.status === 'Paid' || p.status === 'Approved'));
      } catch (error) {
        console.error("Failed to fetch players", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p => 
    p.playerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.partnerName && p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleAgeCategory = (cat: string) => {
    setExpandedAgeCategory(expandedAgeCategory === cat ? null : cat);
    setExpandedMatchCategory(null);
  };

  const toggleMatchCategory = (cat: string) => {
    setExpandedMatchCategory(expandedMatchCategory === cat ? null : cat);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-wider">
              Registered <span className="gradient-text">Players</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View all the registered participants categorized by their age group and match type.
            </p>
          </div>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-primary/20 focus-visible:ring-primary h-12"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4 mt-8">
              {AGE_CATEGORIES.map(ageCat => {
                const agePlayers = filteredPlayers.filter(p => p.ageCategory === ageCat);
                if (agePlayers.length === 0 && searchQuery) return null;
                
                return (
                  <div key={ageCat} className="glass-card rounded-xl overflow-hidden border border-border/50">
                    <button
                      onClick={() => toggleAgeCategory(ageCat)}
                      className="w-full flex items-center justify-between p-5 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <Users size={20} />
                        </div>
                        <h2 className="text-xl font-bold">{ageCat} Category</h2>
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {agePlayers.length} Players
                        </span>
                      </div>
                      {expandedAgeCategory === ageCat ? <ChevronDown /> : <ChevronRight />}
                    </button>
                    
                    {expandedAgeCategory === ageCat && (
                      <div className="p-4 space-y-3 bg-background/50">
                        {MATCH_CATEGORIES.map(matchCat => {
                          const matchPlayers = agePlayers.filter(p => p.category === matchCat);
                          if (matchPlayers.length === 0) return null;
                          
                          return (
                            <div key={matchCat} className="border border-border/50 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleMatchCategory(matchCat)}
                                className="w-full flex items-center justify-between p-4 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Trophy size={16} className="text-accent" />
                                  <h3 className="font-semibold text-lg">{matchCat}</h3>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({matchPlayers.length} registrations)
                                  </span>
                                </div>
                                {expandedMatchCategory === matchCat ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              </button>
                              
                              {expandedMatchCategory === matchCat && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-background">
                                  {matchPlayers.map(player => (
                                    <div key={player.id} className="p-4 rounded-lg border border-border/30 bg-secondary/5 hover:border-primary/50 transition-colors">
                                      <div className="font-bold text-lg">{player.playerName}</div>
                                      {player.partnerName && (
                                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                          <span className="text-xs">Partner:</span> {player.partnerName}
                                        </div>
                                      )}
                                      <div className="text-xs text-muted-foreground mt-2 opacity-70">
                                        {player.city}{player.state && player.state !== 'N/A' ? `, ${player.state}` : ''}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {MATCH_CATEGORIES.every(matchCat => agePlayers.filter(p => p.category === matchCat).length === 0) && (
                          <div className="p-6 text-center text-muted-foreground">
                            No players found in this category.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {AGE_CATEGORIES.every(ageCat => filteredPlayers.filter(p => p.ageCategory === ageCat).length === 0) && (
                <div className="text-center py-12 glass-card rounded-xl border border-border">
                  <p className="text-xl text-muted-foreground">No players found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayersList;
