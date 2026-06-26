import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Trophy, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import {
  getPlayerRegistrations,
  getScheduledGames,
  PlayerRegistration,
  ScheduledGame
} from "@/lib/storage";
import { tournaments as staticTournaments } from "@/data/tournaments";

const Matches = () => {
  const { toast } = useToast();
  
  const [players, setPlayers] = useState<PlayerRegistration[]>([]);
  const [scheduledGames, setScheduledGames] = useState<ScheduledGame[]>([]);
  const [selectedGameTournament, setSelectedGameTournament] = useState<string>(() => localStorage.getItem("sisa_matchesTournament") || "");
  const [selectedGameAgeCategory, setSelectedGameAgeCategory] = useState<string>(() => localStorage.getItem("sisa_matchesAge") || "");
  const [selectedGameCategory, setSelectedGameCategory] = useState<string>(() => localStorage.getItem("sisa_matchesCategory") || "");
  const [expandedGameTournaments, setExpandedGameTournaments] = useState<string[]>([]);
  const [expandedMatchNames, setExpandedMatchNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'participants' | 'matches'>(() => (localStorage.getItem("sisa_matchesTab") as any) || 'participants');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pData, gData] = await Promise.all([
          getPlayerRegistrations(),
          getScheduledGames()
        ]);
        setPlayers(pData);
        setScheduledGames(gData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load matches data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("sisa_matchesTournament", selectedGameTournament);
  }, [selectedGameTournament]);

  useEffect(() => {
    localStorage.setItem("sisa_matchesAge", selectedGameAgeCategory);
  }, [selectedGameAgeCategory]);

  useEffect(() => {
    localStorage.setItem("sisa_matchesCategory", selectedGameCategory);
  }, [selectedGameCategory]);

  useEffect(() => {
    localStorage.setItem("sisa_matchesTab", activeTab);
  }, [activeTab]);

  const gameTournaments = Array.from(new Set(players.map(p => p.tournamentTitle).filter(Boolean))).sort();
  
  const gameAgeCategoriesForTournament = selectedGameTournament 
    ? Array.from(new Set(players.filter(p => p.tournamentTitle === selectedGameTournament).map(p => p.ageCategory).filter(Boolean))).sort()
    : [];

  const gameCategoriesForTournament = (selectedGameTournament && selectedGameAgeCategory)
    ? Array.from(new Set(players.filter(p => p.tournamentTitle === selectedGameTournament && p.ageCategory === selectedGameAgeCategory).map(p => p.category).filter(Boolean))).sort()
    : [];

  // Match the logic from Admin Panel
  const gameParticipants = players.filter(p => 
    p.tournamentTitle === selectedGameTournament && 
    p.ageCategory === selectedGameAgeCategory &&
    p.category === selectedGameCategory &&
    p.email === "manual@example.com"
  );
  
  const filteredScheduledGames = scheduledGames.filter(g => {
    if (selectedGameTournament && g.tournament !== selectedGameTournament) return false;
    if (selectedGameAgeCategory && g.ageCategory !== selectedGameAgeCategory) return false;
    if (selectedGameCategory && g.category !== selectedGameCategory) return false;
    return true;
  });

  const gameParticipantsWithPoints = gameParticipants.map(p => {
    const playerName = p.partnerName ? `${p.playerName} & ${p.partnerName}` : p.playerName;
    let points = 0;
    filteredScheduledGames.forEach(g => {
      if (g.winner === playerName) points += 1;
      else if (g.winner === "Draw" && (g.homePlayer === playerName || g.awayPlayer === playerName)) points += 0.5;
    });
    return { ...p, points };
  }).sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4 mb-12">
              <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-wide">
                Matches <span className="gradient-text">& Leaderboard</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                View registered participants, match schedules, and current point standings.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground glass-card border border-border/50 rounded-xl">
                <p>Loading data...</p>
              </div>
            ) : (
              <div className="glass-card p-3 sm:p-6 md:p-8 rounded-xl border border-border/50 space-y-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-bold text-foreground">Select Tournament</label>
                    <select
                      value={selectedGameTournament}
                      onChange={(e) => {
                        setSelectedGameTournament(e.target.value);
                        setSelectedGameAgeCategory("");
                        setSelectedGameCategory(""); 
                      }}
                      className="w-full bg-secondary/30 border border-border rounded p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    >
                      <option value="">-- Choose a Tournament --</option>
                      {gameTournaments.map((tTitle) => (
                        <option key={tTitle} value={tTitle}>{tTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-bold text-foreground uppercase tracking-wide">Age Category</label>
                    <select
                      value={selectedGameAgeCategory}
                      onChange={(e) => {
                        setSelectedGameAgeCategory(e.target.value);
                        setSelectedGameCategory(""); 
                      }}
                      disabled={!selectedGameTournament}
                      className="w-full bg-secondary/30 border border-border rounded p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <option value="">Select Age</option>
                      {gameAgeCategoriesForTournament.map((age: string) => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-bold text-foreground uppercase tracking-wide">Event Type</label>
                    <select
                      value={selectedGameCategory}
                      onChange={(e) => setSelectedGameCategory(e.target.value)}
                      disabled={!selectedGameAgeCategory}
                      className="w-full bg-secondary/30 border border-border rounded p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <option value="">Select Type</option>
                      {gameCategoriesForTournament.map((c: string) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedGameTournament && selectedGameAgeCategory && selectedGameCategory ? (
                  <div className="pt-6 border-t border-border/50 space-y-6">
                    
                    {/* Toggle */}
                    <div className="flex bg-secondary/20 p-1 rounded-lg w-full max-w-md mx-auto">
                      <button
                        onClick={() => setActiveTab('participants')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-colors ${activeTab === 'participants' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Score Board
                      </button>
                      <button
                        onClick={() => setActiveTab('matches')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-colors ${activeTab === 'matches' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Fixed Matches
                      </button>
                    </div>

                    {activeTab === 'participants' ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="text-primary w-5 h-5" />
                          <h4 className="font-display font-bold text-lg uppercase text-primary">
                            Registered Participants ({gameParticipants.length})
                          </h4>
                        </div>
                        
                        <div className="rounded-xl border border-border/50">
                          <table className="w-full text-left border-collapse bg-background table-fixed">
                            <thead>
                              <tr className="border-b border-border/50 bg-secondary/20 text-muted-foreground text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                                <th className="px-1 md:px-2 py-2 md:py-3 font-semibold w-[40%]">Name</th>
                                <th className="px-1 md:px-2 py-2 md:py-3 font-semibold w-[25%]">Category</th>
                                <th className="px-1 md:px-2 py-2 md:py-3 font-semibold w-[20%]">Event</th>
                                <th className="px-1 md:px-2 py-2 md:py-3 font-semibold text-center w-[15%]">Points</th>
                              </tr>
                            </thead>
                            <tbody className="text-[10px] sm:text-xs md:text-sm">
                              {gameParticipantsWithPoints.map(p => (
                                <tr key={p.id} className="border-b border-border/10 hover:bg-secondary/10 transition-colors">
                                  <td className="px-1 md:px-2 py-2 md:py-3 font-medium text-foreground break-words">{p.partnerName ? `${p.playerName} & ${p.partnerName}` : p.playerName}</td>
                                  <td className="px-1 md:px-2 py-2 md:py-3 text-muted-foreground break-words">{p.ageCategory}</td>
                                  <td className="px-1 md:px-2 py-2 md:py-3 text-muted-foreground break-words">{p.category}</td>
                                  <td className="px-1 md:px-2 py-2 md:py-3 font-bold text-primary text-center">
                                    {p.points}
                                  </td>
                                </tr>
                              ))}
                              {gameParticipants.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="p-4 md:p-6 text-center text-muted-foreground">
                                    No participants found for this category.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Trophy className="text-primary w-5 h-5" />
                          <h4 className="font-display font-bold text-lg uppercase text-primary">
                            Fixed Matches ({filteredScheduledGames.length})
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                        {(() => {
                          const groupedByTournament = filteredScheduledGames.reduce((acc, game) => {
                            if (!acc[game.tournament]) acc[game.tournament] = {};
                            const matchName = game.round || "Unassigned Match";
                            if (!acc[game.tournament][matchName]) acc[game.tournament][matchName] = [];
                            acc[game.tournament][matchName].push(game);
                            return acc;
                          }, {} as Record<string, Record<string, typeof filteredScheduledGames>>);

                          const toggleGameTournament = (t: string) => {
                            setExpandedGameTournaments(prev => 
                              prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                            );
                          };

                          return Object.keys(groupedByTournament).length > 0 ? (
                            Object.entries(groupedByTournament).map(([tournamentName, matchGroups]) => (
                              <div key={tournamentName} className="glass-card border border-border/50 rounded-xl overflow-hidden">
                                <div 
                                  className="bg-secondary/20 hover:bg-secondary/40 p-4 cursor-pointer flex items-center gap-3 transition-colors border-b border-border/10"
                                  onClick={() => toggleGameTournament(tournamentName)}
                                >
                                  {expandedGameTournaments.includes(tournamentName) ? (
                                    <ChevronDown className="w-5 h-5 text-primary" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                  )}
                                  <span className="font-display font-bold uppercase tracking-wider text-sm text-foreground">
                                    {tournamentName}
                                  </span>
                                </div>
                                
                                {expandedGameTournaments.includes(tournamentName) && (
                                  <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 bg-background/30">
                                    {Object.entries(matchGroups).map(([matchName, games]) => {
                                      const validGames = games.filter(g => g.homePlayer && g.homePlayer !== "TBD" && g.homePlayer !== "GROUP_PLACEHOLDER");
                                      if (validGames.length === 0) return null;
                                      
                                      const matchKey = `${tournamentName}-${matchName}`;
                                      const isMatchExpanded = expandedMatchNames.includes(matchKey);

                                      return (
                                        <div key={matchName} className="space-y-3">
                                          <div 
                                            className="flex items-center gap-2 cursor-pointer bg-secondary/10 hover:bg-secondary/20 p-3 sm:p-4 rounded-lg transition-colors border border-border/10"
                                            onClick={() => {
                                              setExpandedMatchNames(prev => 
                                                prev.includes(matchKey) ? prev.filter(k => k !== matchKey) : [...prev, matchKey]
                                              );
                                            }}
                                          >
                                            {isMatchExpanded ? (
                                              <ChevronDown className="w-4 h-4 text-primary" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <h5 className="font-bold text-primary text-sm uppercase">{matchName}</h5>
                                            <span className="ml-auto text-xs font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border/50">
                                              {validGames.length} {validGames.length === 1 ? 'Fix' : 'Fixes'}
                                            </span>
                                          </div>
                                          
                                          {isMatchExpanded && (
                                            <div className="grid grid-cols-1 gap-4 pl-3 sm:pl-6 border-l-2 border-primary/20 ml-2 mt-3">
                                              {validGames.map((g, idx) => (
                                                <div key={g.id || idx} className="bg-secondary/30 rounded-lg p-4 sm:p-5 border border-border flex flex-col justify-between w-full">
                                                  <div className="mb-3 sm:mb-4 pb-2 border-b border-border/20">
                                                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">Fix {idx + 1}</p>
                                                  </div>
                                                  <div className="flex justify-between items-center text-sm sm:text-base md:text-lg font-bold gap-2">
                                                    <span className={`flex-1 text-left flex items-center flex-wrap gap-1 ${g.winner === g.homePlayer ? "text-primary" : "text-foreground"}`}>
                                                      {g.homePlayer} 
                                                      {g.winner && g.homeScore !== undefined && <span className="ml-2 text-sm bg-secondary px-2 py-0.5 rounded border border-border font-mono">{g.homeScore}</span>}
                                                      {g.winner === g.homePlayer && <Trophy className="w-4 h-4 text-primary" />}
                                                      {g.winner === "Draw" && <span className="text-muted-foreground text-xs sm:text-sm font-semibold ml-1">( DRAW )</span>}
                                                    </span>
                                                    <span className="text-muted-foreground text-[10px] sm:text-xs border px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border-border bg-background/50 flex-shrink-0">VS</span>
                                                    <span className={`flex-1 text-right flex items-center justify-end flex-wrap gap-1 ${g.winner === g.awayPlayer ? "text-primary" : "text-foreground"}`}>
                                                      {g.winner === "Draw" && <span className="text-muted-foreground text-xs sm:text-sm font-semibold mr-1">( DRAW )</span>}
                                                      {g.winner === g.awayPlayer && <Trophy className="w-4 h-4 text-primary" />}
                                                      {g.winner && g.awayScore !== undefined && <span className="mr-2 text-sm bg-secondary px-2 py-0.5 rounded border border-border font-mono">{g.awayScore}</span>}
                                                      {g.awayPlayer}
                                                    </span>
                                                  </div>
                                                  
                                                  <div className="mt-4 sm:mt-5 pt-3 border-t border-border/50 flex justify-between items-center bg-background/20 -mx-3 sm:-mx-5 -mb-3 sm:-mb-5 px-3 sm:px-5 py-2 sm:py-3 rounded-b-lg">
                                                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold">Winner</span>
                                                    <span className={`text-sm font-extrabold uppercase ${g.winner && g.winner !== "Not Played" && g.winner !== "Draw" ? "text-electric" : "text-muted-foreground"}`}>
                                                      {g.winner || "Not Played"}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground border border-dashed border-border/50 rounded-xl">
                              No matches fixed yet.
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground glass-card border border-border/50 rounded-xl">
                    <p>Please select a Tournament, Age Category, and Event Type to view participants and matches.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Matches;
