import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { Reveal, Eyebrow } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import {
  KeyRound,
  Compass,
  Coffee,
  Calculator,
  CalendarCheck,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Bus,
} from "lucide-react";
import { cn } from "@/utils/cn";

const ICONS = {
  KeyRound,
  Compass,
  Coffee,
  Calculator,
  Bus,
};

const TOUR_GALLERY = [
  {
    title: "Taal Lake Viewpoint & Highlands Panorama",
    img: "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    desc: "Unrivalled 2,000 ft panoramic vantage points across Taal Lake, Volcano island & Mt. Makiling.",
  },
  {
    title: "Championship Fairways & Enclaves",
    img: "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    desc: "Cruise along mountain-sculpted fairways and inspect prime lots, condos and luxury townhouses.",
  },
  {
    title: "The Highlands Country Club & Dining",
    img: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    desc: "Experience premier mountain lifestyle, gourmet dining, and relaxed developer payment computation.",
  },
];

const TOUR_IMG_PRESETS = [
  { name: "Taal View Terrace", url: "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Golf Clubhouse Lawn", url: "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Mountain Resort Pool", url: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Pine Forest Hills", url: "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
  { name: "Cedar Cabin Lounge", url: "https://images.pexels.com/photos/7746550/pexels-photo-7746550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200" },
];

export default function SiteTrippingSection() {
  const { settings, openSiteTrippingModal } = useSite();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="site-tripping"
      className="relative scroll-mt-24 overflow-hidden border-t border-highlands-900/8 bg-cream-50/50 py-16 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>The Highlands Experience</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5.5vw,3.5rem)] leading-[1.06] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
              <EditableText field="tour.headline.1" value="Experience the cool mountain air before you decide." />{" "}
              <em className="shimmer-text font-medium not-italic">
                <EditableText field="tour.headline.2" value="Exclusive Gate Passes Ready." />
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 text-[15.5px] leading-relaxed text-pine-700 sm:text-[16.5px]">
              <EditableText
                field="tour.intro"
                value="Tagaytay Highlands is a strictly private, deed-restricted estate guarded 24/7. Jewel will arrange your official gate pass, welcome you at the Sales Marketing Office (SMO), and guide your visit in our comfortable van with transparent developer computations over mountain coffee."
              />
            </p>
          </Reveal>
        </div>

        {/* 4 VIP Tripping Perks */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.trippingPerks.map((perk, i) => {
            const IconComponent = ICONS[perk.iconName as keyof typeof ICONS] || KeyRound;
            return (
              <Reveal
                key={perk.title}
                delay={i * 80}
                className="group relative overflow-hidden rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-600/30 bg-gold-50 text-gold-700 transition-transform duration-300 group-hover:scale-105">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-normal text-highlands-900">
                  <EditableText field={`perk.${i}.title`} value={perk.title} />
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-pine-700">
                  <EditableText field={`perk.${i}.desc`} value={perk.desc} />
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-highlands-700 uppercase">
                  <Check className="h-3.5 w-3.5" /> Included for free
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Interactive VIP Itinerary Breakdown & Visual Preview */}
        <div className="mt-16 grid items-center gap-10 rounded-[32px] border border-highlands-900/10 bg-white p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:p-12 shadow-sm">
          {/* Steps List */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-50 border border-gold-400/50 text-xs font-bold text-gold-700">
                ★
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-gold-700 uppercase">
                <EditableText field="tour.itinerary.label" value="VIP 1-Day Itinerary Preview" />
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-normal text-highlands-900 sm:text-3xl">
              <EditableText field="tour.itinerary.headline" value="What your site tripping looks like" />
            </h3>
            <p className="mt-1.5 text-sm text-pine-600">
              <EditableText field="tour.itinerary.sub" value="Personalized around your schedule and preferred property types." />
            </p>

            <div className="mt-7 space-y-3">
              {settings.trippingItinerary.map((item, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "cursor-pointer rounded-2xl border p-4.5 transition-all duration-300 sm:p-5",
                      isSelected
                        ? "border-gold-500 bg-gold-50/60 shadow-xs"
                        : "border-highlands-900/8 bg-cream-50/50 hover:border-highlands-900/15 hover:bg-cream-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-xl font-display text-xs font-bold transition-colors",
                            isSelected
                              ? "bg-gradient-to-b from-gold-400 to-gold-600 text-highlands-950 shadow-2xs"
                              : "border border-highlands-900/12 bg-white text-highlands-900",
                          )}
                        >
                          {item.step}
                        </span>
                        <h4
                          className={cn(
                            "font-display text-[16px] font-normal transition-colors sm:text-[17px]",
                            isSelected ? "font-semibold" : "",
                          )}
                        >
                          <EditableText field={`itin.${idx}.title`} value={item.title} />
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-highlands-900/10 bg-white px-2.5 py-0.5 text-[11px] text-pine-700 font-medium">
                        <Clock className="h-3 w-3 text-gold-600" />
                        <EditableText field={`itin.${idx}.duration`} value={item.duration} />
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-2.5 text-[13.5px] leading-relaxed transition-all pl-[2.8rem]",
                        isSelected ? "text-highlands-900" : "text-pine-600",
                      )}
                    >
                      <EditableText field={`itin.${idx}.desc`} value={item.desc} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Card & Visual */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-highlands-900/10 shadow-md">
              <EditableImage
                field={`img:tour.${activeStep % TOUR_GALLERY.length}`}
                src={TOUR_GALLERY[activeStep % TOUR_GALLERY.length].img}
                alt={TOUR_GALLERY[activeStep % TOUR_GALLERY.length].title}
                className="relative"
                imgClassName="h-[220px] w-full object-cover sm:h-[340px]"
                presets={TOUR_IMG_PRESETS}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <span className="rounded-full border border-gold-400/40 bg-white/95 px-3 py-1 text-[10px] font-bold tracking-wider text-gold-800 uppercase backdrop-blur-md">
                    <EditableText field={`tour.gallery.${activeStep % TOUR_GALLERY.length}.label`} value={`Highlight #${activeStep + 1}`} />
                  </span>
                  <p className="mt-2 font-display text-lg font-normal text-white">
                    <EditableText field={`tour.gallery.${activeStep % TOUR_GALLERY.length}.title`} value={TOUR_GALLERY[activeStep % TOUR_GALLERY.length].title} />
                  </p>
                  <p className="mt-1 text-xs text-ivory-100/80">
                    <EditableText field={`tour.gallery.${activeStep % TOUR_GALLERY.length}.desc`} value={TOUR_GALLERY[activeStep % TOUR_GALLERY.length].desc} />
                  </p>
                </div>
              </EditableImage>
            </div>

            {/* Quick Action Box */}
            <div className="rounded-3xl border border-gold-500/30 bg-gold-50/70 p-6 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gold-800 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                <EditableText field="tour.cta.label" value="Limited Daily Tripping Slots" />
              </div>
              <h4 className="mt-2 font-display text-xl font-normal text-highlands-900">
                <EditableText field="tour.cta.headline" value="Ready to visit Tagaytay Highlands this week?" />
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-pine-700 font-medium">
                <EditableText
                  field="tour.cta.sub"
                  value="Book in 60 seconds. Jewel will register your car for the exclusive gate pass and prepare your Highlands van tour from the SMO."
                />
              </p>

              <button
                type="button"
                onClick={() => openSiteTrippingModal()}
                className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <CalendarCheck className="h-4 w-4" />
                <EditableText field="tour.cta.btn" value="Reserve Your Free Gate Pass" />
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-pine-600 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-highlands-600" /> Free gate pass included
                </span>
                <span>•</span>
                <span>Van tour from SMO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
