export interface TournamentRule {
  title: string;
  content: string;
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
  rules: TournamentRule[];
}

export const tournaments: Tournament[] = [
  {
    slug: "south-india-open-badminton-2026",
    title: "South India Open",
    subtitle: "Badminton Tournament",
    sport: "Badminton",
    status: "Upcoming",
    date: "July 15-20, 2026",
    venue: "Chennai Indoor Stadium",
    prize: "₹5,00,000",
    categories: "Singles & Doubles",
    description:
      "The premier badminton championship of South India, bringing together top players from across the region to compete for glory and prize money.",
    registrationCategories: ["singles", "doubles"],
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
  },
];
