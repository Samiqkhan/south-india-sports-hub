export interface TournamentRule {
  title: string;
  content: string;
}

export interface PrizeDetail {
  position?: string;
  reward: string;
}

export interface TournamentReward {
  level: string;
  prizes: PrizeDetail[];
}

export interface TournamentFee {
  item: string;
  amount: string;
}

export interface PlayerFee {
  ageCategory: string;
  category: string;
  fee: string;
}

export interface TournamentVenue {
  district: string;
  locations: string[];
}

export interface Tournament {
  slug: string;
  title: string;
  subtitle: string;
  sport: string;
  status: string;
  date: string;
  venue: string;
  prize: string;
  categories: string;
  description: string;
  registrationCategories: string[];
  ageCategories?: string[];
  rules: TournamentRule[];
  rewards?: TournamentReward[];
  fees?: TournamentFee[];
  playerFees?: PlayerFee[];
  venueDetails?: TournamentVenue[];
}

export const tournaments: Tournament[] = [
  {
    slug: "chess-tournament-2026",
    title: "Chess Tournament 2026",
    subtitle: "Strategize. Think. Win.",
    sport: "Chess",
    status: "Upcoming",
    date: "June 27-28, 2026",
    venue: "SISA Sports Hub, Chennai",
    prize: "Over ₹13,000 in Prizes",
    categories: "U9, U12, U15 & Open (Mixed)",
    description:
      "🏆 A Game of Mind, A Lifetime of Success! Strategize, think, and win at the premier South India Chess Championship 2026. Join top minds from across the region to compete for glory and cash prizes.",
    registrationCategories: ["Girls & Boys Mixed"],
    ageCategories: ["U-9", "U-12", "U-15", "Open"],
    rules: [
      {
        title: "1. Match Format",
        content:
          "All matches will be conducted as per latest FIDE rules of Chess. Time control will be 15 minutes + 10 seconds increment per move from move 1 (Rapid format) or as decided by the Chief Arbiter.",
      },
      {
        title: "2. Age Verification",
        content:
          "Strict age verification will be conducted. Players must produce a valid Govt. ID proof (Aadhaar or Birth Certificate) showing birth dates corresponding to their category: U-9, U-12, or U-15. Open category has no age limit.",
      },
      {
        title: "3. Equipment",
        content:
          "Chess boards, chess pieces, and tournament chess clocks will be provided by SISA. Players are not permitted to use their own boards unless explicitly permitted by the Chief Arbiter in special cases.",
      },
      {
        title: "4. Tie-breaks & Pairings",
        content:
          "Swiss-system pairings will be handled via certified software. Tie-breaks will follow standard FIDE-approved criteria: Buchholz Cut 1, Buchholz, Sonneborn-Berger, and Direct Encounter.",
      },
      {
        title: "5. Arbiter Decisions",
        content:
          "The decision of the Chief Arbiter is final and binding on all participants. Any appeal must be made in writing within 15 minutes of the end of the round with an appeal fee.",
      },
    ],
    rewards: [
      {
        level: "Girls & Boys Mixed U-9",
        prizes: [
          { position: "First Prize", reward: "₹1,526" },
          { position: "Second Prize", reward: "₹1,026" },
          { position: "Third & Consolation", reward: "₹526" },
        ],
      },
      {
        level: "Girls & Boys Mixed U-12",
        prizes: [
          { position: "First Prize", reward: "₹1,526" },
          { position: "Second Prize", reward: "₹1,026" },
          { position: "Third & Consolation", reward: "₹526" },
        ],
      },
      {
        level: "Girls & Boys Mixed U-15",
        prizes: [
          { position: "First Prize", reward: "₹1,526" },
          { position: "Second Prize", reward: "₹1,026" },
          { position: "Third & Consolation", reward: "₹526" },
        ],
      },
      {
        level: "Open Chess – Girls & Boys Mixed",
        prizes: [
          { position: "First Prize", reward: "₹2,526" },
          { position: "Second Prize", reward: "₹1,026" },
          { position: "Third & Consolation", reward: "₹526" },
        ],
      },
    ],
    fees: [
      { item: "Entry Fee", amount: "₹400" },
      { item: "Arbiter & Venue Fees", amount: "Included" },
      { item: "Refreshments", amount: "Complimentary" },
    ],
    playerFees: [
      { ageCategory: "U-9", category: "Girls & Boys Mixed", fee: "₹400" },
      { ageCategory: "U-12", category: "Girls & Boys Mixed", fee: "₹400" },
      { ageCategory: "U-15", category: "Girls & Boys Mixed", fee: "₹400" },
      { ageCategory: "Open", category: "Girls & Boys Mixed", fee: "₹400" },
    ],
    venueDetails: [
      {
        district: "Chennai",
        locations: [
          "SISA Sports Hub, T. Nagar, Chennai",
          "Hall of Chess, YMCA, Nandanam, Chennai",
        ],
      },
    ],
  },
];
