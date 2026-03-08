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
    slug: "south-india-open-badminton-2026",
    title: "South India Open",
    subtitle: "Badminton Tournament",
    sport: "Badminton",
    status: "Upcoming",
    date: "April 25-30, 2026",
    venue: "Multiple Locations",
    prize: "₹1,00,00,000",
    categories: "Singles & Doubles",
    description:
      "The premier badminton championship of South India, bringing together top players from across the region to compete for glory and prize money.",
    registrationCategories: ["Singles", "Doubles"],
    ageCategories: ["U9", "U11", "U13", "U15", "U17", "U19"],
    rules: [
      {
        title: "1. Match Format",
        content:
          "All matches will be played in a best-of-3 games format. Each game is played to 21 points with a 2-point lead required. At 29-all, the side scoring the 30th point wins. Rally point scoring system applies throughout.",
      },
      {
        title: "2. Entry Rules",
        content:
          "Players must register at least 7 days before the tournament. Valid ID proof and age verification are mandatory. Registration fees are non-refundable. A maximum of 256 entries per category will be accepted on a first-come, first-served basis.",
      },
      {
        title: "3. Court Regulations",
        content:
          "All matches will be played on BWF-approved synthetic courts. Players must wear proper non-marking sports shoes. Only BWF-approved feather shuttlecocks will be used. Players are allowed a 60-second rest between games.",
      },
      {
        title: "4. Referee Decisions",
        content:
          "The referee's decision is final and binding. Video review may be used for semi-finals and finals. Players can request one challenge per game. Misconduct or unsportsmanlike behavior may result in immediate disqualification.",
      },
      {
        title: "5. Player Conduct",
        content:
          "Players must report to the venue 30 minutes before their scheduled match. Failure to report on time will result in a walkover. Players must adhere to the dress code and display their registration ID at all times. No coaching is allowed during live play.",
      },
    ],
    rewards: [
      {
        level: "District Level",
        prizes: [{ reward: "Trophy + Medal + Certificate" }],
      },
      {
        level: "State Level",
        prizes: [
          { position: "Winner", reward: "₹10,000" },
          { position: "Runner", reward: "₹5,000" },
          { position: "Semi-Final", reward: "₹2,500 + Certificate" },
        ],
      },
      {
        level: "South Zone Level",
        prizes: [
          { position: "Winner", reward: "₹50,000 + Cycle + Medal" },
          { position: "Runner", reward: "₹25,000 + Racquet" },
          { position: "Third", reward: "₹15,000 + Kit Bag" },
        ],
      },
    ],
    fees: [
      { item: "Court Fees", amount: "₹10,000" },
      { item: "Umpire Fees", amount: "₹10,000" },
      { item: "Shuttle Cocks", amount: "₹5,000" },
      { item: "Tournament Management", amount: "₹15,000" },
    ],
    playerFees: [
      { ageCategory: "U9", category: "Singles", fee: "₹500" },
      { ageCategory: "U9", category: "Doubles", fee: "₹800" },
      { ageCategory: "U11", category: "Singles", fee: "₹500" },
      { ageCategory: "U11", category: "Doubles", fee: "₹800" },
      { ageCategory: "U13", category: "Singles", fee: "₹600" },
      { ageCategory: "U13", category: "Doubles", fee: "₹1000" },
      { ageCategory: "U15", category: "Singles", fee: "₹600" },
      { ageCategory: "U15", category: "Doubles", fee: "₹1000" },
      { ageCategory: "U17", category: "Singles", fee: "₹750" },
      { ageCategory: "U17", category: "Doubles", fee: "₹1200" },
      { ageCategory: "U19", category: "Singles", fee: "₹750" },
      { ageCategory: "U19", category: "Doubles", fee: "₹1200" },
    ],
    venueDetails: [
      {
        district: "Chennai",
        locations: [
          "Chennai Indoor Stadium, Periamet",
          "Fireball Badminton Academy, Anna Nagar",
          "Smash Bounce, Velachery",
        ],
      },
      {
        district: "Coimbatore",
        locations: [
          "Avinashilingam Indoor Stadium",
          "Prozone Sports Club",
        ],
      },
      {
        district: "Madurai",
        locations: [
          "Race Course Stadium",
        ],
      },
    ],
  },
];
