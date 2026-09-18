/**
 * Rule-based problem analysis and business-opportunity generation.
 *
 * This is the demo "AI" engine: it works offline with no API key so the app is
 * fully functional immediately. The functions below are pure and share the same
 * input/output shapes an AI model would return, so a real AI call can be
 * dropped in later behind `analyseProblem()` / `generateOpportunity()` without
 * changing any page.
 */

import { CATEGORIES, categoryById, type CategoryId } from "./sa-data";

const KEYWORDS: { category: CategoryId; words: string[] }[] = [
  {
    category: "plumbing",
    words: ["tap", "leak", "pipe", "toilet", "geyser", "drain", "water", "blocked", "burst"],
  },
  {
    category: "electrical",
    words: ["electric", "wiring", "plug", "socket", "db board", "power", "light", "prepaid", "load"],
  },
  {
    category: "cleaning",
    words: ["clean", "cleaner", "domestic", "laundry", "housekeep", "airbnb", "tidy"],
  },
  { category: "gardening", words: ["garden", "lawn", "grass", "tree", "hedge", "yard", "rubble"] },
  {
    category: "mechanics",
    words: ["car", "bakkie", "engine", "brake", "mechanic", "service", "battery", "tyre"],
  },
  {
    category: "construction",
    words: ["build", "paint", "tile", "roof", "wall", "paving", "handyman", "renovat", "ceiling"],
  },
  {
    category: "appliance-repair",
    words: ["washing machine", "fridge", "stove", "oven", "dryer", "microwave", "appliance", "tv"],
  },
  {
    category: "tutoring",
    words: ["tutor", "maths", "homework", "school", "exam", "lesson", "study", "grade"],
  },
  {
    category: "it",
    words: ["laptop", "computer", "wifi", "internet", "printer", "virus", "software", "website"],
  },
  { category: "beauty", words: ["hair", "nails", "makeup", "braid", "salon", "lashes", "barber"] },
  {
    category: "transport",
    words: ["move", "delivery", "transport", "bakkie hire", "lift", "furniture", "courier"],
  },
];

export type ProblemAnalysis = {
  problem: string;
  category: CategoryId;
  categoryName: string;
  serviceRequired: string;
  opportunity: string;
  businessModels: string[];
  targetMarket: string[];
  confidence: "high" | "medium" | "low";
};

/** Detects the most likely service category from free-text problem description. */
export function detectCategory(description: string): { category: CategoryId; hits: number } {
  const text = description.toLowerCase();
  let best: { category: CategoryId; hits: number } = { category: "other", hits: 0 };
  for (const entry of KEYWORDS) {
    const hits = entry.words.filter((w) => text.includes(w)).length;
    if (hits > best.hits) best = { category: entry.category, hits };
  }
  return best;
}

const MODELS: Record<string, string[]> = {
  default: [
    "Charge per job completed",
    "Offer a call-out fee plus labour",
    "Sell monthly maintenance packages",
    "Partner with local retailers and property managers",
    "Offer household subscription plans",
  ],
  cleaning: [
    "Charge per clean (hourly or per property size)",
    "Weekly or fortnightly cleaning contracts",
    "Airbnb and guesthouse turnover packages",
    "Office cleaning contracts with small businesses",
    "Commission from placing vetted cleaners",
  ],
  tutoring: [
    "Charge per lesson or per hour",
    "Monthly tutoring packages per subject",
    "Small group classes to lower the price per learner",
    "Exam-season holiday bootcamps",
    "Partner with schools and community centres",
  ],
  transport: [
    "Charge per trip plus a per-kilometre rate",
    "Fixed-price local moving packages",
    "Retainer deliveries for small shops",
    "Weekend student-move specials",
  ],
};

const MARKETS: Record<string, string[]> = {
  default: [
    "Households",
    "Rental properties and landlords",
    "Guesthouses and Airbnb hosts",
    "Small businesses",
    "Property managers and body corporates",
  ],
  tutoring: [
    "Parents of Grade 8–12 learners",
    "Matric learners preparing for finals",
    "Schools needing extra lesson support",
    "Adult learners and upskilling students",
  ],
  beauty: [
    "Working professionals",
    "Students",
    "Wedding and event clients",
    "Local community clients wanting mobile services",
  ],
};

export function analyseProblem(description: string, selectedCategory?: CategoryId): ProblemAnalysis {
  const detected = detectCategory(description);
  const category: CategoryId =
    selectedCategory && selectedCategory !== "other"
      ? selectedCategory
      : detected.hits > 0
        ? detected.category
        : (selectedCategory ?? "other");
  const cat = categoryById(category);
  const trimmed = description.trim().replace(/\s+/g, " ");
  const problem =
    trimmed.length > 90 ? `${trimmed.slice(0, 90)}…` : trimmed || "Service problem reported";

  return {
    problem: problem.charAt(0).toUpperCase() + problem.slice(1),
    category,
    categoryName: cat.name,
    serviceRequired: cat.serviceTitle,
    opportunity: `Local ${cat.name.toLowerCase()} service`,
    businessModels: MODELS[category] ?? MODELS["default"]!,
    targetMarket: MARKETS[category] ?? MARKETS["default"]!,
    confidence: detected.hits >= 2 ? "high" : detected.hits === 1 ? "medium" : "low",
  };
}

export type OpportunityPlan = {
  name: string;
  problem: string;
  targetMarket: string[];
  proposedService: string;
  businessModel: string[];
  requiredSkills: string[];
  equipment: string[];
  startupCostRange: string;
  pricingModel: string[];
  marketing: string[];
  acquisitionChannels: string[];
  firstTenSteps: string[];
  risks: string[];
  waysToTest: string[];
};

const SKILLS: Partial<Record<CategoryId, string[]>> = {
  plumbing: [
    "Practical plumbing experience or a trade qualification",
    "Leak detection and pipe fitting",
    "Basic quoting and invoicing",
    "Customer communication",
  ],
  electrical: [
    "Registered electrician / wireman's licence for certificate work",
    "Fault finding and safe installation",
    "Knowledge of local wiring regulations",
    "Quoting and record keeping",
  ],
  cleaning: [
    "Reliable cleaning standards and checklists",
    "Team scheduling",
    "Basic bookkeeping",
    "Customer service and trust building",
  ],
  tutoring: [
    "Strong subject knowledge",
    "Lesson planning",
    "Patience and clear explanation",
    "Progress tracking and parent feedback",
  ],
};

const EQUIPMENT: Partial<Record<CategoryId, string[]>> = {
  plumbing: ["Pipe wrenches and spanners", "Drain cleaning rods", "Leak sealant and fittings", "Reliable transport"],
  electrical: ["Multimeter and test equipment", "Hand tools and cable", "Ladder", "Safety gear"],
  cleaning: ["Vacuum and mops", "Cleaning chemicals", "Protective gloves", "Transport to sites"],
  gardening: ["Lawnmower and weed eater", "Hand tools", "Rubble bags", "Bakkie or trailer"],
  "appliance-repair": ["Tool kit and multimeter", "Common spare parts", "Workbench", "Transport"],
  tutoring: ["Laptop and data", "Textbooks and past papers", "Quiet teaching space", "Whiteboard"],
  transport: ["Bakkie or van", "Straps, blankets and trolley", "Valid licence and insurance", "Fuel float"],
};

const COSTS: Partial<Record<CategoryId, string>> = {
  plumbing: "R8 000 – R30 000 (estimate)",
  electrical: "R10 000 – R40 000 (estimate)",
  cleaning: "R3 000 – R12 000 (estimate)",
  gardening: "R5 000 – R20 000 (estimate)",
  "appliance-repair": "R6 000 – R25 000 (estimate)",
  tutoring: "R1 000 – R6 000 (estimate)",
  transport: "R40 000 – R150 000 (estimate, mainly the vehicle)",
  it: "R5 000 – R20 000 (estimate)",
  beauty: "R4 000 – R25 000 (estimate)",
  construction: "R15 000 – R60 000 (estimate)",
  mechanics: "R15 000 – R60 000 (estimate)",
};

export function generateOpportunity(
  description: string,
  location?: { city?: string; province?: string },
  selectedCategory?: CategoryId,
): OpportunityPlan {
  const analysis = analyseProblem(description, selectedCategory);
  const cat = categoryById(analysis.category);
  const area = location?.city ? `${location.city}` : "your area";

  return {
    name: `${cat.name} Connect ${location?.city ? `— ${location.city}` : ""}`.trim(),
    problem: analysis.problem,
    targetMarket: analysis.targetMarket,
    proposedService: `A local ${cat.serviceTitle.toLowerCase()} service serving ${area}, with clear pricing, fast response times and reviewed, contactable providers.`,
    businessModel: analysis.businessModels,
    requiredSkills:
      SKILLS[analysis.category] ??
      [
        `Practical ${cat.name.toLowerCase()} skills or a qualified partner`,
        "Reliable timekeeping and communication",
        "Quoting, invoicing and basic record keeping",
        "Simple marketing on WhatsApp and Facebook",
      ],
    equipment:
      EQUIPMENT[analysis.category] ??
      ["Basic tools for the service", "A smartphone with WhatsApp", "Transport to reach clients", "Safety equipment"],
    startupCostRange: COSTS[analysis.category] ?? "R5 000 – R30 000 (estimate)",
    pricingModel: [
      "Transparent starting price shown upfront in Rand",
      "Call-out fee for emergency or after-hours work",
      "Quote per job for larger work",
      "Discount for repeat or contract customers",
    ],
    marketing: [
      `Join and post in ${area} community WhatsApp and Facebook groups`,
      "Branded flyers at spaza shops, schools and taxi ranks",
      "Vehicle or uniform branding",
      "Ask every happy customer for a review and a referral",
      "List the business on this platform with a verified profile",
    ],
    acquisitionChannels: [
      "WhatsApp Business catalogue and status updates",
      "Facebook community groups",
      "Google Business Profile for local searches",
      "Referrals from estate agents, landlords and body corporates",
      "Partnerships with hardware stores and retailers",
    ],
    firstTenSteps: [
      `Confirm demand: talk to 20 people in ${area} about this problem`,
      "Decide exactly which jobs you will and will not take",
      "Set your starting prices and call-out fee in Rand",
      "Register the business (CIPC) and open a separate bank or wallet account",
      "Arrange the minimum tools you need — borrow or rent before buying",
      "Create a WhatsApp Business number and a simple price list",
      "Build a provider profile on this platform with your areas served",
      "Do your first 5 jobs at an introductory price to earn reviews",
      "Collect a photo and a review after every job",
      "Reinvest the first profits into tools, transport and marketing",
    ],
    risks: [
      "Customers who do not pay or delay payment — take a deposit for materials",
      "Seasonal or uneven demand",
      "Competition from cheaper informal providers",
      "Travel cost and time in large metros",
      "Safety risks when visiting unknown addresses — verify the customer first",
      "Legal or certification requirements for certain trades",
    ],
    waysToTest: [
      "Post an offer in one local group and count the enquiries before spending money",
      "Run the service part-time on weekends first",
      "Take bookings by WhatsApp before building anything bigger",
      "Rent or borrow equipment for the first jobs",
      "Offer 5 jobs at a low introductory price and measure repeat requests",
    ],
  };
}

export const ALL_CATEGORY_IDS = CATEGORIES.map((c) => c.id);
