import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { OFFICIAL_CLUBS, OFFICIAL_RESTAURANTS, PLACES_TO_GO } from "@/data/communities";
import { Reveal, Eyebrow } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import {
  CalendarCheck,
  ShieldCheck,
  Utensils,
  Trophy,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";

const CLUB_IMG_PRESETS = [
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Golf Clubhouse Lawn", url: "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Mountain Resort Pool", url: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Cedar Cabin Lounge", url: "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Modern Dining Room", url: "https://images.pexels.com/photos/9936218/pexels-photo-9936218.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Taal View Terrace", url: "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
];

export default function AmenitiesSection() {
  const { openSiteTrippingModal } = useSite();
  const [activeTab, setActiveTab] = useState<"clubs" | "dining" | "places">("clubs");

  return (
    <section
      id="amenities"
      className="relative scroll-mt-24 overflow-hidden border-t border-highlands-900/8 bg-cream-50/50 py-16 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>Exclusive Members' Clubs &amp; Lifestyle</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.5rem)] leading-[1.06] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
              <EditableText field="amen.headline.1" value="Four exclusive clubs, world-class dining" />{" "}
              <em className="shimmer-text font-medium not-italic">
                <EditableText field="amen.headline.2" value="& resort amenities." />
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 text-[15.5px] leading-relaxed text-pine-700 sm:text-[16.5px]">
              <EditableText
                field="amen.intro"
                value="Owning in Tagaytay Highlands opens access to Asia's premier mountain golf clubs, Swiss cable cars & funicular train, gourmet restaurants on The Gourmet Avenue, and private family recreation."
              />
            </p>
          </Reveal>
        </div>

        {/* Tab Selector */}
        <Reveal delay={200} className="mt-12 flex justify-center">
          <div className="inline-flex rounded-full border border-highlands-900/12 bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300",
                activeTab === "clubs"
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                  : "text-highlands-900/60 hover:text-highlands-900",
              )}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>4 Exclusive Clubs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dining")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300",
                activeTab === "dining"
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                  : "text-highlands-900/60 hover:text-highlands-900",
              )}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Gourmet Restaurants ({OFFICIAL_RESTAURANTS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("places")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300",
                activeTab === "places"
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                  : "text-highlands-900/60 hover:text-highlands-900",
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Places to Go ({PLACES_TO_GO.length})</span>
            </button>
          </div>
        </Reveal>

        {/* TAB 1: 4 EXCLUSIVE CLUBS */}
        {activeTab === "clubs" && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OFFICIAL_CLUBS.map((club, idx) => (
              <Reveal
                key={club.name}
                delay={idx * 90}
                className="group flex flex-col overflow-hidden rounded-3xl border border-highlands-900/10 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-lg"
              >
                <EditableImage
                  field={`img:club.${idx}`}
                  src={club.image}
                  alt={club.name}
                  className="relative aspect-[16/11] overflow-hidden"
                  imgClassName="h-full w-full object-cover"
                  presets={CLUB_IMG_PRESETS}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-highlands-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full border border-gold-400/30 bg-white/95 px-3 py-0.5 text-[10px] font-bold text-gold-800 uppercase backdrop-blur-md">
                    <EditableText field={`club.${idx}.badge`} value={`Club #${idx + 1}`} />
                  </span>
                  <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-normal text-white">
                    <EditableText field={`club.${idx}.name`} value={club.name} />
                  </h3>
                </EditableImage>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs leading-relaxed text-pine-700">
                    <EditableText field={`club.${idx}.desc`} value={club.desc} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* TAB 2: OFFICIAL RESTAURANTS WITH PHOTOS */}
        {activeTab === "dining" && (
          <div className="mt-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {OFFICIAL_RESTAURANTS.map((rest, idx) => (
                <Reveal
                  key={rest.name}
                  delay={(idx % 3) * 80}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-highlands-900/8 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lg"
                >
                  <EditableImage
                    field={`img:rest.${idx}`}
                    src={rest.image}
                    alt={rest.name}
                    className="relative aspect-[16/10] overflow-hidden"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    presets={CLUB_IMG_PRESETS}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/85 via-highlands-950/15 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full border border-gold-400/40 bg-white/95 px-3 py-0.5 text-[10px] font-bold text-gold-800 uppercase backdrop-blur-md">
                      <EditableText field={`rest.${idx}.location`} value={rest.location} />
                    </span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="font-display text-lg font-medium text-white leading-tight">
                        <EditableText field={`rest.${idx}.name`} value={rest.name} />
                      </h4>
                    </div>
                  </EditableImage>

                  <div className="flex flex-1 items-start gap-2.5 p-4.5">
                    <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <p className="text-xs text-pine-600 leading-relaxed">
                      <EditableText field={`rest.${idx}.desc`} value={rest.desc} />
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLACES TO GO WITH PHOTOS */}
        {activeTab === "places" && (
          <div className="mt-14">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {PLACES_TO_GO.map((place, idx) => (
                <Reveal
                  key={place.name}
                  delay={(idx % 4) * 60}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-highlands-900/8 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/30 hover:shadow-md"
                >
                  <EditableImage
                    field={`img:place.${idx}`}
                    src={place.image}
                    alt={place.name}
                    className="relative aspect-[16/10] overflow-hidden"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    presets={CLUB_IMG_PRESETS}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 grid h-6 w-6 place-items-center rounded-lg bg-white/95 text-[10px] font-bold text-gold-800 shadow-xs">
                      {idx + 1}
                    </span>
                  </EditableImage>

                  <div className="flex flex-1 flex-col p-3.5">
                    <h4 className="font-display text-sm font-medium text-highlands-900">
                      <EditableText field={`place.${idx}.name`} value={place.name} />
                    </h4>
                    <p className="mt-1 text-[11px] text-pine-600 leading-relaxed">
                      <EditableText field={`place.${idx}.desc`} value={place.desc} />
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Experience CTA */}
        <Reveal delay={200} className="mt-14 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-gold-500/30 bg-gold-50/70 p-7 shadow-xs">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gold-800 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" />
              <EditableText field="amen.cta.label" value="Experience It Firsthand" />
            </span>
            <h4 className="mt-2 font-display text-2xl font-normal text-highlands-900">
              <EditableText
                field="amen.cta.headline"
                value="Tour the Clubs & Dine on The Gourmet Avenue During Your Site Tripping"
              />
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-pine-700">
              <EditableText
                field="amen.cta.sub"
                value="Jewel will arrange your exclusive gate pass and include The Country Club, Golf Clubhouses, and scenic viewpoints in your itinerary."
              />
            </p>
            <button
              type="button"
              onClick={() => openSiteTrippingModal("Clubs & Dining Tour")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3.5 text-xs font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-4 w-4" />
              <EditableText field="amen.cta.btn" value="Book Complimentary Site Tripping" />
            </button>
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-pine-600 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-highlands-600" /> Free gate pass
              </span>
              <span>•</span>
              <span>Van tour from SMO</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
