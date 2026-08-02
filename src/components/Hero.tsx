import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import { CalendarCheck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const HERO_IMG_PRESETS = [
  { name: "Misty Ridge Vista", url: "https://images.pexels.com/photos/19739231/pexels-photo-19739231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200" },
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200" },
  { name: "Pine Forest Hills", url: "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200" },
];

export default function Hero() {
  const { settings, openSiteTrippingModal } = useSite();
  const [y, setY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="relative isolate overflow-hidden pt-24 pb-14 sm:pt-36 lg:pt-40 lg:pb-28">
      {/* Editable Background image */}
      <div className="absolute inset-0 -z-30">
        <EditableImage
          field="hero.main"
          src={settings.heroImage}
          alt="Tagaytay Highlands mountain landscape"
          className="h-full w-full"
          imgClassName="h-full w-full scale-105 object-cover opacity-25 transition-opacity duration-1000"
          presets={HERO_IMG_PRESETS}
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(85%_60%_at_50%_-8%,rgba(205,234,221,0.92),rgba(211,236,239,0.6)_42%,transparent_72%),linear-gradient(180deg,rgba(231,245,238,0.88),rgba(242,248,245,0.95)_55%,#f2f8f5_100%)]" />
      <div className="grain absolute inset-0 -z-10 opacity-30 mix-blend-multiply" />
      <div
        className="animate-drift absolute -top-28 -left-32 -z-10 h-[36rem] w-[36rem] rounded-full bg-lake-100/80 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="animate-floaty absolute top-44 -right-28 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold-200/70 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        {/* Copy */}
        <div>
          <div
            className={`animate-fade-down inline-flex items-center gap-2.5 rounded-full border border-highlands-900/10 bg-white/90 py-1.5 pr-4 pl-2 shadow-xs backdrop-blur-md ${mounted ? "" : "opacity-0"}`}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                className="absolute h-5 w-5 rounded-full bg-highlands-500/25"
                style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
              />
              <span className="h-2 w-2 rounded-full bg-highlands-600" />
            </span>
            <EditableText
              field="hero.badge"
              value={settings.heroBadge}
              className="text-[11px] font-semibold tracking-[0.14em] text-highlands-900 uppercase"
            />
          </div>

          <h1
            className="animate-fade-down mt-6 font-display text-[clamp(2.5rem,6.5vw,4.6rem)] leading-[1.03] font-normal tracking-[-0.03em] text-highlands-900 text-balance"
            style={{ animationDelay: "80ms" }}
          >
            <EditableText field="hero.prefix" value={settings.heroHeadlinePrefix} />
            <br />
            <em className="shimmer-text font-normal not-italic">
              <EditableText field="hero.accent" value={settings.heroHeadlineAccent} />
            </em>
          </h1>

          <p
            className="animate-fade-down mt-6 max-w-xl text-[16px] leading-relaxed text-pine-700 sm:text-[17.5px]"
            style={{ animationDelay: "160ms" }}
          >
            <EditableText field="hero.sub" value={settings.heroSubheadline} />
          </p>

          <div
            className="animate-fade-down mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <button
              type="button"
              onClick={() => openSiteTrippingModal()}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-4 text-center text-sm font-semibold text-highlands-950 shadow-[0_8px_24px_-6px_rgba(184,134,40,0.6)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="relative z-10">Book Free VIP Site Tripping</span>
            </button>

            <a
              href="#properties"
              className="group flex items-center justify-center gap-2 rounded-full border border-highlands-900/15 bg-white/90 px-7 py-4 text-center text-sm font-semibold text-highlands-900 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-highlands-900/30 hover:bg-white"
            >
              <span>Explore Available Properties</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold-600 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Specialist Trust Bar */}
          <div
            className="animate-fade-down mt-8 flex flex-wrap items-center gap-4 border-t border-highlands-900/10 pt-6 text-xs text-pine-700 font-medium"
            style={{ animationDelay: "300ms" }}
          >
            <span className="flex items-center gap-1.5 text-highlands-900 font-semibold">
              <ShieldCheck className="h-4 w-4 text-highlands-600" />
              <EditableText field="hero.trust1" value="Accredited Property Specialist" />
            </span>
            <span className="hidden text-highlands-900/20 sm:inline">•</span>
            <EditableText field="hero.trust2" value="Exclusive Gate Pass & SMO Meeting" />
            <span className="hidden text-highlands-900/20 sm:inline">•</span>
            <EditableText field="hero.trust3" value="0% Interest Payment Schemes" />
          </div>

          <dl
            className="animate-fade-down mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-highlands-900/10 pt-6"
            style={{ animationDelay: "360ms" }}
          >
            {[
              ["stat0", "2,000 ft", "Elevation Above Sea Level"],
              ["stat1", "22°C", "Cool Climate Year-Round"],
              ["stat2", "60 min", "From BGC via CALAX"],
            ].map(([f, v, l]) => (
              <div key={l as string}>
                <dt className="font-display text-2xl font-normal text-gold-700 sm:text-3xl">
                  <EditableText field={`hero.stats.${f}`} value={v as string} />
                </dt>
                <dd className="mt-1 text-[11px] tracking-wider text-pine-600 uppercase font-medium">
                  <EditableText field={`hero.stats.${f}.label`} value={l as string} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual Card */}
        <Reveal delay={200} className="relative">
          <div
            className="relative"
            style={{ transform: `translate3d(0, ${-y * 0.03}px, 0)` }}
          >
            <EditableImage
              field="hero.card"
              src={settings.heroCardImage}
              alt="Tagaytay Highlands luxury mountain residence"
              className="group relative overflow-hidden rounded-[30px] border border-highlands-900/12 shadow-[0_20px_50px_-15px_rgba(22,61,44,0.18)] bg-white"
              imgClassName="h-[260px] w-full object-cover sm:h-[520px]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/85 via-highlands-950/10 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 rounded-2xl p-4.5 bg-white/95 backdrop-blur-md border border-white/40 shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.2em] text-gold-700 uppercase">
                      <Sparkles className="h-3 w-3" />
                      <EditableText field="hero.card.label" value="Featured Highlands Enclave" />
                    </span>
                    <p className="mt-1 font-display text-lg font-medium text-highlands-900">
                      <EditableText field="hero.card.name" value="Highlands Residences & Horizon Terraces" />
                    </p>
                    <p className="mt-0.5 text-xs text-pine-600">
                      <EditableText field="hero.card.sub" value="Condominiums & Garden Villas · 2,400 ft ASL" />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-highlands-900 font-semibold">
                      <EditableText field="hero.card.price" value="From ₱10.5M" />
                    </p>
                    <button
                      type="button"
                      onClick={() => openSiteTrippingModal("Highlands Residences")}
                      className="mt-1 rounded-full bg-gold-50 border border-gold-400/50 px-3.5 py-1 text-[11px] font-semibold text-gold-800 transition-colors hover:bg-gold-100"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            </EditableImage>

            {/* Floating badge */}
            <div className="animate-floaty absolute -top-4 -left-4 hidden rounded-2xl px-4.5 py-3.5 bg-white/95 border border-lake-600/25 shadow-lg sm:block">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-lake-700 uppercase">
                <EditableText field="hero.float1.label" value="Highlands Value" />
              </p>
              <p className="mt-0.5 font-display text-xl text-lake-800 font-semibold">
                <EditableText field="hero.float1.value" value="+38% ↑" />
              </p>
              <p className="text-[10px] text-pine-600">
                <EditableText field="hero.float1.sub" value="Land Appreciation" />
              </p>
            </div>

            <div
              className="animate-floaty absolute -right-3 bottom-28 hidden rounded-2xl px-4.5 py-3.5 bg-white/95 border border-highlands-900/10 shadow-lg lg:block"
              style={{ animationDelay: "1.5s" }}
            >
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gold-700 uppercase">
                <EditableText field="hero.float2.label" value="Site Tripping" />
              </p>
              <p className="mt-0.5 font-display text-base text-highlands-900 font-semibold">
                <EditableText field="hero.float2.value" value="Gate Pass Ready" />
              </p>
              <p className="text-[10px] text-highlands-600 font-medium">
                <EditableText field="hero.float2.sub" value="Van Tour from SMO" />
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
