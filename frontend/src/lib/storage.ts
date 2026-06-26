export interface PlayerRegistration {
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
  status: 'Paid' | 'Pending' | 'Refunded';
  date: string;
  screenshotUrl?: string;
}

export interface TournamentApplication {
  id: string;
  organizerName: string;
  tournamentTitle: string;
  sport: string;
  state: string;
  city: string;
  expectedDates: string;
  expectedTeams: string;
  email: string;
  phone: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface SponsorRegistration {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  sponsorshipLevel: string;
  interestedTournaments: string;
  message: string;
  status: 'New' | 'Contacted' | 'Partnership Active' | 'Closed';
  date: string;
}

export interface GameScore {
  id: string;
  gameNumber: number;
  homePlayer: string;
  awayPlayer: string;
  winner: string;
}

export interface ScheduledGame {
  id: string;
  tournament: string;
  category: string;
  ageCategory: string;
  homePlayer: string;
  awayPlayer: string;
  round?: string;
  winner?: string;
  gamesData?: GameScore[];
  createdAt?: string;
}

// Dynamically determine the backend base URL
const getApiBase = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If the frontend is loaded locally (localhost or local IP via dev port)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isLocalDevPort = ['5173', '5174', '3000'].includes(window.location.port);
    if (isLocalhost || isLocalDevPort) {
      return `http://${window.location.hostname}:3001/api`;
    }
  }
  return 'https://south-india-sports-hub.onrender.com/api';
};

const API_BASE = getApiBase();

// 1. Player Registrations APIs
export const getPlayerRegistrations = async (): Promise<PlayerRegistration[]> => {
  const res = await fetch(`${API_BASE}/players`);
  if (!res.ok) throw new Error("Failed to fetch players from database");
  return await res.json();
};

export const addPlayerRegistration = async (player: Omit<PlayerRegistration, 'id' | 'date'>): Promise<PlayerRegistration | null> => {
  const res = await fetch(`${API_BASE}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player)
  });
  if (!res.ok) throw new Error("Failed to save player registration to database");
  return await res.json();
};

export const deletePlayerRegistration = async (id: string): Promise<PlayerRegistration[]> => {
  const res = await fetch(`${API_BASE}/players/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Failed to delete player from database");
  return await getPlayerRegistrations();
};

export const updatePlayerStatus = async (id: string, status: PlayerRegistration['status']): Promise<PlayerRegistration[]> => {
  const res = await fetch(`${API_BASE}/players/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update player status in database");
  return await getPlayerRegistrations();
};

// 2. Tournament Applications APIs
export const getTournamentApplications = async (): Promise<TournamentApplication[]> => {
  const res = await fetch(`${API_BASE}/tournaments`);
  if (!res.ok) throw new Error("Failed to fetch tournaments from database");
  return await res.json();
};

export const addTournamentApplication = async (app: Omit<TournamentApplication, 'id' | 'date' | 'status'>): Promise<TournamentApplication | null> => {
  const res = await fetch(`${API_BASE}/tournaments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app)
  });
  if (!res.ok) throw new Error("Failed to save tournament application to database");
  return await res.json();
};

export const deleteTournamentApplication = async (id: string): Promise<TournamentApplication[]> => {
  const res = await fetch(`${API_BASE}/tournaments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Failed to delete tournament application from database");
  return await getTournamentApplications();
};

export const updateTournamentStatus = async (id: string, status: TournamentApplication['status']): Promise<TournamentApplication[]> => {
  const res = await fetch(`${API_BASE}/tournaments/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update tournament status in database");
  return await getTournamentApplications();
};

// 3. Sponsor Registrations APIs
export const getSponsorRegistrations = async (): Promise<SponsorRegistration[]> => {
  const res = await fetch(`${API_BASE}/sponsors`);
  if (!res.ok) throw new Error("Failed to fetch sponsors from database");
  return await res.json();
};

export const addSponsorRegistration = async (sponsor: Omit<SponsorRegistration, 'id' | 'date' | 'status'>): Promise<SponsorRegistration | null> => {
  const res = await fetch(`${API_BASE}/sponsors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sponsor)
  });
  if (!res.ok) throw new Error("Failed to save sponsor to database");
  return await res.json();
};

export const deleteSponsorRegistration = async (id: string): Promise<SponsorRegistration[]> => {
  const res = await fetch(`${API_BASE}/sponsors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Failed to delete sponsor from database");
  return await getSponsorRegistrations();
};

export const updateSponsorStatus = async (id: string, status: SponsorRegistration['status']): Promise<SponsorRegistration[]> => {
  const res = await fetch(`${API_BASE}/sponsors/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update sponsor status in database");
  return await getSponsorRegistrations();
};

// 4. Utility Database Operations
export const resetToSeedData = async (): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/db/reset`, { method: 'POST' });
  return res.ok;
};

export const clearAllData = async (): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/db/clear`, { method: 'POST' });
  return res.ok;
};

// 7. Scheduled Games APIs
export const getScheduledGames = async (): Promise<ScheduledGame[]> => {
  const res = await fetch(`${API_BASE}/games`);
  if (!res.ok) throw new Error("Failed to fetch scheduled games from database");
  return await res.json();
};

export const addScheduledGame = async (game: Omit<ScheduledGame, 'id' | 'createdAt'>): Promise<ScheduledGame | null> => {
  const res = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game)
  });
  if (!res.ok) throw new Error("Failed to save scheduled game to database");
  return await res.json();
};

export const updateScheduledGame = async (id: string, game: Omit<ScheduledGame, 'id' | 'createdAt'>): Promise<ScheduledGame | null> => {
  const res = await fetch(`${API_BASE}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game)
  });
  if (!res.ok) throw new Error("Failed to update scheduled game in database");
  return await res.json();
};

export const deleteScheduledGame = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/games/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Failed to delete scheduled game from database");
  return res.ok;
};

// 5. Razorpay Payment APIs
export const createRazorpayOrder = async (amount: number): Promise<any> => {
  const res = await fetch(`${API_BASE}/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) throw new Error("Failed to create Razorpay order");
  return await res.json();
};

export const verifyRazorpayPayment = async (verificationData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  registrationData: Omit<PlayerRegistration, 'id' | 'date' | 'status'> & { amountPaid: string };
}): Promise<any> => {
  const res = await fetch(`${API_BASE}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verificationData)
  });
  if (!res.ok) throw new Error("Failed to verify Razorpay payment");
  return await res.json();
};

export interface GameFee {
  id: string;
  tournamentSlug: string;
  ageCategory: string;
  category: string;
  fee: string;
  isPublished?: boolean;
}

// 6. Game Fees API Helpers
export const getGameFees = async (): Promise<GameFee[]> => {
  const res = await fetch(`${API_BASE}/game-fees`);
  if (!res.ok) throw new Error("Failed to fetch game fees from database");
  return await res.json();
};

export const updateGameFee = async (id: string, fee?: string, isPublished?: boolean): Promise<GameFee[]> => {
  const res = await fetch(`${API_BASE}/game-fees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fee, isPublished })
  });
  if (!res.ok) throw new Error("Failed to update game fee in database");
  return await getGameFees();
};

export interface PaymentConfig {
  useRazorpay: boolean;
  upiId: string;
  qrCodeUrl: string | null;
  razorpayKeyId: string;
  razorpayKeySecret?: string;
}

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  const res = await fetch(`${API_BASE}/payments/config`);
  if (!res.ok) throw new Error("Failed to fetch payment configuration from database");
  return await res.json();
};

export const updatePaymentConfig = async (config: PaymentConfig): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/payments/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error("Failed to update payment configuration in database");
  return res.ok;
};


