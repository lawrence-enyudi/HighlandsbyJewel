import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  buildSnapshot,
  LEADS_TABLE,
  OWNERSHIP_TIERS_TABLE,
  PROPERTIES_TABLE,
  REVIEWS_TABLE,
  SITE_SETTINGS_TABLE,
  PROJECTS_TABLE,
  mergeSnapshot,
  loadSharedSnapshot,
  saveSharedSnapshot,
  snapshotSize,
  type SyncSnapshot,
  type CloudConfig,
} from "@/utils/cloudSync";
import { supabase } from "@/lib/supabase";
import { normalizePaymentTerm } from "@/utils/paymentComputation";

function normalizeProject(project: ProjectFile): ProjectFile {
  return {
    ...project,
    inventory: project.inventory || [],
    paymentTerms: (project.paymentTerms || []).map((term) => normalizePaymentTerm(term)),
  };
}

export type PropertyCategory = "Lot" | "Condo" | "Townhouse";

export type PromoDiscount = {
  id: string;
  label: string; // e.g. "Launch Discount", "Spot Cash Special Promo"
  percentage: number; // e.g. 30, 10, 5
};

export type PropertyPromo = {
  enabled: boolean;
  title?: string;
  discounts: PromoDiscount[];
  endsAt: string;
  customDiscountedPrice?: string;
  badgeText?: string;
};

export type Property = {
  id: string;
  name: string;
  village: string;
  category: PropertyCategory;
  status: "Available" | "Few Left" | "Pre-Selling" | "Hot Deal";
  price: string;
  monthly: string;
  area: string;
  beds: string;
  baths?: string;
  floorArea?: string;
  lotArea?: string;
  parking?: string;
  furnishing?: string;
  elevation: string;
  image: string; // Primary cover image
  images?: string[]; // Multiple photos / angles
  highlights: string[];
  blurb: string;
  promo?: PropertyPromo;
};

export type SiteTrippingLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  guestCount: string;
  carModel: string;
  plateNumber?: string;
  useVanAtSMO: boolean;
  propertyInterest: "All" | "Lots" | "Condos" | "Townhouses";
  budgetRange: string;
  notes: string;
  status: "New" | "Contacted" | "Gate Pass Issued" | "Tripping Scheduled" | "Completed";
  createdAt: string;
};

export type SiteReview = {
  id: string;
  name: string;
  location?: string;
  rating: number; // 1-5
  quote: string;
  createdAt: string;
  approved: boolean; // Jewel can moderate from the portal
};

export type PaymentBalanceType =
  | "monthly"
  | "lumpsum"
  | "turnover"
  | "lumpsum_or_turnover";

export type PaymentTerm = {
  id: string;
  label: string;
  isPreset?: boolean;
  termDiscountPercent: number;
  extraDiscountPercent: number;
  otherChargesPercent: number;
  spotPercent: number;
  balanceType: PaymentBalanceType;
  balanceMonths: number;
  interestRate: number;
  reservationFee: number;
  notes: string;
  conditions?: string;
  /** @deprecated Legacy field — ignored; use runtime promo discount at computation */
  cashDiscountPercent?: number;
  /** @deprecated Legacy field — ignored; use runtime promo discount at computation */
  promoDiscountPercent?: number;
};

export type InventoryUnitStatus = "Available" | "Reserved" | "Hold" | "Sold" | "Not for Sale";

export type InventoryUnit = {
  id: string;
  kind: "lot" | "unit";
  block?: string;
  lot?: string;
  unitNumber?: string;
  area: string;
  status: InventoryUnitStatus;
  tcp: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFile = {
  id: string;
  name: string;
  district: string;
  category: "Lot" | "Condo" | "Townhouse";
  status: "Active" | "Sold Out" | "Pre-Selling" | "Archived";
  priceRange: string;
  lotSizes: string;
  mapImages: string[];
  priceListImages: string[];
  paymentTerms: PaymentTerm[];
  inventory: InventoryUnit[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type OwnershipTier = {
  id: string;
  name: string;
  tag: string;
  price: string;
  unit: string;
  copy: string;
  perks: string[];
  cta: string;
  featured: boolean;
  // What the tier button does: open the booking modal, message on WhatsApp,
  // or jump to the contact/inquiry form.
  action?: "spotCash" | "zeroComputation" | "bankComputation" | "tripping" | "whatsapp" | "inquire";
};

export type CommunityPhotos = {
  highlands: string;
  midlands: string;
  midlandsWest: string;
  greenlands: string;
};

export type SiteSettings = {
  // Live Page Editor overrides (key -> text value)
  contentOverrides?: Record<string, string>;
  // Live Page Editor overrides (image field key -> url/dataUrl)
  imageOverrides?: Record<string, string>;
  // Optional cloud backup config (sensitive — never synced to the cloud itself)
  cloudSync?: CloudConfig;

  // Specialist Profile
  specialistName: string;
  specialistNickname: string;
  specialistRole: string;
  specialistPhoto: string;
  specialistTagline: string;
  specialistBio: string;
  specialistStory: string;
  specialistQuote: string;
  phone: string;
  whatsapp: string;
  viber: string;
  email: string;
  locationAddress: string;

  // Hero Section
  heroBadge: string;
  heroHeadlinePrefix: string;
  heroHeadlineAccent: string;
  heroSubheadline: string;
  heroImage: string;
  heroCardImage: string;

  // 4 Communities Editable Cover Photos
  communityPhotos: CommunityPhotos;

  // Key Value Stats (Low Density & Exclusivity)
  stats: { value: string; label: string }[];

  // Editable Ownership Terms
  ownershipTiers: OwnershipTier[];

  // Site Tripping Promo Perks
  trippingPerks: { title: string; desc: string; iconName: string }[];
  trippingItinerary: { step: string; title: string; desc: string; duration: string }[];

  // Security / Admin
  adminPin: string;
};

// Helper for dynamic future promo dates
const getFutureDateString = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "primrose-parks",
    name: "Primrose Parks",
    village: "The Midlands Enclave",
    category: "Lot",
    status: "Few Left",
    price: "₱14.2M",
    monthly: "₱71,500 / mo",
    area: "500–900 sqm",
    lotArea: "520 sqm",
    beds: "Custom Build Lot",
    elevation: "1,350 ft ASL",
    image:
      "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Low-density 'modern summer' themed residential lot enclave in the heart of The Midlands, featuring an east-facing linear park with breathtaking sunrise views.",
    highlights: [
      "Modern summer architectural theme",
      "Lush central linear park and floral gardens",
      "Gentle rolling terrain facing the morning sun",
    ],
    promo: {
      enabled: true,
      title: "Midlands Summer Launch Special",
      discounts: [
        { id: "disc-1", label: "Special Launch Discount", percentage: 30 },
        { id: "disc-2", label: "Spot Cash / Early Reservation Promo", percentage: 10 },
      ],
      endsAt: getFutureDateString(6),
      badgeText: "30% + 10% PROMO (Save 40%)",
    },
  },
  {
    id: "highlands-residences",
    name: "Highlands Residences",
    village: "The Highlands Enclave",
    category: "Condo",
    status: "Pre-Selling",
    price: "₱12.8M",
    monthly: "₱64,500 / mo",
    area: "42–110 sqm",
    floorArea: "88 sqm",
    beds: "2 Bedrooms",
    baths: "2 Bathrooms",
    parking: "1 Dedicated Basement Slot",
    furnishing: "Turnkey Mountain Finish",
    elevation: "2,400 ft ASL",
    image:
      "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/8134754/pexels-photo-8134754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Low-density resort condominium nestled in the cool pine air of The Highlands — select units command sweeping views of Taal Lake, the volcano island, and Mt. Makiling on the horizon.",
    highlights: [
      "Select units with Taal Lake & Mt. Makiling views",
      "Exclusive central swimming pool & wellness deck",
      "Flexible 0% interest terms up to 60 months",
    ],
    promo: {
      enabled: true,
      title: "Pre-Selling VIP Launch Tier",
      discounts: [
        { id: "disc-hr-1", label: "Pre-Selling Launch Discount", percentage: 20 },
        { id: "disc-hr-2", label: "Buyers Appreciation Promo", percentage: 5 },
      ],
      endsAt: getFutureDateString(10),
      badgeText: "20% + 5% PROMO",
    },
  },
  {
    id: "horizon-terraces",
    name: "Horizon Terraces Garden Suites",
    village: "The Highlands · Horizon Enclave",
    category: "Condo",
    status: "Available",
    price: "₱10.5M",
    monthly: "₱52,800 / mo",
    area: "43–68 sqm",
    floorArea: "65 sqm",
    beds: "1 Bedroom Suite",
    baths: "1 Bathroom",
    parking: "1 Covered Slot",
    furnishing: "Asian Contemporary Fitted",
    elevation: "2,250 ft ASL",
    image:
      "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/9936218/pexels-photo-9936218.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Asian-contemporary condominiums overlooking the Midlands Golf Course and Taal Lake, surrounded by a central lush park with terraced infinity pools and walking paths.",
    highlights: [
      "Overlooks Midlands Golf Course & Taal Lake",
      "Central Terraces park with infinity pools",
      "Private vacation retreat for family weekends",
    ],
    promo: {
      enabled: true,
      title: "Ready For Turnover Flash Promo",
      discounts: [{ id: "disc-ht-1", label: "Special Move-In Discount", percentage: 15 }],
      endsAt: getFutureDateString(4),
      badgeText: "15% LIMITED PROMO",
    },
  },
  {
    id: "woodlands-point",
    name: "Woodlands Point Log Cabins",
    village: "The Highlands · Woodlands Enclave",
    category: "Townhouse",
    status: "Few Left",
    price: "₱48.5M",
    monthly: "₱245,000 / mo",
    area: "240–350 sqm",
    floorArea: "285 sqm",
    lotArea: "320 sqm",
    beds: "4 Bedrooms",
    baths: "4.5 Bathrooms",
    parking: "2 Car Covered Garage",
    furnishing: "Authentic Western Red Cedar Finish",
    elevation: "2,350 ft ASL",
    image:
      "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Charming ski resort-inspired log cabins crafted from genuine Canadian Western red cedar logs, featuring cozy fireplaces, expansive view decks facing Taal Lake, and towering pine surroundings.",
    highlights: [
      "Authentic Western red cedar log architecture",
      "View decks overlooking Taal Lake & volcano",
      "Ultra-exclusive gated enclave — only a handful of units",
    ],
  },
  {
    id: "provence-midlands",
    name: "Provence French Countryside Lots",
    village: "The Midlands Enclave",
    category: "Lot",
    status: "Available",
    price: "₱12.5M",
    monthly: "₱63,200 / mo",
    area: "400–750 sqm",
    lotArea: "450 sqm",
    beds: "Custom Build Lot",
    elevation: "1,250 ft ASL",
    image:
      "https://images.pexels.com/photos/37005512/pexels-photo-37005512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/37005512/pexels-photo-37005512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/28054864/pexels-photo-28054864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Inspired by the French countryside with gentle slopes, lavender gardens, and open views of Taal Lake and Mt. Makiling. Clean titled and ready for custom home building.",
    highlights: [
      "French Southern countryside aesthetic",
      "Views of Taal Lake and Mt. Makiling",
      "Underground utilities and wide avenues",
    ],
  },
  {
    id: "sycamore-heights",
    name: "Sycamore Heights",
    village: "The Midlands Enclave",
    category: "Lot",
    status: "Few Left",
    price: "₱16.8M",
    monthly: "₱85,400 / mo",
    area: "450–850 sqm",
    lotArea: "500 sqm",
    beds: "Custom Build Lot",
    elevation: "1,400 ft ASL",
    image:
      "https://images.pexels.com/photos/28054864/pexels-photo-28054864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/28054864/pexels-photo-28054864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "An Asian-contemporary themed hilltop lot community offering front-row vistas of Taal Lake and Volcano, surrounded by tranquil bamboo gardens and infinity view lounges.",
    highlights: [
      "Direct unobstructed Taal Lake & Volcano view",
      "Asian contemporary clubhouse and infinity lounge",
      "Prime elevated position in The Midlands",
    ],
  },
  {
    id: "trealva-midlands-west",
    name: "Trealva at Midlands West",
    village: "Midlands West District",
    category: "Lot",
    status: "Available",
    price: "₱13.5M",
    monthly: "₱68,000 / mo",
    area: "380–700 sqm",
    lotArea: "420 sqm",
    beds: "Custom Build Lot",
    elevation: "1,300 ft ASL",
    image:
      "https://images.pexels.com/photos/14023023/pexels-photo-14023023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/14023023/pexels-photo-14023023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/27169937/pexels-photo-27169937.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/6872257/pexels-photo-6872257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "The pioneer horizontal lot project in Tagaytay Highlands' newest 320-hectare eco-resort district. Rooted in sustainability, wellness parks, and modern mountain architecture.",
    highlights: [
      "Pioneer community in the newest Midlands West district",
      "Ecocentric modern mountain masterplan",
      "Dedicated wellness trails and sensory botanical gardens",
    ],
  },
  {
    id: "plantation-hills",
    name: "Plantation Hills Eco-Farming Lots",
    village: "The Greenlands Enclave",
    category: "Lot",
    status: "Available",
    price: "₱11.5M",
    monthly: "₱58,000 / mo",
    area: "500–1,000 sqm",
    lotArea: "650 sqm",
    beds: "Custom Farm-Home Lot",
    elevation: "850 ft ASL",
    image:
      "https://images.pexels.com/photos/2887131/pexels-photo-2887131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/2887131/pexels-photo-2887131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/213840/pexels-photo-213840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "An eco-farming residential lot community where families can grow organic herbs, vegetables, and fruit trees in their spacious mountain backyard amidst fresh breezes.",
    highlights: [
      "Spacious farm-residential lots (up to 1,000 sqm)",
      "Organic home farming & gardening lifestyle",
      "Tight-knit holistic family community in The Greenlands",
    ],
  },
  {
    id: "sierra-lago",
    name: "Sierra Lago Mediterranean Lots",
    village: "The Greenlands Enclave",
    category: "Lot",
    status: "Available",
    price: "₱9.2M",
    monthly: "₱46,500 / mo",
    area: "300–550 sqm",
    lotArea: "350 sqm",
    beds: "Custom Build Lot",
    elevation: "780 ft ASL",
    image:
      "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    images: [
      "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
      "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    ],
    blurb:
      "Modern Mediterranean-themed residential enclave nestled along rolling terrain, offering panoramic views of Mt. Makiling, Laguna de Bay, and highlands golf courses.",
    highlights: [
      "Modern Mediterranean aesthetic",
      "Breathtaking Mt. Makiling panoramas",
      "Best entry price point in Tagaytay Highlands",
    ],
  },
];

export const INITIAL_OWNERSHIP_TIERS: OwnershipTier[] = [
  {
    id: "tier-spot-cash",
    name: "Spot Cash Option",
    tag: "Maximum Savings",
    price: "Up to 30% Off",
    unit: "discount on total contract price",
    copy: "The highest savings tier for buyers paying in cash within 30 to 60 days of reservation.",
    perks: [
      "Maximum developer cash discount (up to 30% + promo)",
      "Expedited title processing & Deed of Sale",
      "Immediate club membership share assignment",
      "Priority choice of prime view lots & corner units",
    ],
    cta: "Inquire Spot Cash Terms",
    featured: false,
    action: "spotCash",
  },
  {
    id: "tier-deferred-dp",
    name: "Deferred 0% Interest",
    tag: "Most Popular",
    price: "0% Interest",
    unit: "spread up to 60 months",
    copy: "The balanced route for families building a weekend sanctuary — 0% interest with zero bank hassle.",
    perks: [
      "0% interest payable for up to 60 months",
      "No bank loan qualification required",
      "Low initial reservation fee deductible from DP",
      "Architectural planning assistance during payment term",
      "Direct developer contracts and transparent schedules",
    ],
    cta: "Get 0% Interest Computation",
    featured: true,
    action: "zeroComputation",
  },
  {
    id: "tier-bank-financing",
    name: "Bank Financing Option",
    tag: "Lowest Monthly",
    price: "10% – 20% DP",
    unit: "balance via accredited bank",
    copy: "Spread the remaining balance with our top accredited banking partners at preferential rates.",
    perks: [
      "Low down payment stretched over 24 to 36 months",
      "Accredited with BPI, Metrobank, Security Bank, BDO",
      "Hassle-free loan assistance handled by Jewel",
      "Long term loan tenors up to 15 to 20 years",
      "Fast bank appraisal & clearance",
    ],
    cta: "Request Bank Computation",
    featured: false,
    action: "bankComputation",
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  contentOverrides: {},
  imageOverrides: {},

  specialistName: "Jewel Villafranca",
  specialistNickname: "Jewel",
  specialistRole: "Accredited Property Specialist · Tagaytay Highlands",
  specialistPhoto:
    "/images/Jewel%20Profile.png",
  specialistTagline: "Your Dedicated Property Specialist in Tagaytay Highlands",
  specialistBio:
    "Hi, I'm Jewel! As an accredited property specialist at Tagaytay Highlands — one of the most exclusive private estates in the Philippines — my priority is giving you a transparent, pressure-free look into our available lots, condos, and townhouses across The Highlands, The Midlands, Midlands West, and The Greenlands. I arrange your exclusive gate pass, welcome you at the Sales Marketing Office (SMO), and take you on a relaxing Highlands van tour with direct developer computations.",
  specialistStory:
    "Tagaytay Highlands is a strictly private, membership-caliber community with capped supply and deed restrictions that protect your views and privacy. From securing your exclusive vehicle gate pass to meeting you at our Sales Marketing Office (SMO) for a comfortable van tour, I make sure you get developer-direct prices, special promo discounts, and 0% interest terms without any rush.",
  specialistQuote:
    "Owning in Tagaytay Highlands isn't just about real estate — it's about giving your family a cool, private mountain sanctuary they will cherish for generations.",
  phone: "+63 975 054 1424",
  whatsapp: "+639750541424",
  viber: "+63 975 054 1424",
  email: "jewelvillafranca@gmail.com",
  locationAddress: "4120 Brgy. Calabuso, Tagaytay City, Cavite, Philippines",

  heroBadge: "Exclusive Q1 2026 Inventory · Limited-Time Promos Live",
  heroHeadlinePrefix: "Luxury mountain living in",
  heroHeadlineAccent: "Tagaytay Highlands.",
  heroSubheadline:
    "Tagaytay Highlands is the premier mountain resort sanctuary of the SM Group. Explore available lots, condominiums, and townhouses across The Highlands, The Midlands, Midlands West, and The Greenlands with Jewel.",
  heroImage:
    "https://images.pexels.com/photos/19739231/pexels-photo-19739231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200",
  heroCardImage:
    "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",

  communityPhotos: {
    highlands:
      "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    midlands:
      "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    midlandsWest:
      "https://images.pexels.com/photos/6872247/pexels-photo-6872247.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    greenlands:
      "https://images.pexels.com/photos/213840/pexels-photo-213840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },

  stats: [
    { value: "2,000 ft", label: "Elevation above sea level" },
    { value: "22°C", label: "Cool average temperature year-round" },
    { value: "360°", label: "Views: 2 lakes, a volcano & 5 mountains" },
    { value: "3", label: "Provinces spanned — a one-of-a-kind scale" },
  ],

  ownershipTiers: INITIAL_OWNERSHIP_TIERS,

  trippingPerks: [
    {
      title: "Exclusive Gate Pass",
      desc: "Your pre-authorized gate pass is arranged in advance so your vehicle glides straight into the private estate.",
      iconName: "KeyRound",
    },
    {
      title: "Meet at SMO & Van Site Tripping",
      desc: "Meet Jewel at the Sales Marketing Office (SMO) and tour the communities in our comfortable Highlands van so you don't need to drive inside.",
      iconName: "Bus",
    },
    {
      title: "Country Club Refreshments",
      desc: "Enjoy mountain coffee or snacks at the Tagaytay Highlands Country Club overlooking Taal.",
      iconName: "Coffee",
    },
    {
      title: "Developer Direct Computations",
      desc: "Zero markups, 0% interest schemes up to 60 months, and stackable promo calculations on the spot.",
      iconName: "Calculator",
    },
  ],

  trippingItinerary: [
    {
      step: "01",
      title: "Gate Pass Clearance & Arrival at SMO",
      desc: "Enter smoothly through the private gate with your registered vehicle pass and proceed to the Sales Marketing Office (SMO) to meet Jewel.",
      duration: "15 mins",
    },
    {
      step: "02",
      title: "Highlands Van Site Tripping",
      desc: "Hop into our comfortable Highlands van service at the SMO so you can sit back, relax, and take in the cool mountain breeze and 2,500 ft Taal panoramas.",
      duration: "30 mins",
    },
    {
      step: "03",
      title: "Lots, Condos & Townhouses Inspection",
      desc: "Inspect available view lots, mountain condominium suites, and fairway townhomes across The Highlands, The Midlands, Midlands West, and The Greenlands.",
      duration: "45 mins",
    },
    {
      step: "04",
      title: "Clubhouse Refreshments & Developer Computations",
      desc: "Relax at the Highlands Country Club with refreshments while reviewing exact unit availability and limited-time promo terms.",
      duration: "30 mins",
    },
  ],

  adminPin: "jewel2026",
};

export const INITIAL_LEADS: SiteTrippingLead[] = [
  {
    id: "lead-1",
    name: "Dr. Roberto Mendoza",
    phone: "+63 918 555 1289",
    email: "roberto.mendoza.md@gmail.com",
    preferredDate: "2026-03-28",
    preferredTime: "10:00 AM (Morning Mountain Tour)",
    guestCount: "4 persons (Family)",
    carModel: "Toyota Land Cruiser Prado",
    plateNumber: "NBD 8821",
    useVanAtSMO: true,
    propertyInterest: "Lots",
    budgetRange: "₱20M – ₱45M",
    notes: "Inquiring about Primrose Parks 30% + 10% limited promo. Looking for a breezy view lot in The Midlands.",
    status: "Gate Pass Issued",
    createdAt: "2026-03-15 09:30 AM",
  },
  {
    id: "lead-2",
    name: "Atty. Clarissa Tan",
    phone: "+63 917 889 4432",
    email: "clarissa.tan.law@yahoo.com",
    preferredDate: "2026-04-04",
    preferredTime: "02:00 PM (Afternoon Sunset Tour)",
    guestCount: "2 persons",
    carModel: "Honda CR-V",
    plateNumber: "Conduction # 1204",
    useVanAtSMO: true,
    propertyInterest: "Condos",
    budgetRange: "₱10M – ₱15M",
    notes: "Interested in Highlands Residences 20% + 5% launch discount and 0% interest 60 months terms.",
    status: "Contacted",
    createdAt: "2026-03-18 02:15 PM",
  },
];

export const INITIAL_REVIEWS: SiteReview[] = [
  {
    id: "rev-1",
    name: "Marco & Liza Ventura",
    location: "Family from Alabang",
    rating: 5,
    quote:
      "Our site tripping was seamless from start to finish. Jewel arranged our gate pass ahead of time and toured us in the Highlands van — the cool 22°C air and the Taal Lake view sold us on the spot.",
    createdAt: "2026-02-14 10:20 AM",
    approved: true,
  },
  {
    id: "rev-2",
    name: "Dr. Aaron Sy",
    location: "Makati",
    rating: 5,
    quote:
      "No pressure at all. She walked us through the developer computations, the dues, and the deed restrictions honestly. The 360-degree view from the peak is genuinely unreal.",
    createdAt: "2026-02-28 03:05 PM",
    approved: true,
  },
  {
    id: "rev-3",
    name: "Katrina Delos Reyes",
    location: "OFW, Dubai",
    rating: 5,
    quote:
      "I booked the tripping for my parents while I was abroad. Jewel took care of everything — gate pass, van, even coffee at the clubhouse. My family had a wonderful, relaxed afternoon.",
    createdAt: "2026-03-10 01:40 PM",
    approved: true,
  },
  {
    id: "rev-4",
    name: "Engr. Gabriel Santos",
    location: "Quezon City",
    rating: 5,
    quote:
      "The misty weather and pine-scented air during our tour were incredible. Jewel is knowledgeable and never rushed us. We're now seriously considering a lot in The Midlands.",
    createdAt: "2026-03-22 11:15 AM",
    approved: true,
  },
];

export type AdminRole = "seller" | "editor" | null;

type SiteContextType = {
  properties: Property[];
  settings: SiteSettings;
  leads: SiteTrippingLead[];
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  adminRole: AdminRole;
  openAdmin: () => void;
  closeAdmin: () => void;
  loginAdmin: (pin: string) => AdminRole;
  logoutAdmin: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addProperty: (property: Omit<Property, "id"> & { id?: string }) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addLead: (leadData: Omit<SiteTrippingLead, "id" | "createdAt" | "status">) => void;
  updateLeadStatus: (id: string, status: SiteTrippingLead["status"]) => void;
  deleteLead: (id: string) => void;
  reviews: SiteReview[];
  addReview: (r: Omit<SiteReview, "id" | "createdAt" | "approved">) => void;
  deleteReview: (id: string) => void;
  toggleReviewApproval: (id: string) => void;
  projectFiles: ProjectFile[];
  addProjectFile: (p: Omit<ProjectFile, "id" | "createdAt" | "updatedAt">) => void;
  updateProjectFile: (id: string, p: Partial<ProjectFile>) => void;
  deleteProjectFile: (id: string) => void;
  resetAllToDefault: () => void;
  openSiteTrippingModal: (prefillCategory?: "All" | "Lots" | "Condos" | "Townhouses" | string) => void;
  closeSiteTrippingModal: () => void;
  isSiteTrippingModalOpen: boolean;
  selectedTrippingProperty: string;
  // Cloud backup & restore
  cloudConfig: CloudConfig;
  updateCloudConfig: (c: Partial<CloudConfig>) => void;
  syncNow: (snapshot?: SyncSnapshot) => Promise<{ ok: boolean; message: string }>;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<{ ok: boolean; message: string }>;
  lastSyncedAt: string | null;
  syncState: "idle" | "syncing" | "error";
};

const SiteContext = createContext<SiteContextType | null>(null);

const STORAGE_KEYS = {
  AUTH: "tagaytay_highlands_jewel_auth",
  PROJECTS: "tagaytay_highlands_jewel_projects",
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  const [leads, setLeads] = useState<SiteTrippingLead[]>(INITIAL_LEADS);

  const [reviews, setReviews] = useState<SiteReview[]>(INITIAL_REVIEWS);

  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const parsed: ProjectFile[] = saved ? JSON.parse(saved) : [];
      return parsed.map(normalizeProject);
    } catch {
      return [];
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === "seller" || saved === "editor" ? saved : null;
  });
  const isAuthenticated = adminRole !== null;

  const [isSiteTrippingModalOpen, setIsSiteTrippingModalOpen] = useState(false);
  const [selectedTrippingProperty, setSelectedTrippingProperty] = useState("");

  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    enabled: false,
    apiKey: "",
    binId: "",
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "error">("idle");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectFiles));
  }, [projectFiles]);

  const pushTimer = useRef<number | null>(null);
  const hydratingRef = useRef(false);
  const lastRemoteUpdatedAtRef = useRef<string | null>(null);
  const syncInFlightRef = useRef<Promise<{ ok: boolean; message: string }> | null>(null);
  const queuedSnapshotRef = useRef<SyncSnapshot | null>(null);

  const applyRemoteSnapshot = (snapshot: Awaited<ReturnType<typeof loadSharedSnapshot>>) => {
    if (!snapshot) return;
    hydratingRef.current = true;
    setProperties(snapshot.properties || INITIAL_PROPERTIES);
    setLeads(snapshot.leads || INITIAL_LEADS);
    setReviews(snapshot.reviews || INITIAL_REVIEWS);
    setProjectFiles((snapshot.projects || []).map(normalizeProject));
    setSettings((prev) => ({ ...prev, ...mergeSnapshot(snapshot, prev) }));
    lastRemoteUpdatedAtRef.current = snapshot.updatedAt;
    setLastSyncedAt(snapshot.updatedAt);
    window.setTimeout(() => {
      hydratingRef.current = false;
    }, 800);
  };

  const pushSharedState = async (
    snapshot = buildSnapshot(properties, settings, leads, reviews, projectFiles),
  ): Promise<{ ok: boolean; message: string }> => {
    if (hydratingRef.current) {
      return { ok: false, message: "Hydrating shared state, try again in a moment." };
    }
    if (syncInFlightRef.current) {
      queuedSnapshotRef.current = snapshot;
      return syncInFlightRef.current;
    }
    setSyncState("syncing");
    const syncPromise = (async () => {
      try {
      if (snapshotSize(snapshot) > 4_500_000) {
        const message =
          "Shared state is too large to store comfortably in Supabase. Reduce embedded image data or move uploads to Supabase Storage.";
        setSyncState("error");
        return { ok: false, message };
      }
      await saveSharedSnapshot(snapshot);
      lastRemoteUpdatedAtRef.current = snapshot.updatedAt;
      setLastSyncedAt(snapshot.updatedAt);
      setSyncState("idle");
      return { ok: true, message: "Synced to Supabase successfully." };
      } catch {
        setSyncState("error");
        return {
          ok: false,
          message: "Supabase sync failed. Check your table name, row policies, and env vars.",
        };
      } finally {
        syncInFlightRef.current = null;
      }
    })();

    syncInFlightRef.current = syncPromise;
    const result = await syncPromise;

    const queuedSnapshot = queuedSnapshotRef.current;
    queuedSnapshotRef.current = null;
    if (queuedSnapshot) {
      void pushSharedState(queuedSnapshot);
    }

    return result;
  };

  const syncNow = async (snapshot?: SyncSnapshot): Promise<{ ok: boolean; message: string }> => {
    return pushSharedState(snapshot);
  };

  // Auto-push to Supabase (debounced) whenever content changes.
  useEffect(() => {
    if (hydratingRef.current) return;
    if (pushTimer.current) window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(() => {
      void pushSharedState();
    }, 1200);
    return () => {
      if (pushTimer.current) window.clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, settings, leads, reviews, projectFiles]);

  // On mount: hydrate from the shared Supabase row, then keep refreshing for newer edits.
  useEffect(() => {
    hydratingRef.current = true;
    let cancelled = false;
    const refreshRemoteState = async () => {
      if (hydratingRef.current) return;
      try {
        const snapshot = await loadSharedSnapshot();
        if (snapshot && snapshot.updatedAt !== lastRemoteUpdatedAtRef.current) {
          applyRemoteSnapshot(snapshot);
        }
      } catch {
        // ignore refresh failures; local edits still persist
      }
    };

    void (async () => {
      try {
        const snapshot = await loadSharedSnapshot();
        if (snapshot && !cancelled) {
          applyRemoteSnapshot(snapshot);
        } else {
          window.setTimeout(() => {
            if (!cancelled) {
              hydratingRef.current = false;
            }
          }, 600);
        }
      } catch {
        window.setTimeout(() => {
          if (!cancelled) {
            hydratingRef.current = false;
            setSyncState("error");
          }
        }, 600);
      } finally {
        // keep the flag until the hydration window closes
      }
    })();

    const remoteChannel = supabase
      .channel("site-shared-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: SITE_SETTINGS_TABLE }, () => {
        void refreshRemoteState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: PROPERTIES_TABLE }, () => {
        void refreshRemoteState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: LEADS_TABLE }, () => {
        void refreshRemoteState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: REVIEWS_TABLE }, () => {
        void refreshRemoteState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: OWNERSHIP_TIERS_TABLE }, () => {
        void refreshRemoteState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: PROJECTS_TABLE }, () => {
        void refreshRemoteState();
      })
      .subscribe();

    const pollTimer = window.setInterval(() => {
      void refreshRemoteState();
    }, 10000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      cancelled = true;
      window.clearInterval(pollTimer);
      void supabase.removeChannel(remoteChannel);
    };
  }, []);

  // Secret URL Hash & Keyboard shortcut listener for Seller's Portal
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash === "#portal" || hash === "#seller" || hash === "#jewel") {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    const onKeyDown = (e: KeyboardEvent) => {
      // Alt + A (or Ctrl + Shift + A / Cmd + Shift + A)
      if (
        (e.altKey && e.key.toLowerCase() === "a") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a")
      ) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.match(/^#(admin|portal|seller|jewel)$/i)) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const loginAdmin = (pin: string): AdminRole => {
    const trimmed = pin.trim().toLowerCase();
    // Page Editor mode (click-to-edit the whole landing page)
    if (trimmed === "jewel1623") {
      setAdminRole("editor");
      sessionStorage.setItem(STORAGE_KEYS.AUTH, "editor");
      return "editor";
    }
    // Seller's Portal / admin dashboard mode
    if (trimmed === settings.adminPin.trim().toLowerCase() || trimmed === "jewel2026" || trimmed === "highlands") {
      setAdminRole("seller");
      sessionStorage.setItem(STORAGE_KEYS.AUTH, "seller");
      return "seller";
    }
    return null;
  };

  const logoutAdmin = () => {
    setAdminRole(null);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addProperty = (newProp: Omit<Property, "id"> & { id?: string }) => {
    const id = newProp.id || `prop-${Date.now()}`;
    const images = newProp.images && newProp.images.length > 0 ? newProp.images : [newProp.image];
    setProperties((prev) => [{ ...newProp, id, images }, ...prev]);
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const images = updated.images && updated.images.length > 0
          ? updated.images
          : updated.image
            ? [updated.image]
            : p.images;
        return { ...p, ...updated, images };
      }),
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const addLead = (leadData: Omit<SiteTrippingLead, "id" | "createdAt" | "status">) => {
    const newLead: SiteTrippingLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: "New",
      createdAt: new Date().toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: SiteTrippingLead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l)),
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const addReview = (r: Omit<SiteReview, "id" | "createdAt" | "approved">) => {
    const newReview: SiteReview = {
      ...r,
      id: `rev-${Date.now()}`,
      approved: true, // auto-published; Jewel can hide it later from the portal
      createdAt: new Date().toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)),
    );
  };

  const addProjectFile = (p: Omit<ProjectFile, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const full: ProjectFile = { ...p, id: `proj-${Date.now()}`, createdAt: now, updatedAt: now };
    setProjectFiles((prev) => [full, ...prev]);
  };

  const updateProjectFile = (id: string, updated: Partial<ProjectFile>) => {
    setProjectFiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p,
      ),
    );
  };

  const deleteProjectFile = (id: string) => {
    setProjectFiles((prev) => prev.filter((p) => p.id !== id));
  };

  const resetAllToDefault = () => {
    setProperties(INITIAL_PROPERTIES);
    setSettings(INITIAL_SETTINGS);
    setLeads(INITIAL_LEADS);
    setReviews(INITIAL_REVIEWS);
    setProjectFiles([]);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  };

  const openSiteTrippingModal = (prefillCategory?: string) => {
    setSelectedTrippingProperty(prefillCategory || "");
    setIsSiteTrippingModalOpen(true);
  };

  const closeSiteTrippingModal = () => {
    setIsSiteTrippingModalOpen(false);
  };

  const updateCloudConfig = (c: Partial<CloudConfig>) => {
    setCloudConfig((prev) => ({ ...prev, ...c }));
  };

  const exportBackup = () => {
    const backup = {
      app: "tagaytay-highlands-by-jewel",
      version: 1,
      exportedAt: new Date().toISOString(),
      properties,
      settings,
      leads,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tagaytay-highlands-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file: File): Promise<{ ok: boolean; message: string }> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || (data.app && data.app !== "tagaytay-highlands-by-jewel")) {
        return { ok: false, message: "Not a valid Tagaytay Highlands backup file." };
      }
      if (Array.isArray(data.properties)) setProperties(data.properties);
      if (Array.isArray(data.leads)) setLeads(data.leads);
      if (data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
          contentOverrides: data.settings.contentOverrides || prev.contentOverrides || {},
          imageOverrides: data.settings.imageOverrides || prev.imageOverrides || {},
          cloudSync: prev.cloudSync,
        }));
      }
      void syncNow();
      return { ok: true, message: "Backup restored successfully. All edits are live on this device." };
    } catch {
      return { ok: false, message: "Could not read the backup file. Please try again." };
    }
  };

  return (
    <SiteContext.Provider
      value={{
        properties,
        settings,
        leads,
        isAdminOpen,
        isAuthenticated,
        adminRole,
        openAdmin,
        closeAdmin,
        loginAdmin,
        logoutAdmin,
        updateSettings,
        addProperty,
        updateProperty,
        deleteProperty,
        addLead,
        updateLeadStatus,
        deleteLead,
        reviews,
        addReview,
        deleteReview,
        toggleReviewApproval,
        projectFiles,
        addProjectFile,
        updateProjectFile,
        deleteProjectFile,
        resetAllToDefault,
        openSiteTrippingModal,
        closeSiteTrippingModal,
        isSiteTrippingModalOpen,
        selectedTrippingProperty,
        cloudConfig,
        updateCloudConfig,
        syncNow,
        exportBackup,
        importBackup,
        lastSyncedAt,
        syncState,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
