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

export interface SponsorDetail {
  name: string;
  company: string;
  photo: string;
  subText?: string;
  phone?: string;
  prizeValue?: string;
}

export interface TournamentSponsors {
  trophyPrize: SponsorDetail[];
  cashPrize: SponsorDetail[];
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
  lastDateToRegister?: string;
  contactNumbers?: string[];
  mapUrl?: string;
  reportingTime?: string;
  sponsors?: TournamentSponsors;
}

export const tournaments: Tournament[] = [
  {
    slug: "tamilnadu-badminton-tournament-2026",
    title: "Tamilnadu Badminton tournament 2026",
    subtitle: "One Spirit. One Game. One Champion.",
    sport: "Badminton",
    status: "Upcoming",
    sponsors: {
      trophyPrize: [
        { name: "Sri Vaari Transmotors", company: "Sankagiri", photo: "/sponsors/vaari_transmotors.jpg", subText: "1st Winner Trophy Sponsor", phone: "7373344877", prizeValue: "₹12,000" },
        { name: "Mr. Palanisamy & Mr. P.S. Selvaranu", company: "Sri Sendhur Tyres - Sankagiri", photo: "/sponsors/classic_sports.png", subText: "2nd Winner Trophy Sponsor", phone: "9442683383", prizeValue: "₹10,000" },
        { name: "Mr. Pradeep", company: "RKS Transports", photo: "/sponsors/rks_transport.png", subText: "3rd Winner Trophy Sponsor", phone: "9865728777", prizeValue: "₹8,000" }
      ],
      cashPrize: [
        { name: "Mr. N Suresh", company: "KRN Transport - Sankagiri", photo: "/sponsors/elite_sports.png", subText: "Cash Sponsor", phone: "9443292058" },
        { name: "M. Rajini", company: "Simon Road Lines", photo: "/sponsors/apex_sports.png", subText: "Cash Sponsor" },
        { name: "Vijay", company: "Vetri Xerox", photo: "/sponsors/salem_badminton.png", subText: "Cash Sponsor", phone: "9788622771" },
        { name: "Anand", company: "Ampere Electric Scooty - Sankagiri", photo: "/sponsors/prime_fitness.png", subText: "Cash Sponsor", phone: "9952823987" },
        { name: "Suresh", company: "Photographer - Sankagiri", photo: "/sponsors/victor_shuttle.png", subText: "Cash Sponsor", phone: "9688821200" },
        { name: "Nandha", company: "RV Surgical", photo: "/sponsors/sisa_sports_hub.png", subText: "Cash Sponsor", phone: "9489925688" },
        { name: "Chenny's Park School", company: "Kuppanur Bypass, Sankagiri", photo: "/sponsors/chennys_school.png", subText: "Official School Partner", phone: "9790097650" },
        { name: "Sibi", company: "SA Construction - Sankagiri", photo: "/sponsors/sa_construction.png", subText: "Cash Sponsor", phone: "9626482815" },
        { name: "Manoj", company: "SNR Transport", photo: "/sponsors/snr_transport.png", subText: "Cash Sponsor", phone: "9788855477" },
        { name: "NRS Transport", company: "Sankagiri", photo: "/sponsors/nrs_transport.png", subText: "Cash Sponsor", phone: "9442237575" }
      ]
    },
    date: "June 27 & 28, 2026",
    venue: "SBM Shuttle Court, Sangagiri",
    lastDateToRegister: "25.06.2026",
    contactNumbers: ["90800 60483", "90923 85001"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=SBM+Sports+Academy+Sankagiri+Behind+Axis+Bank",
    prize: "₹2,00,000 in Cash Prizes",
    categories: "Girls Singles U9-U15, Boys Singles U7-U15 & Boys Open Singles",
    description:
      "🏸 One Spirit. One Game. One Champion! Join the premier Tamilnadu Badminton Tournament 2026. Compete against top talent across South India for awards, gear, and cash prizes from a massive ₹2,00,000 prize pool.",
    registrationCategories: ["Girls Singles", "Boys Singles", "Boys Open Singles"],
    ageCategories: ["U-7", "U-9", "U-11", "U-13", "U-15", "Open"],
    rules: [
      {
        title: "1. Shuttle & Equipment",
        content: "Feather Shuttle will be used. Participants must carry their own badminton rackets and equipment.",
      },
      {
        title: "2. Age Verification",
        content: "Age proof is mandatory. Players must produce a valid identity card/document during reporting.",
      },
      {
        title: "3. Match Format",
        content: "21 Points Knockout Format (Golden Point Rule) will be followed for all matches. Organizer/Umpire decision will be final.",
      },
      {
        title: "4. Footwear & Gear",
        content: "Only non-marking shoes are allowed on the court. Participants must wear appropriate sports attire.",
      },
      {
        title: "5. Reporting Time",
        content: "Players must report 15 minutes before their match time. Walkover will be given for late reporting.",
      },
      {
        title: "6. Registrations & Payments",
        content: "No spot registration is allowed. Only online payment accepted. Fixtures will be released prior to the tournament. The organizing committee reserves the right to modify fixtures if necessary.",
      },
    ],
    rewards: [
      {
        level: "Girls Singles U-9",
        prizes: [
          { position: "Winner", reward: "₹2,026" },
          { position: "Runner-up", reward: "₹1,026" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Girls Singles U-11",
        prizes: [
          { position: "Winner", reward: "₹2,026" },
          { position: "Runner-up", reward: "₹1,026" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Girls Singles U-13",
        prizes: [
          { position: "Winner", reward: "₹2,026" },
          { position: "Runner-up", reward: "₹1,026" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Girls Singles U-15",
        prizes: [
          { position: "Winner", reward: "₹2,026" },
          { position: "Runner-up", reward: "₹1,026" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Boys Singles U-7",
        prizes: [
          { position: "Winner", reward: "RACKET" },
          { position: "Runner-up", reward: "KIT BAG" },
          { position: "Semi Finalists (2)", reward: "SKIPPING ROPE" },
        ],
      },
      {
        level: "Boys Singles U-9",
        prizes: [
          { position: "Winner", reward: "₹2,526" },
          { position: "Runner-up", reward: "₹1,526" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Boys Singles U-11",
        prizes: [
          { position: "Winner", reward: "₹2,526" },
          { position: "Runner-up", reward: "₹1,526" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Boys Singles U-13",
        prizes: [
          { position: "Winner", reward: "₹2,526" },
          { position: "Runner-up", reward: "₹1,526" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Boys Singles U-15",
        prizes: [
          { position: "Winner", reward: "₹2,526" },
          { position: "Runner-up", reward: "₹1,526" },
          { position: "Semi Finalists (2)", reward: "₹526" },
        ],
      },
      {
        level: "Boys Open Singles",
        prizes: [
          { position: "Winner", reward: "₹5,026" },
          { position: "Runner-up", reward: "₹3,026" },
          { position: "Semi Finalists (2)", reward: "₹1,026" },
        ],
      },
    ],
    fees: [
      { item: "Entry Fee", amount: "₹800" },
      { item: "Shuttle & Court Fees", amount: "Included" },
      { item: "Refreshments", amount: "Complimentary" },
    ],
    playerFees: [
      { ageCategory: "U-9", category: "Girls Singles", fee: "₹800" },
      { ageCategory: "U-11", category: "Girls Singles", fee: "₹800" },
      { ageCategory: "U-13", category: "Girls Singles", fee: "₹800" },
      { ageCategory: "U-15", category: "Girls Singles", fee: "₹800" },
      { ageCategory: "U-7", category: "Boys Singles", fee: "₹800" },
      { ageCategory: "U-9", category: "Boys Singles", fee: "₹800" },
      { ageCategory: "U-11", category: "Boys Singles", fee: "₹800" },
      { ageCategory: "U-13", category: "Boys Singles", fee: "₹800" },
      { ageCategory: "U-15", category: "Boys Singles", fee: "₹800" },
      { ageCategory: "Open", category: "Boys Open Singles", fee: "₹800" },
    ],
  },
  {
    slug: "chess-tournament-2026",
    title: "Chess Tournament 2026",
    subtitle: "Strategize. Think. Win.",
    sport: "Chess",
    status: "Upcoming",
    date: "June 26, 2026",
    venue: "SBM SHUTTLE COURT, 18D6, Settia Gounder Complex, Axis bank, Bhavani Main road, Sankagiri, Salem 6377301, Tamilnadu",
    lastDateToRegister: "25.06.2026",
    reportingTime: "9:00 AM",
    contactNumbers: ["90800 60483", "9092385001"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=SBM+SHUTTLE+COURT+18D6+Settia+Gounder+Complex+Axis+bank+Bhavani+Main+road+Sankagiri+Salem+6377301+Tamilnadu",
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
      {
        title: "6. Reporting Time",
        content:
          "All participants must report at the registration desk by 9:00 AM. The first round of the tournament will commence shortly after.",
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
  },
];
