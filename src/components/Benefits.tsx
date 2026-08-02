import { Reveal, Eyebrow } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import { benefits } from "@/data/content";

const IMG =
  "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000";

const BENEFIT_IMG_PRESETS = [
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000" },
  { name: "Golf Clubhouse Lawn", url: "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000" },
  { name: "Pine Forest Hills", url: "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000" },
  { name: "Mountain Resort Pool", url: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000" },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="relative scroll-mt-24 overflow-hidden border-y border-highlands-900/8 bg-white py-16 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <EditableImage
            field="img:benefits"
            src={IMG}
            alt="Manicured fairway of the Tagaytay Highlands golf course"
            className="relative overflow-hidden rounded-[28px] border border-highlands-900/10 shadow-[0_20px_50px_-15px_rgba(22,61,44,0.15)] bg-white"
            imgClassName="h-[300px] w-full object-cover sm:h-[560px]"
            presets={BENEFIT_IMG_PRESETS}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl p-5 bg-white/95 backdrop-blur-md border border-white/40 shadow-lg">
              <p className="text-[10.5px] font-bold tracking-[0.2em] text-gold-700 uppercase">
                <EditableText field="benefit.float.label" value="Long-Term Value Math" />
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-highlands-900 font-medium">
                <EditableText
                  field="benefit.float.copy"
                  value="A Highlands lot cut acquired in 2019 has compounded by over 38% in value, solidifying Tagaytay Highlands as one of the most resilient luxury real estate assets in the Philippines."
                />
              </p>
            </div>
          </EditableImage>
          <div
            className="animate-floaty absolute -top-4 -right-4 hidden rounded-2xl px-5 py-4 bg-white border border-highlands-900/10 shadow-lg sm:block"
            aria-hidden="true"
          >
            <p className="text-[10px] font-bold tracking-[0.18em] text-pine-600 uppercase">
              <EditableText field="benefit.float2.label" value="Open Spaces" />
            </p>
            <p className="mt-1 font-display text-2xl text-highlands-700 font-semibold">
              <EditableText field="benefit.float2.value" value="40%+" />
            </p>
            <p className="text-[10px] text-pine-600 font-medium">
              <EditableText field="benefit.float2.sub" value="Lush Nature Parks" />
            </p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>The Investment Case</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.35rem)] leading-[1.08] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
              <EditableText field="benefit.headline.1" value="A generational asset of" />{" "}
              <em className="shimmer-text font-medium not-italic">
                <EditableText field="benefit.headline.2" value="prestige & wellness." />
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-pine-700 sm:text-base">
              <EditableText
                field="benefit.intro"
                value="Tagaytay Highlands combines extreme geographic exclusivity, 2,500-ft altitude, and world-class SM Group masterplanning. With strict deed restrictions and capped supply, ownership remains a prestigious family heirloom."
              />
            </p>
          </Reveal>

          <div className="mt-10 space-y-4">
            {benefits.map((b, i) => (
              <Reveal
                key={b.title}
                delay={200 + i * 100}
                className="group flex gap-5 rounded-2xl border border-highlands-900/8 bg-cream-50/70 p-5 transition-all duration-300 hover:border-gold-500/30 hover:bg-white hover:shadow-xs"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-gold-600/30 bg-gold-50 font-display text-lg font-bold text-gold-700 transition-transform duration-300 group-hover:scale-105">
                  <EditableText field={`benefit.${i}.kpi`} value={b.kpi} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-normal text-highlands-900">
                    <EditableText field={`benefit.${i}.title`} value={b.title} />
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-pine-700">
                    <EditableText field={`benefit.${i}.copy`} value={b.copy} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={540}>
            <a
              href="#pricing"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-900"
            >
              <EditableText field="benefit.link" value="See payment structures & plans" />
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
