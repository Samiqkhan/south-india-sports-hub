import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { tournaments } from "@/data/tournaments";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: React.ReactNode;
  options?: string[];
};

const mainOptions = [
  "Live Matches & Register",
  "Host a Tournament",
  "Sponsorship Info",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hi there! 👋 I'm your SISA Assistant. What's your name?",
    },
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("#")) {
      const el = document.getElementById(path.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");

    // Remove previous options
    setMessages((prev) => prev.map((msg) => ({ ...msg, options: [] })));

    // Bot response logic
    setTimeout(() => {
      let botResponse: Message;

      if (!userName) {
        setUserName(text);
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Nice to meet you, ${text}! How can I help you today?`,
          options: mainOptions,
        };
      } else {
        botResponse = handleOptionQuery(text);
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const handleOptionQuery = (query: string): Message => {
    const id = (Date.now() + 1).toString();
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("back to menu")) {
      return {
        id,
        sender: "bot",
        text: "What else can I help you with?",
        options: mainOptions,
      };
    }

    const matchedTournament = tournaments.find((t) => t.title.toLowerCase() === lowerQuery);
    if (matchedTournament) {
      return {
        id,
        sender: "bot",
        text: (
          <div className="space-y-3">
            <p><strong>{matchedTournament.title}</strong> is currently active!</p>
            <p className="text-xs">Categories: {matchedTournament.categories}</p>
            <button onClick={() => handleNavigate(`/tournament/${matchedTournament.slug}`)} className="inline-block px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider mt-2">
              View Details & Register
            </button>
          </div>
        ),
        options: ["Back to Menu"],
      };
    }

    if (lowerQuery.includes("live") || lowerQuery.includes("match") || lowerQuery.includes("register")) {
      const liveTournaments = tournaments.map((t) => t.title);
      return {
        id,
        sender: "bot",
        text: "Here are the tournaments currently active. Click one to view details:",
        options: [...liveTournaments, "Back to Menu"],
      };
    } else if (lowerQuery.includes("host") || lowerQuery.includes("organize")) {
      return {
        id,
        sender: "bot",
        text: (
          <div className="space-y-3">
            <p>We provide complete tournament management!</p>
            <ul className="list-disc pl-4 text-xs space-y-1 my-2">
              <li>Live Digital Scoring</li>
              <li>Online Registrations & Payments</li>
              <li>Professional Umpires</li>
            </ul>
            <button onClick={() => handleNavigate("#contact")} className="inline-block px-4 py-2 bg-electric text-white rounded-lg text-xs font-bold uppercase tracking-wider mt-2">
              Contact our Team
            </button>
          </div>
        ),
        options: ["Back to Menu"],
      };
    } else if (lowerQuery.includes("sponsor")) {
      return {
        id,
        sender: "bot",
        text: (
          <div className="space-y-3">
            <p>Sponsoring a SISA tournament is a great way to boost your brand! Sponsors get premium logo placement, stall space at the venue, and social media coverage.</p>
            <button onClick={() => handleNavigate("/sponsor")} className="inline-block px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider mt-2">
              Open Sponsor Form
            </button>
          </div>
        ),
        options: ["Back to Menu"],
      };
    } else {
      return {
        id,
        sender: "bot",
        text: "I can help you with Live Matches & Registration, Hosting a Tournament, or Sponsoring an event. Please select an option below, or head over to our Contact section to speak with a human!",
        options: mainOptions,
      };
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">SISA Assistant</h3>
                  <p className="text-xs opacity-80">Online | Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative scrollbar-hide bg-secondary/5">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "user" ? "bg-electric text-white" : "bg-primary/20 text-primary"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-electric text-white rounded-tr-sm"
                        : "bg-background border border-border rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.options && msg.options.length > 0 && userName && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSend(opt)}
                            className="text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-colors border border-primary/20"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={userName ? "Type a message..." : "Type your name..."}
                  className="flex-1 bg-secondary/30 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 bg-primary text-primary-foreground rounded-full hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-50 overflow-hidden glow-primary"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default ChatBot;
