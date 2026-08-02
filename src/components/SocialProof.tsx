import { Reveal } from "./Reveal";
import { EditableText } from "./editor/Editable";
import { useSite } from "@/context/SiteContext";

const partners = [
  "Tagaytay Highlands",
  "The Midlands",
  "Midlands West",
  "The Greenlands",
  "Belle Corporation",
  "Highlands Prime, Inc.",
  "BDO Unibank",
  "BPI Family Savings",
  "Metrobank",
  "Security Bank",
  "Tagaytay Highlands Country Club",
];

export default function SocialProof() {
  const { settings } = useSite();

  return (
    <section
      aria-label="Social proof"
      className="relative overflow-hidden border-y border-highlands-950/50 bg-gradient-to-br from-highlands-950 via-highlands-900 to-lake-900 py-16"
    >
      {/* Ambient ridge glows */}
      <div
        className="animate-drift pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-highlands-500/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="animate-floaty pointer-events-none absolute -bottom-20 right-1/5 h-64 w-64 rounded-full bg-gold-500/15 blur-[100px]"
        aria-hidden="true"
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-[11px] font-semibold tracking-[0.3em] text-highlands-100/60 uppercase">
            <EditableText
              field="social.label"
              value="Tagaytay Highlands Districts, Clubs & Banking Partners"
            />
          </p>
        </Reveal>

        <div
          className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
          aria-hidden="true"
        >
          <div className="animate-marquee flex w-max gap-12 group-hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="font-display text-base whitespace-nowrap text-highlands-100/50 font-medium transition-colors duration-300 hover:text-gold-300 sm:text-lg"
              >
                <EditableText field={`social.marquee.${i}`} value={p} />
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:bg-white/[0.1] sm:p-7"
            >
              <dt className="font-display text-[clamp(1.8rem,4vw,2.5rem)] leading-none font-normal text-gold-300 transition-colors duration-300 group-hover:text-gold-200">
                <EditableText field={`social.stat.${i}.value`} value={s.value} />
              </dt>
              <dd className="mt-3 text-[12.5px] leading-snug text-highlands-100/70 font-medium">
                <EditableText field={`social.stat.${i}.label`} value={s.label} />
              </dd>
              <span className="absolute inset-x-6 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-lake-500 transition-transform duration-500 group-hover:scale-x-100" />
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
