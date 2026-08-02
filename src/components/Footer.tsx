import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { Logo } from "./Navbar";
import { EditableText } from "./editor/Editable";
import { Phone, Mail, MapPin, X } from "lucide-react";

const cols = [
  {
    title: "4 Communities",
    links: [
      { name: "The Highlands (High Altitude)", href: "#communities" },
      { name: "The Midlands (Golf & Lakeside)", href: "#communities" },
      { name: "Midlands West (Eco-Resort)", href: "#communities" },
      { name: "The Greenlands (Eco-Farming)", href: "#communities" },
      { name: "Highlands Residences", href: "#properties" },
    ],
  },
  {
    title: "Site Tripping & SMO",
    links: [
      { name: "Gate Pass Clearance", href: "#site-tripping" },
      { name: "Meet at SMO Lounge", href: "#site-tripping" },
      { name: "Highlands Van Tour", href: "#site-tripping" },
      { name: "Clubs & Amenities Tour", href: "#amenities" },
    ],
  },
  {
    title: "About & Terms",
    links: [
      { name: "Meet Jewel Villafranca", href: "#about-jewel" },
      { name: "0% Interest Payment Terms", href: "#pricing" },
      { name: "Land Value Appreciation", href: "#benefits" },
      { name: "Buyer FAQ", href: "#faq" },
    ],
  },
];

const FACEBOOK_PATH =
  "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8h3.2Z";

type LegalKey = "privacy" | "terms" | "disclosures";

function legalContent(specialistName: string, address: string) {
  const year = new Date().getFullYear();
  return {
    privacy: {
      title: "Privacy Policy",
      body: [
        `This website is operated by ${specialistName}, an accredited property specialist for Tagaytay Highlands. We respect and protect the privacy of every visitor.`,
        "Information we collect: When you book a site tripping or send an inquiry, we collect the details you voluntarily provide — your name, contact number, email, vehicle make/model and plate (used only to arrange your estate gate pass), and your property preferences.",
        "How we use it: Your details are used solely to coordinate your visit, process your gate pass, prepare property computations, and follow up on your inquiry. We never sell, rent, or trade your personal information to third parties.",
        "Reviews: When you post a site tripping review, only the name, location, rating, and comment you choose to share are displayed publicly. Do not include sensitive personal information in your review.",
        "Data storage: Inquiry and review data is stored securely and kept only for as long as necessary to serve you. You may request correction or deletion of your details anytime by contacting us.",
        `In compliance with the Philippine Data Privacy Act of 2012 (RA 10173), you have the right to access, correct, and withdraw your personal data. For any privacy concern, contact ${specialistName} directly. © ${year}.`,
      ],
    },
    terms: {
      title: "Terms of Use",
      body: [
        `By using this website you agree to these terms. This site is an informational and lead-coordination tool maintained by ${specialistName} for Tagaytay Highlands properties.`,
        "Not an offer or contract: All prices, promos, availability, computations, and specifications shown are indicative only and subject to change without prior notice. Nothing on this site constitutes a binding offer, reservation, or contract to sell.",
        "Developer authority: Tagaytay Highlands is developed by Highlands Prime, Inc. (an SM Prime Holdings subsidiary). Official prices, contracts, titles, and turnover schedules are governed exclusively by the developer's official documents.",
        "Promos & countdowns: Limited-time promotions and discounts are subject to the developer's approval and availability, and may end earlier than displayed. Final applicable discounts are confirmed in writing at reservation.",
        "Bookings: Site tripping is free and carries no obligation to purchase. Estate entry remains subject to Tagaytay Highlands security policies and a valid gate pass.",
        `Use of this site implies acceptance of these terms. © ${year} ${specialistName}.`,
      ],
    },
    disclosures: {
      title: "Disclosures",
      body: [
        `${specialistName} is an accredited property specialist assisting buyers with Tagaytay Highlands properties. This is a personal marketing website and is not the official corporate website of Tagaytay Highlands or SM Prime Holdings.`,
        "Photos & imagery: Some images on this site are representative lifestyle and stock photography used for illustration and may not depict the exact unit, view, or finish. Actual property features, views, and turnover finishes may vary.",
        "Pricing accuracy: Figures, monthly amortizations, and savings are estimates for guidance only. Taxes, registration, documentary stamps, association dues, and club fees are quoted separately and confirmed in a written cost sheet.",
        "Foreign ownership: Land ownership by foreign nationals is subject to Philippine law. We will refer you to qualified counsel before you commit.",
        `Office / meeting point: ${address}. All viewings are coordinated through the Sales Marketing Office (SMO).`,
        `For clarifications on any listing or computation, please contact ${specialistName} directly. © ${new Date().getFullYear()}.`,
      ],
    },
  } as const;
}

export default function Footer() {
  const { settings, openAdmin } = useSite();
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const legalDocs = legalContent(settings.specialistName, settings.locationAddress);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-highlands-950 to-[#03170f] pt-16 pb-12 text-highlands-100">
      <div className="hairline absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <div
        className="animate-drift pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-highlands-600/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-floaty pointer-events-none absolute bottom-0 left-1/5 h-56 w-56 rounded-full bg-gold-500/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-highlands-100/70">
              <EditableText
                field="footer.blurb"
                value={`Personalized property assistance and private gate pass site trippings by ${settings.specialistName}, Accredited Property Specialist at Tagaytay Highlands. Direct developer pricing, official gate passes, and custom 0% interest computations.`}
              />
            </p>

            <div className="mt-6">
              <a
                href="https://www.facebook.com/jewel.villafranca.2025"
                target="_blank"
                rel="noreferrer"
                aria-label="Jewel Villafranca on Facebook"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] py-2 pr-4 pl-2.5 text-sm font-medium text-highlands-100/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1877F2] text-white">
                  <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden="true">
                    <path d={FACEBOOK_PATH} />
                  </svg>
                </span>
                <span>Follow Jewel on Facebook</span>
              </a>
            </div>

            <address className="mt-7 space-y-2 text-[13px] not-italic text-highlands-100/75 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                <span>{settings.locationAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {settings.email}
                </a>
              </p>
            </address>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
                  {c.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        className="group inline-flex items-center gap-1.5 text-[13.5px] text-highlands-100/70 font-medium transition-colors hover:text-white"
                      >
                        <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-3" />
                        <EditableText field={`footer.${c.title}.${l.name}`} value={l.name} />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p
            onClick={(e) => {
              if (e.detail === 3) openAdmin();
            }}
            title="Tagaytay Highlands Specialist Portal"
            className="cursor-default text-[12px] text-highlands-100/55 select-none font-medium"
          >
            © {new Date().getFullYear()} Tagaytay Highlands by Jewel ({settings.specialistName}).
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-highlands-100/55 font-medium">
            <button type="button" onClick={() => setLegal("privacy")} className="transition-colors hover:text-white">
              Privacy
            </button>
            <button type="button" onClick={() => setLegal("terms")} className="transition-colors hover:text-white">
              Terms
            </button>
            <button type="button" onClick={() => setLegal("disclosures")} className="transition-colors hover:text-white">
              Disclosures
            </button>
          </div>
        </div>
      </div>

      {/* Legal modal */}
      {legal && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={legalDocs[legal].title}
        >
          <div className="fixed inset-0 bg-highlands-950/70 backdrop-blur-sm" onClick={() => setLegal(null)} />
          <div className="animate-scale-in relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-highlands-900/10 bg-white p-6 text-highlands-900 shadow-2xl sm:p-8">
            <div className="sticky top-0 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-highlands-900/8 bg-white/95 px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
              <h3 className="font-display text-xl font-normal text-highlands-900">
                {legalDocs[legal].title}
              </h3>
              <button
                type="button"
                onClick={() => setLegal(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-highlands-900 hover:bg-cream-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              {legalDocs[legal].body.map((para, i) => (
                <p key={i} className="text-[13.5px] leading-relaxed text-pine-700">
                  {para}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLegal(null)}
              className="mt-6 w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-2.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
