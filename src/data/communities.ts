export type DistrictInfo = {
  id: "highlands" | "midlands" | "midlands-west" | "greenlands";
  name: string;
  tagline: string;
  elevation: string;
  landArea: string;
  description: string;
  theme: string;
  coverImage: string;
  developedCommunities: string[];
  projects: {
    name: string;
    type: "Lot" | "Condo" | "Townhouse";
    priceRange: string;
    sizes: string;
    description: string;
    images: string[];
    highlights: string[];
  }[];
  featuredAmenities: string[];
};

export const DISTRICTS_DATA: DistrictInfo[] = [
  {
    id: "highlands",
    name: "The Highlands",
    tagline: "The Mountaintop Sanctuary & High-Altitude Haven",
    elevation: "approx. 2000 - 2500 ft above sea level",
    landArea: "approx. 360 hectares",
    theme: "Alpine Ski Resort-Inspired Mountain Retreat & Low-Density Living",
    coverImage:
      "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    description:
      "Perched at the highest elevation of Tagaytay Highlands, The Highlands offers cool pine breezes, sweeping 360-degree views of Taal Lake, and the historic Tagaytay Highlands Golf Club with its Swiss cable car system.",
    developedCommunities: [
      "The Belle View",
      "The Hillside",
      "Pinecrest Village",
      "Aspenhills",
      "The Woodlands",
      "The Woodlands Point",
      "The Woodridge",
      "The Woodridge Place",
      "The Villas",
      "The Pines",
    ],
    featuredAmenities: [
      "Tagaytay Highlands Golf Club (18-hole par-70)",
      "Swiss Cable Car System",
      "The Country Club & Country Club Pool",
      "The Spa & Lodge",
      "Highlands China Palace & The Highlander Steakhouse",
      "Holy Family Chapel & Peak Bar",
    ],
    projects: [
      {
        name: "Highlands Residences",
        type: "Condo",
        priceRange: "₱12.8M – ₱24.5M",
        sizes: "1-Bedroom (42–55 sqm) · 2-Bedroom (84–110 sqm)",
        description:
          "A low-density mountain condominium development designed around central open-air leisure courtyards, swimming pools, and private nature trails in the cool Highlands enclave.",
        images: [
          "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/8134754/pexels-photo-8134754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Low-density resort condominium in The Highlands",
          "Exclusive central swimming pool & wellness deck",
          "Surrounded by mature pine trees & crisp 18°C dawn air",
        ],
      },
      {
        name: "Horizon Terraces",
        type: "Condo",
        priceRange: "₱10.5M – ₱19.8M",
        sizes: "Garden Suites (43–68 sqm) · Garden Villas Townhomes (136–168 sqm)",
        description:
          "An integrated Asian-contemporary residential community featuring Garden Suites condominiums and Garden Villas townhomes surrounding the central Terraces park.",
        images: [
          "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/9936218/pexels-photo-9936218.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Overlooks Midlands Golf Course & Taal Lake",
          "Central Terraces park with infinity pools",
          "Private vacation retreat for family weekends",
        ],
      },
      {
        name: "Woodlands Point",
        type: "Townhouse",
        priceRange: "₱38.5M – ₱65.0M",
        sizes: "3 to 4 Bedrooms (240–350 sqm floor)",
        description:
          "Charming contemporary ski resort-inspired log cabins crafted from genuine Western red cedar logs, set against lush pine groves with sweeping mountain and golf views.",
        images: [
          "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Authentic North American cedar log homes",
          "Fireplaces & expansive mountain sundecks",
          "Exclusive gated enclave within The Highlands",
        ],
      },
      {
        name: "The Woodridge Place",
        type: "Condo",
        priceRange: "₱9.8M – ₱18.2M",
        sizes: "1 to 3 Bedrooms (55–125 sqm)",
        description:
          "Colorado mountain resort-inspired mid-rise condominiums offering cozy mountain living with balconies facing rolling hills and cool mountain breezes.",
        images: [
          "https://images.pexels.com/photos/27604139/pexels-photo-27604139.png?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/8134754/pexels-photo-8134754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Colorado-inspired architectural design",
          "Proximity to Highlands Golf Clubhouse",
          "Lush landscaped mountain gardens",
        ],
      },
    ],
  },
  {
    id: "midlands",
    name: "The Midlands",
    tagline: "International Themed Enclaves & Lakeside Sanctuary",
    elevation: "approx. 1000 – 1500 ft above sea level",
    landArea: "approx. 671 hectares",
    theme: "Globally-Themed Communities (French, Japanese, Mediterranean, English)",
    coverImage:
      "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    description:
      "A sprawling bird sanctuary and internationally-themed haven facing picturesque Taal Lake and Mt. Makiling. Home to the championship Tagaytay Midlands Golf Club and the 48-seater Swiss Funicular train.",
    developedCommunities: [
      "Alta Mira",
      "Cotswold",
      "The Horizon",
      "Katsura",
      "Kew Gardens",
      "Lakeside Enclave",
      "Lakeview Heights",
      "Pueblo Real",
      "Terrazzas de Alava",
      "Tivoli Place",
      "Yume",
      "Sycamore Heights",
      "Provence",
      "Vireya",
    ],
    featuredAmenities: [
      "The Midlands Golf Club (18-hole par-72 & Midlands Lucky 9)",
      "48-Seater Swiss Funicular Train System",
      "Midlands Golfers Lounge & Concha's Garden Café",
      "Madre De Dios Chapel",
      "Expansive Bird Sanctuary & Nature Reserves",
    ],
    projects: [
      {
        name: "Primrose Parks",
        type: "Lot",
        priceRange: "₱14.2M – ₱26.5M",
        sizes: "500 – 900 sqm prime lots",
        description:
          "A low-density, modern summer-themed residential lot enclave in the heart of The Midlands featuring an east-facing linear park with breathtaking sunrise views.",
        images: [
          "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Modern summer architecture theme",
          "Central linear park with lush floral gardens",
          "Panoramic sunrise & golf course vistas",
        ],
      },
      {
        name: "Provence",
        type: "Lot",
        priceRange: "₱12.5M – ₱22.0M",
        sizes: "400 – 750 sqm lots",
        description:
          "Inspired by the charm of the French countryside, Provence features gentle slopes, lavender floral landscapes, and unobstructed views of Taal Lake and Mt. Makiling.",
        images: [
          "https://images.pexels.com/photos/37005512/pexels-photo-37005512.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/28054864/pexels-photo-28054864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "French Southern countryside aesthetic",
          "Views of Taal Lake and Mt. Makiling",
          "Underground utilities & wide tree-lined avenues",
        ],
      },
      {
        name: "Sycamore Heights",
        type: "Lot",
        priceRange: "₱15.0M – ₱28.0M",
        sizes: "450 – 850 sqm lots",
        description:
          "An Asian-contemporary themed hilltop lot community offering front-row vistas of Taal Lake and Volcano, surrounded by tranquil bamboo gardens and infinity lounge pavilions.",
        images: [
          "https://images.pexels.com/photos/28054864/pexels-photo-28054864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Unobstructed Taal Lake & Volcano view",
          "Asian contemporary aesthetic",
          "Central clubhouse with infinity view lounge",
        ],
      },
      {
        name: "Vireya",
        type: "Lot",
        priceRange: "₱11.8M – ₱19.5M",
        sizes: "350 – 600 sqm lots",
        description:
          "A tropical resort-inspired horizontal community situated on The Midlands' elevated vantage point, seamlessly blending Balinese warmth with crisp mountain air.",
        images: [
          "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/27626185/pexels-photo-27626185.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Tropical mountain resort theme",
          "Pavilion park & jogging paths",
          "Cool mountain cross-breeze",
        ],
      },
    ],
  },
  {
    id: "midlands-west",
    name: "Midlands West",
    tagline: "The Future of Luxury Eco-Resort Mountain Living",
    elevation: "approx. 1000 – 1500 ft above sea level",
    landArea: "approx. 671 hectares",
    theme: "Ecocentrism, Sustainability, Health & Wellness",
    coverImage:
      "https://images.pexels.com/photos/6872247/pexels-photo-6872247.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    description:
      "The newest master-planned district of Tagaytay Highlands. Midlands West is envisioned as a luxury eco-resort mountain sanctuary built on sustainability, wellness trails, botanical parks, and holistic living.",
    developedCommunities: ["Trealva"],
    featuredAmenities: [
      "Midlands West Central Eco-Resort Clubhouse",
      "Holistic Wellness & Meditation Pavilions",
      "Dedicated Hiking, Biking & Nature Trails",
      "Sustainable Green Linear Parks & Solar Lighting",
      "Direct connection to Tagaytay Midlands Golf Club",
    ],
    projects: [
      {
        name: "Trealva at Midlands West",
        type: "Lot",
        priceRange: "₱13.5M – ₱25.0M",
        sizes: "380 – 700 sqm prime lots",
        description:
          "The very first residential lot community in Tagaytay Highlands' newest district. Trealva brings together ecocentric architecture, lush organic gardens, and sweeping mountain views.",
        images: [
          "https://images.pexels.com/photos/14023023/pexels-photo-14023023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/27169937/pexels-photo-27169937.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/6872257/pexels-photo-6872257.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Pioneer horizontal project in Midlands West",
          "Ecocentric modern mountain architecture",
          "Dedicated wellness park and sensory gardens",
        ],
      },
    ],
  },
  {
    id: "greenlands",
    name: "The Greenlands",
    tagline: "Vibrant Hub for Holistic Family Living & Eco-Farming",
    elevation: "approx. 400 – 920 ft above sea level",
    landArea: "approx. 260 hectares",
    theme: "American Country, Mediterranean & Eco-Farming Sanctuaries",
    coverImage:
      "https://images.pexels.com/photos/213840/pexels-photo-213840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    description:
      "Set against gently rolling terrain, The Greenlands invites you to rediscover a simpler, rewarding lifestyle. Known for eco-farming communities, country-style villages, and tight-knit family camaraderie.",
    developedCommunities: [
      "Fairfield",
      "Nob Hill",
      "The Parks at Saratoga Hills",
      "Plantation Hills",
      "The Verandas at Saratoga Hills",
      "The Grove at Plantation Hills",
    ],
    featuredAmenities: [
      "Plantation Hills Organic Pick & Pay Farm",
      "Greenlands Central Community Clubhouse",
      "Family Camping Grounds & Picnic Groves",
      "Children's Playgrounds & Sports Facilities",
      "Biking Loops & Nature Walking Trails",
    ],
    projects: [
      {
        name: "Plantation Hills",
        type: "Lot",
        priceRange: "₱11.5M – ₱21.0M",
        sizes: "500 – 1,000 sqm farm-residential lots",
        description:
          "An eco-farming residential lot community where homeowners can cultivate organic herbs, vegetables, and fruit trees in their own spacious backyards amidst mountain breezes.",
        images: [
          "https://images.pexels.com/photos/2887131/pexels-photo-2887131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/213840/pexels-photo-213840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Spacious farm-residential lots (up to 1,000 sqm)",
          "Home organic farming lifestyle",
          "Community farming assistance & green buffers",
        ],
      },
      {
        name: "Nob Hill",
        type: "Lot",
        priceRange: "₱8.8M – ₱15.0M",
        sizes: "300 – 480 sqm lots",
        description:
          "A contemporary hillside residential community designed for relaxed modern living with passive cooling architecture and linear nature parks.",
        images: [
          "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
          "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
        ],
        highlights: [
          "Modern linear park system",
          "Best entry price point in Tagaytay Highlands",
          "Gentle rolling terrain & green buffers",
        ],
      },
    ],
  },
];

export const OFFICIAL_CLUBS = [
  {
    name: "Highlands Golf Club",
    desc: "18-hole championship par-70 course set atop the highest elevation with the iconic Swiss cable car system.",
    image:
      "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  },
  {
    name: "The Midlands Golf Club",
    desc: "18-hole championship par-72 course overlooking Taal Lake with the 48-seater Swiss Funicular train and Midlands Lucky 9.",
    image:
      "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  },
  {
    name: "The Country Club",
    desc: "Premier sports and leisure hub featuring indoor pools, bowling, badminton, dining, cinema, and kids learning centers.",
    image:
      "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  },
  {
    name: "The Spa and Lodge",
    desc: "Authentic Western cedar log cabin sanctuary offering therapeutic massages, saunas, steam baths, and luxury suites.",
    image:
      "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  },
];

export const OFFICIAL_RESTAURANTS = [
  {
    name: "Aozora Japanese Restaurant at Akasaka",
    location: "The Gourmet Avenue",
    desc: "Authentic Japanese favorites, fresh sashimi, ramen, and sushi with cool mountain breeze.",
    image:
      "https://images.pexels.com/photos/33269326/pexels-photo-33269326.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Highlands China Palace",
    location: "The Highlands",
    desc: "Grand authentic Cantonese cuisine, dim sum, Peking duck, and family banquets.",
    image:
      "https://images.pexels.com/photos/32860331/pexels-photo-32860331.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Lime and Basil",
    location: "The Gourmet Avenue",
    desc: "Farm-to-table authentic Thai cuisine with fresh herbs and vibrant Southeast Asian flavors.",
    image:
      "https://images.pexels.com/photos/5531299/pexels-photo-5531299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Amare Brick-Oven Pizza at Toscana",
    location: "The Gourmet Avenue",
    desc: "Traditional wood-fired Italian Neapolitan pizzas, handmade pastas, and Italian wines.",
    image:
      "https://images.pexels.com/photos/6223172/pexels-photo-6223172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Gourmet Farms at The Sports Center Veranda",
    location: "The Sports Center Veranda",
    desc: "Organic salads, farm-fresh dishes, and artisanal roasted mountain coffees.",
    image:
      "https://images.pexels.com/photos/28991058/pexels-photo-28991058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "The Highlander Steakhouse",
    location: "The Highlands",
    desc: "The iconic rustic log cabin steakhouse serving prime aged steaks, fine wines, and classic sides.",
    image:
      "https://images.pexels.com/photos/1639561/pexels-photo-1639561.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Concha’s Garden Café at Highlands Golfers Lounge",
    location: "Highlands Golfers Lounge",
    desc: "Hearty traditional Filipino comfort food, heirloom recipes, and scenic fairway dining.",
    image:
      "https://images.pexels.com/photos/34056723/pexels-photo-34056723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Kaya Korean Restaurant at Chosun",
    location: "Chosun",
    desc: "Authentic Korean barbecue, hot stone bibimbap, and traditional Korean side dishes.",
    image:
      "https://images.pexels.com/photos/18936008/pexels-photo-18936008.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Comida y Vino",
    location: "The Highlands",
    desc: "Spanish tapas, paella, jamón, and curated international wine cellar pairings.",
    image:
      "https://images.pexels.com/photos/8472894/pexels-photo-8472894.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Concha’s Garden Café at The Midlands Golfers Lounge",
    location: "The Midlands Golfers Lounge",
    desc: "Classic Filipino specialties and refreshing drinks overlooking the Midlands greens.",
    image:
      "https://images.pexels.com/photos/36433560/pexels-photo-36433560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];

export const PLACES_TO_GO = [
  {
    name: "Highlands Country Club",
    desc: "Central lifestyle, leisure & dining hub",
    image:
      "https://images.pexels.com/photos/35314892/pexels-photo-35314892.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Country Club Pool",
    desc: "Outdoor pools with heated jacuzzi clusters",
    image:
      "https://images.pexels.com/photos/19075389/pexels-photo-19075389.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "China Palace",
    desc: "Authentic Cantonese dining landmark",
    image:
      "https://images.pexels.com/photos/32860319/pexels-photo-32860319.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Bowling Center",
    desc: "14-lane disco bowling with neon pins",
    image:
      "https://images.pexels.com/photos/9821841/pexels-photo-9821841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Badminton Courts",
    desc: "Indoor courts with Italian rubber vinyl flooring",
    image:
      "https://images.pexels.com/photos/26238655/pexels-photo-26238655.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "The Animal Farm",
    desc: "Petting zoo with miniature animals & on-site vet",
    image:
      "https://images.pexels.com/photos/14265075/pexels-photo-14265075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "The Spa & Lodge",
    desc: "Log cabin suites & therapeutic massages",
    image:
      "https://images.pexels.com/photos/38407789/pexels-photo-38407789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Swiss Cable Cars",
    desc: "Scenic aerial tramway between 9th & 18th holes",
    image:
      "https://images.pexels.com/photos/33071170/pexels-photo-33071170.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Championship Golf Courses",
    desc: "Tagaytay Highlands & Midlands layouts",
    image:
      "https://images.pexels.com/photos/5044279/pexels-photo-5044279.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Tennis Courts",
    desc: "Synthetic grass outdoor courts",
    image:
      "https://images.pexels.com/photos/12029162/pexels-photo-12029162.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Peak Bar",
    desc: "Evening cocktails with 360-degree mountain horizon",
    image:
      "https://images.pexels.com/photos/26626726/pexels-photo-26626726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Madre De Dios Chapel",
    desc: "Picturesque stone chapel in The Midlands",
    image:
      "https://images.pexels.com/photos/14612248/pexels-photo-14612248.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Holy Family Chapel",
    desc: "Serene mountain chapel in The Highlands",
    image:
      "https://images.pexels.com/photos/14608920/pexels-photo-14608920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];
