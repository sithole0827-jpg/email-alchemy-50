/**
 * Sample (demo) South African data.
 *
 * IMPORTANT: everything in this file is demonstration data created for the
 * prototype. It is NOT an official measurement of South African demand and is
 * kept separate from data submitted by real users (see src/lib/store.tsx).
 */

export type CategoryId =
  | "plumbing"
  | "electrical"
  | "cleaning"
  | "gardening"
  | "mechanics"
  | "construction"
  | "appliance-repair"
  | "tutoring"
  | "it"
  | "beauty"
  | "transport"
  | "other";

export type Category = {
  id: CategoryId;
  name: string;
  serviceTitle: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: "plumbing", name: "Plumbing", serviceTitle: "Plumber", emoji: "🔧" },
  { id: "electrical", name: "Electrical", serviceTitle: "Electrician", emoji: "💡" },
  { id: "cleaning", name: "Cleaning", serviceTitle: "Cleaner", emoji: "🧽" },
  { id: "gardening", name: "Gardening", serviceTitle: "Gardener / landscaper", emoji: "🌿" },
  { id: "mechanics", name: "Mechanics", serviceTitle: "Motor mechanic", emoji: "🚗" },
  { id: "construction", name: "Construction", serviceTitle: "Builder / handyman", emoji: "🧱" },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    serviceTitle: "Appliance repair technician",
    emoji: "🧺",
  },
  { id: "tutoring", name: "Tutoring", serviceTitle: "Tutor", emoji: "📚" },
  { id: "it", name: "Computer / IT", serviceTitle: "IT technician", emoji: "💻" },
  { id: "beauty", name: "Beauty", serviceTitle: "Beauty professional", emoji: "💇🏽" },
  { id: "transport", name: "Transport", serviceTitle: "Driver / transporter", emoji: "🚚" },
  { id: "other", name: "Other", serviceTitle: "General service provider", emoji: "🛠️" },
];

export function categoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]!;
}

export const PROVINCES: { name: string; cities: string[] }[] = [
  {
    name: "Gauteng",
    cities: ["Johannesburg", "Pretoria", "Soweto", "Ekurhuleni", "Vereeniging", "Krugersdorp"],
  },
  { name: "Western Cape", cities: ["Cape Town", "Stellenbosch", "Paarl", "George", "Worcester"] },
  {
    name: "KwaZulu-Natal",
    cities: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Umlazi"],
  },
  { name: "Eastern Cape", cities: ["Gqeberha", "East London", "Mthatha", "Qonce"] },
  { name: "Free State", cities: ["Bloemfontein", "Welkom", "Sasolburg", "Botshabelo"] },
  { name: "Limpopo", cities: ["Polokwane", "Thohoyandou", "Tzaneen", "Mokopane"] },
  { name: "Mpumalanga", cities: ["Mbombela", "Emalahleni", "Secunda", "Ermelo"] },
  { name: "North West", cities: ["Rustenburg", "Mahikeng", "Klerksdorp", "Potchefstroom"] },
  { name: "Northern Cape", cities: ["Kimberley", "Upington", "Springbok", "Kuruman"] },
];

export const PROVINCE_NAMES = PROVINCES.map((p) => p.name);

export function citiesForProvince(province: string): string[] {
  return PROVINCES.find((p) => p.name === province)?.cities ?? [];
}

export type Provider = {
  id: string;
  businessName: string;
  ownerName: string;
  category: CategoryId;
  province: string;
  city: string;
  areasServed: string[];
  description: string;
  startingPrice: number; // ZAR
  availability: string;
  phone: string; // SA format
  whatsapp: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  verified: boolean;
};

export const DEMO_PROVIDERS: Provider[] = [
  {
    id: "p-001",
    businessName: "Kgosi Plumbing Works",
    ownerName: "Kgosi Maleka",
    category: "plumbing",
    province: "Gauteng",
    city: "Pretoria",
    areasServed: ["Sunnyside", "Arcadia", "Hatfield", "Centurion"],
    description:
      "Leak repairs, geyser installations and blocked drains. Emergency call-outs after hours.",
    startingPrice: 450,
    availability: "Mon–Sat, 07:00–18:00 (emergency 24/7)",
    phone: "081 234 5678",
    whatsapp: "27812345678",
    rating: 4.8,
    reviewCount: 64,
    completedJobs: 212,
    verified: true,
  },
  {
    id: "p-002",
    businessName: "AquaFix Pretoria",
    ownerName: "Lerato Mnguni",
    category: "plumbing",
    province: "Gauteng",
    city: "Pretoria",
    areasServed: ["Menlyn", "Lynnwood", "Garsfontein"],
    description: "Household plumbing, tap and toilet repairs, water-saving installations.",
    startingPrice: 380,
    availability: "Mon–Fri, 08:00–17:00",
    phone: "072 884 1190",
    whatsapp: "27728841190",
    rating: 4.4,
    reviewCount: 27,
    completedJobs: 88,
    verified: false,
  },
  {
    id: "p-003",
    businessName: "Sparks Electrical CC",
    ownerName: "Devan Pillay",
    category: "electrical",
    province: "KwaZulu-Natal",
    city: "Durban",
    areasServed: ["Umhlanga", "Durban North", "Phoenix"],
    description: "Certified electrical repairs, DB boards, load-shedding backup installations.",
    startingPrice: 600,
    availability: "Mon–Sat, 07:30–17:00",
    phone: "083 551 2204",
    whatsapp: "27835512204",
    rating: 4.9,
    reviewCount: 103,
    completedJobs: 340,
    verified: true,
  },
  {
    id: "p-004",
    businessName: "Shine Home Cleaning",
    ownerName: "Nomvula Dlamini",
    category: "cleaning",
    province: "Gauteng",
    city: "Johannesburg",
    areasServed: ["Randburg", "Sandton", "Rosebank", "Soweto"],
    description: "Deep cleans, move-in/move-out cleaning and Airbnb turnovers. Own equipment.",
    startingPrice: 350,
    availability: "Mon–Sun, flexible",
    phone: "076 220 7788",
    whatsapp: "27762207788",
    rating: 4.7,
    reviewCount: 81,
    completedJobs: 265,
    verified: true,
  },
  {
    id: "p-005",
    businessName: "Cape Clean Crew",
    ownerName: "Ashwin Petersen",
    category: "cleaning",
    province: "Western Cape",
    city: "Cape Town",
    areasServed: ["Claremont", "Woodstock", "Mitchells Plain", "Bellville"],
    description: "Office and household cleaning teams, weekly or once-off.",
    startingPrice: 420,
    availability: "Mon–Sat",
    phone: "084 909 3311",
    whatsapp: "27849093311",
    rating: 4.3,
    reviewCount: 39,
    completedJobs: 121,
    verified: false,
  },
  {
    id: "p-006",
    businessName: "GreenHands Gardening",
    ownerName: "Sipho Nkosi",
    category: "gardening",
    province: "Gauteng",
    city: "Pretoria",
    areasServed: ["Moot", "Waverley", "Montana"],
    description: "Garden maintenance, tree felling, rubble removal and lawn care.",
    startingPrice: 300,
    availability: "Mon–Sat, 06:30–16:00",
    phone: "079 118 4422",
    whatsapp: "27791184422",
    rating: 4.6,
    reviewCount: 44,
    completedJobs: 174,
    verified: true,
  },
  {
    id: "p-007",
    businessName: "Mzansi Mobile Mechanics",
    ownerName: "Tumi Rakgetse",
    category: "mechanics",
    province: "Gauteng",
    city: "Ekurhuleni",
    areasServed: ["Kempton Park", "Benoni", "Boksburg"],
    description: "Mobile servicing, brakes, batteries and pre-roadworthy checks at your home.",
    startingPrice: 550,
    availability: "Mon–Sat, 08:00–18:00",
    phone: "073 445 9080",
    whatsapp: "27734459080",
    rating: 4.5,
    reviewCount: 58,
    completedJobs: 196,
    verified: false,
  },
  {
    id: "p-008",
    businessName: "FixIt Appliance Repairs",
    ownerName: "Fatima Ismail",
    category: "appliance-repair",
    province: "Gauteng",
    city: "Pretoria",
    areasServed: ["Centurion", "Pretoria East", "Midrand"],
    description: "Washing machines, fridges, tumble dryers and stoves. 3-month repair warranty.",
    startingPrice: 400,
    availability: "Mon–Fri, 08:00–17:00; Sat mornings",
    phone: "082 665 1207",
    whatsapp: "27826651207",
    rating: 4.8,
    reviewCount: 72,
    completedJobs: 238,
    verified: true,
  },
  {
    id: "p-009",
    businessName: "BrightMinds Tutoring",
    ownerName: "Zanele Khumalo",
    category: "tutoring",
    province: "KwaZulu-Natal",
    city: "Pietermaritzburg",
    areasServed: ["Scottsville", "Hayfields", "Online"],
    description: "Maths, Physical Sciences and Accounting tutoring for Grades 8–12.",
    startingPrice: 220,
    availability: "Weekday afternoons and Saturdays",
    phone: "071 330 6654",
    whatsapp: "27713306654",
    rating: 4.9,
    reviewCount: 35,
    completedJobs: 410,
    verified: true,
  },
  {
    id: "p-010",
    businessName: "TechCare IT Support",
    ownerName: "Byron Adams",
    category: "it",
    province: "Western Cape",
    city: "Cape Town",
    areasServed: ["CBD", "Southern Suburbs", "Remote"],
    description: "Laptop repairs, virus removal, home Wi-Fi setup and small-office IT support.",
    startingPrice: 500,
    availability: "Mon–Fri, 09:00–18:00",
    phone: "066 772 4419",
    whatsapp: "27667724419",
    rating: 4.2,
    reviewCount: 21,
    completedJobs: 76,
    verified: false,
  },
  {
    id: "p-011",
    businessName: "Bakkie & Go Transport",
    ownerName: "Jan van Wyk",
    category: "transport",
    province: "Free State",
    city: "Bloemfontein",
    areasServed: ["Bloemfontein", "Botshabelo", "Welkom"],
    description: "Furniture moves, deliveries and student moves with a 1-ton bakkie.",
    startingPrice: 650,
    availability: "Daily, bookings required",
    phone: "078 004 2213",
    whatsapp: "27780042213",
    rating: 4.4,
    reviewCount: 18,
    completedJobs: 63,
    verified: false,
  },
  {
    id: "p-012",
    businessName: "Glow Beauty Studio",
    ownerName: "Palesa Moloi",
    category: "beauty",
    province: "Gauteng",
    city: "Soweto",
    areasServed: ["Orlando", "Diepkloof", "Meadowlands"],
    description: "Hair, nails and makeup at the studio or mobile in Soweto.",
    startingPrice: 180,
    availability: "Tue–Sun",
    phone: "081 990 3344",
    whatsapp: "27819903344",
    rating: 4.7,
    reviewCount: 52,
    completedJobs: 300,
    verified: true,
  },
  {
    id: "p-013",
    businessName: "SolidBuild Handyman",
    ownerName: "Andile Zulu",
    category: "construction",
    province: "Eastern Cape",
    city: "Gqeberha",
    areasServed: ["Summerstrand", "Newton Park", "Motherwell"],
    description: "Paving, tiling, painting, waterproofing and small building jobs.",
    startingPrice: 800,
    availability: "Mon–Sat",
    phone: "074 118 2266",
    whatsapp: "27741182266",
    rating: 4.1,
    reviewCount: 14,
    completedJobs: 47,
    verified: false,
  },
  {
    id: "p-014",
    businessName: "Limpopo Lights Electrical",
    ownerName: "Rendani Mudau",
    category: "electrical",
    province: "Limpopo",
    city: "Polokwane",
    areasServed: ["Polokwane", "Seshego", "Mankweng"],
    description: "Household wiring, prepaid meter issues, geyser element replacement.",
    startingPrice: 480,
    availability: "Mon–Sat, 08:00–17:00",
    phone: "060 447 1982",
    whatsapp: "27604471982",
    rating: 4.5,
    reviewCount: 23,
    completedJobs: 91,
    verified: false,
  },
];

/** Demo problem reports used to populate demand statistics before real reports exist. */
export type DemoReport = {
  category: CategoryId;
  province: string;
  city: string;
  count: number;
};

export const DEMO_REPORTS: DemoReport[] = [
  { category: "plumbing", province: "Gauteng", city: "Pretoria", count: 127 },
  { category: "electrical", province: "Gauteng", city: "Pretoria", count: 74 },
  { category: "cleaning", province: "Gauteng", city: "Pretoria", count: 46 },
  { category: "appliance-repair", province: "Gauteng", city: "Pretoria", count: 58 },
  { category: "cleaning", province: "Gauteng", city: "Johannesburg", count: 143 },
  { category: "plumbing", province: "Gauteng", city: "Johannesburg", count: 96 },
  { category: "transport", province: "Gauteng", city: "Soweto", count: 61 },
  { category: "beauty", province: "Gauteng", city: "Soweto", count: 38 },
  { category: "electrical", province: "KwaZulu-Natal", city: "Durban", count: 88 },
  { category: "cleaning", province: "KwaZulu-Natal", city: "Durban", count: 52 },
  { category: "tutoring", province: "KwaZulu-Natal", city: "Pietermaritzburg", count: 44 },
  { category: "cleaning", province: "Western Cape", city: "Cape Town", count: 156 },
  { category: "it", province: "Western Cape", city: "Cape Town", count: 49 },
  { category: "gardening", province: "Western Cape", city: "Stellenbosch", count: 31 },
  { category: "construction", province: "Eastern Cape", city: "Gqeberha", count: 67 },
  { category: "mechanics", province: "Eastern Cape", city: "East London", count: 29 },
  { category: "transport", province: "Free State", city: "Bloemfontein", count: 54 },
  { category: "electrical", province: "Limpopo", city: "Polokwane", count: 63 },
  { category: "plumbing", province: "Limpopo", city: "Thohoyandou", count: 41 },
  { category: "mechanics", province: "Mpumalanga", city: "Mbombela", count: 37 },
  { category: "appliance-repair", province: "Mpumalanga", city: "Emalahleni", count: 26 },
  { category: "construction", province: "North West", city: "Rustenburg", count: 48 },
  { category: "tutoring", province: "North West", city: "Potchefstroom", count: 22 },
  { category: "cleaning", province: "Northern Cape", city: "Kimberley", count: 19 },
];

/** 6-month demo trend used for the dashboard charts. */
export const DEMO_TREND = [
  { month: "Apr", plumbing: 62, cleaning: 71, electrical: 40, transport: 28 },
  { month: "May", plumbing: 78, cleaning: 86, electrical: 47, transport: 31 },
  { month: "Jun", plumbing: 91, cleaning: 103, electrical: 55, transport: 36 },
  { month: "Jul", plumbing: 110, cleaning: 118, electrical: 61, transport: 42 },
  { month: "Aug", plumbing: 124, cleaning: 139, electrical: 70, transport: 51 },
  { month: "Sep", plumbing: 138, cleaning: 161, electrical: 79, transport: 58 },
];

export function randZar(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

/** Formats a South African mobile number as 0XX XXX XXXX where possible. */
export function formatSaPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("27") ? `0${digits.slice(2)}` : digits;
  if (local.length !== 10) return input.trim();
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

export function isValidSaPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("27") ? `0${digits.slice(2)}` : digits;
  return /^0[6-8][0-9]{8}$/.test(local);
}

export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
