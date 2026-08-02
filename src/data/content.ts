export type Property = {
  id: string;
  name: string;
  village: string;
  category: "Lots" | "Villas" | "Residences";
  status: "Available" | "Few Left" | "Pre-Selling";
  price: string;
  monthly: string;
  area: string;
  beds: string;
  elevation: string;
  image: string;
  highlights: string[];
  blurb: string;
};

export const properties: Property[] = [
  {
    id: "midlands-ridge",
    name: "Ridgecrest Estate Lots",
    village: "The Midlands · Woodridge",
    category: "Lots",
    status: "Few Left",
    price: "₱18.9M",
    monthly: "₱96,400 / mo",
    area: "420–780 sqm",
    beds: "Build-your-own",
    elevation: "2,300 ft ASL",
    image:
      "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "Ridge-facing prime lots with unobstructed Taal and Laguna de Bay panoramas. Freehold title, ready for immediate construction.",
    highlights: ["Unobstructed Taal view", "Underground utilities", "Clean title on turnover"],
  },
  {
    id: "greenridge-villas",
    name: "Greenridge Fairway Villas",
    village: "Highlands Golf · Fairway 7",
    category: "Villas",
    status: "Available",
    price: "₱42.5M",
    monthly: "₱214,800 / mo",
    area: "310 sqm floor",
    beds: "4 BR · 5 Bath",
    elevation: "2,150 ft ASL",
    image:
      "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "Turnkey architect-designed villas opening directly onto the fairway, with infinity edge pool and double-height glass living pavilion.",
    highlights: ["Fairway frontage", "Infinity pool", "Fully turnkey finish"],
  },
  {
    id: "cliffside-suites",
    name: "Cliffside Sky Residences",
    village: "The Peak Tower · Level 12–18",
    category: "Residences",
    status: "Pre-Selling",
    price: "₱12.4M",
    monthly: "₱62,100 / mo",
    area: "88–142 sqm",
    beds: "2–3 BR",
    elevation: "2,480 ft ASL",
    image:
      "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "Cloud-level residences with floor-to-ceiling glazing, hotel-grade concierge and direct lift access to the wellness deck.",
    highlights: ["24/7 concierge", "Private residential sanctuary", "0% interest for 60 months"],
  },
  {
    id: "pinecrest-lots",
    name: "Pinecrest Garden Lots",
    village: "The Midlands · Pinecrest",
    category: "Lots",
    status: "Available",
    price: "₱9.8M",
    monthly: "₱49,600 / mo",
    area: "300–460 sqm",
    beds: "Build-your-own",
    elevation: "2,050 ft ASL",
    image:
      "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "Nestled inside a mature pine belt — the coolest microclimate on the property, averaging 18°C at dawn.",
    highlights: ["Mature pine belt", "18°C average mornings", "Entry-level ticket size"],
  },
  {
    id: "belle-view",
    name: "Belle View Poolside Villas",
    village: "Highlands · Belle View Enclave",
    category: "Villas",
    status: "Few Left",
    price: "₱58.9M",
    monthly: "₱297,500 / mo",
    area: "445 sqm floor",
    beds: "5 BR · 6 Bath",
    elevation: "2,220 ft ASL",
    image:
      "https://images.pexels.com/photos/27626185/pexels-photo-27626185.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "The signature address of the estate — private motor court, staff quarters, cantilevered pool deck over the ravine.",
    highlights: ["Private motor court", "Cantilevered pool", "Only 6 units in enclave"],
  },
  {
    id: "atrium-flats",
    name: "The Atrium Loft Flats",
    village: "Highlands Village Center",
    category: "Residences",
    status: "Available",
    price: "₱7.6M",
    monthly: "₱38,200 / mo",
    area: "62–90 sqm",
    beds: "1–2 BR",
    elevation: "2,010 ft ASL",
    image:
      "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb:
      "Steps from the clubhouse, café row and sports complex — the most convenient lock-and-go family home in the estate.",
    highlights: ["Private family sanctuary", "Walk to clubhouse", "Fully furnished option"],
  },
];

export const stats = [
  { value: "38%", label: "Average land value growth, 2019–2025" },
  { value: "2,500 ft", label: "Peak elevation above sea level" },
  { value: "1,400+", label: "Families already at home on the ridge" },
  { value: "18°C", label: "Typical dawn temperature year-round" },
];

export const features = [
  {
    title: "Two championship golf courses",
    copy: "Play the highlands and midlands layouts carved into a volcanic ridge — a members-only privilege bundled with select estates.",
    icon: "flag",
  },
  {
    title: "Cloud-level microclimate",
    copy: "Sitting 2,000–2,500 ft above sea level, the estate stays 8–10°C cooler than Metro Manila all year. No aircon required.",
    icon: "cloud",
  },
  {
    title: "Guarded, gated, forever",
    copy: "Triple-layer perimeter security, 24/7 roving patrols and biometric village access. Deed-restricted to protect your view lines.",
    icon: "shield",
  },
  {
    title: "60 minutes from BGC",
    copy: "The CALAX and Sta. Rosa–Tagaytay corridor puts your weekend residence closer than most Manila suburbs on a Friday night.",
    icon: "route",
  },
  {
    title: "Resort amenities, everyday",
    copy: "Sports centre, spa, bowling, wellness pools, riding trails, fine dining, and a members' clubhouse maintained to hotel standard.",
    icon: "sparkle",
  },
  {
    title: "Titled, bankable assets",
    copy: "Every listing is clean-titled and bank-appraised. We coordinate financing with partner banks — including BDO, BPI, Metrobank and Security Bank — at preferential rates.",
    icon: "doc",
  },
];

export const benefits = [
  {
    kpi: "38%",
    title: "Appreciation you can underwrite",
    copy: "Highlands land values have compounded steadily for six straight years while supply inside the gates keeps shrinking. There is no new ridge being made.",
  },
  {
    kpi: "SM",
    title: "Prime masterplanning",
    copy: "Developed by Highlands Prime, Inc., an SM Prime Holdings subsidiary — the same stewardship behind the country's most resilient, well-run townships and malls.",
  },
  {
    kpi: "0%",
    title: "Interest for up to 60 months",
    copy: "Reserve today with a modest down payment and spread the balance interest-free — or take bank financing at our negotiated rate.",
  },
];

export const testimonials = [
  {
    quote:
      "Jewel walked us through four villages in a single afternoon and never once pushed. Two weeks later we signed on a Ridgecrest lot. Our home is now three years old and worth almost double.",
    name: "Marco & Liza Ventura",
    role: "Woodridge homeowners since 2022",
    initials: "MV",
  },
  {
    quote:
      "I buy for legacy, not for speculation. She walked me through the dues, the deed restrictions, the appreciation history and the exit comps. That level of transparency is rare in Philippine real estate.",
    name: "Dr. Aaron Sy",
    role: "Owner · 3 family units in the estate",
    initials: "AS",
  },
  {
    quote:
      "We were overseas the whole time. Documents, bank coordination, turnover inspection — all handled. We only flew in to get the keys and a bottle of wine on the counter.",
    name: "Katrina Delos Reyes",
    role: "OFW buyer, Dubai",
    initials: "KD",
  },
  {
    quote:
      "The reservation-to-title timeline was exactly what was promised. No surprise fees. My lawyer said it was the cleanest developer file he had reviewed all year.",
    name: "Atty. Ramon Feliciano",
    role: "Belle View Enclave",
    initials: "RF",
  },
];

export const tiers = [
  {
    name: "Reserve",
    tag: "Entry",
    price: "₱100,000",
    unit: "reservation fee",
    copy: "Lock your preferred unit or lot for 30 days while we prepare documents and financing options.",
    perks: [
      "30-day price & unit hold",
      "Full digital document pack",
      "Site tripping with Property Specialist Jewel",
      "Fully deductible from the down payment",
    ],
    cta: "Reserve a unit",
    featured: false,
  },
  {
    name: "Homeowner Plan",
    tag: "Most chosen",
    price: "15% DP",
    unit: "spread over 24 months",
    copy: "The balanced route for families building a weekend residence on the ridge.",
    perks: [
      "0% interest for up to 60 months",
      "Bank financing at negotiated rates",
      "Architect & contractor shortlist",
      "Complimentary 1-year club usage",
      "Priority pick of remaining view lots",
    ],
    cta: "Get the payment terms",
    featured: true,
  },
  {
    name: "Family Estate Track",
    tag: "Legacy focused",
    price: "Custom",
    unit: "portfolio structuring",
    copy: "For families securing multiple adjoining assets as a private generational estate.",
    perks: [
      "Multi-unit acquisition discounts",
      "Managed leasing & housekeeping",
      "Quarterly performance reporting",
      "Assignment-friendly contracts",
      "Dedicated portfolio manager",
    ],
    cta: "Talk to Jewel",
    featured: false,
  },
];

export const faqs = [
  {
    q: "Are foreigners allowed to buy inside Tagaytay Highlands?",
    a: "Foreign nationals cannot hold land in their own name, but they can own condominium residences outright (subject to the 40% building cap) or acquire land through a Philippine corporation or a Filipino spouse. We routinely structure both routes and will connect you with counsel before you commit a peso.",
  },
  {
    q: "What is actually included in the price I see?",
    a: "Listed prices reflect the current developer price for the unit or lot. Transfer taxes, registration, documentary stamps and the association's move-in fees are quoted separately and disclosed upfront in a written cost sheet — no surprises at signing.",
  },
  {
    q: "How long does it take from reservation to title?",
    a: "For ready units, expect 60–90 days from full down payment to Deed of Absolute Sale, and roughly 4–6 months for the transferred title depending on the Registry of Deeds. Pre-selling inventory follows the turnover schedule stated in your contract to sell.",
  },
  {
    q: "Do I need a club share to enjoy the amenities?",
    a: "Golf and select club facilities require a membership share. Several listings include a share or offer one at a preferential price, and we will always tell you exactly which category a listing falls under before you view it.",
  },
  {
    q: "Is Tagaytay Highlands open to short-stay or Airbnb-style rentals?",
    a: "No — and that's by design. Tagaytay Highlands is a strictly private, low-density residential sanctuary protected by deed restrictions, so your neighbors are fellow owners rather than transient guests. Homes are enjoyed as personal family retreats and generational assets, which is a big part of why values here stay resilient.",
  },
  {
    q: "What are the ongoing costs of ownership?",
    a: "Budget for annual real property tax, village association dues billed per square metre, and optional club dues. We will hand you a full annual carrying-cost estimate for any specific listing on request.",
  },
  {
    q: "How high is Tagaytay Highlands and how is the weather?",
    a: "The estate sits at roughly 2,000 feet above sea level and enjoys cool, misty weather all year round, averaging about 22°C daily. From the highest peak you get a 360-degree view of two lakes, a volcano, five mountains, and four cities — Taal Lake and Volcano, Mt. Makiling, the Canlubang Valley, and Laguna de Bay.",
  },
  {
    q: "What estate services and utilities are provided?",
    a: "Tagaytay Highlands is a fully managed estate with managed power supply, independent and unlimited water supply, Wi-Fi internet access, a complete road network, garbage collection, 24-hour security with manned entry gates, and even a helipad — so daily living is comfortable and worry-free.",
  },
  {
    q: "How big is Tagaytay Highlands and what makes it unique?",
    a: "It is the only mountain resort of its kind and scale in the country, spanning three provinces — Cavite, Laguna, and Batangas. Across its four districts (The Highlands, The Midlands, Midlands West, and The Greenlands) you'll find championship golf, Swiss cable cars and funicular, and a genuinely one-of-a-kind natural setting.",
  },
  {
    q: "How do I book a site tripping, and is it free?",
    a: "Yes, it's completely free and no-obligation. Just tap any 'Book Site Tripping' button, choose your date and car details, and Jewel will arrange your gate pass in advance. You'll meet at the Sales Marketing Office (SMO), then tour the estate comfortably in the Highlands van.",
  },
  {
    q: "How far is Tagaytay Highlands from Metro Manila?",
    a: "It's roughly a 60–90 minute drive from Makati/BGC via the CALAX and Sta. Rosa–Tagaytay corridor — closer than many Manila suburbs feel on a Friday evening, which makes it perfect for weekend family escapes.",
  },
];
