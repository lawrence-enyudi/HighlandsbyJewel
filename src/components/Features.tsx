import { Reveal, SectionHeading } from "./Reveal";
import { EditableText } from "./editor/Editable";
import { features } from "@/data/content";

const paths: Record<string, string> = {
  flag: "M5 21V4m0 0 9 2.5L11 10l8 2-14 3.5",
  cloud: "M7 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.4 1.4A3.5 3.5 0 0 1 17.5 18H7Z",
  shield: "M12 3 5 6v5.5c0 4.3 3 8.1 7 9.5 4-1.4 7-5.2 7-9.5V6l-7-3Zm-2.4 8.6 1.9 1.9 3.6-3.7",
  route: "M6 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm12-11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 2.5c0 3.6-3 4-6 4.5s-4.6 1.1-4.6 3.5M18 9v2.5",
  sparkle: "m12 3 2.2 5.6L20 10.8l-5.8 2.2L12 19l-2.2-6L4 10.8l5.8-2.2L12 3Z",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h4",
};

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-32 bg-cream-50/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why Tagaytay Highlands"
          title="A mountain sanctuary you don't check out of."
          accent="Ever."
          copy="Six reasons discerning families choose Tagaytay Highlands over every other destination in Luzon — and why residents cherish their mountain estates."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 90}
              className="group relative overflow-hidden rounded-3xl border border-highlands-900/10 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-md"
            >
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-gold-600/30 bg-gold-50 text-gold-700 transition-all duration-300 group-hover:bg-gold-100 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[22px] w-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={paths[f.icon]} />
                </svg>
              </span>
              <h3 className="relative mt-6 font-display text-xl font-normal text-highlands-900">
                <EditableText field={`feature.${i}.title`} value={f.title} />
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-pine-700">
                <EditableText field={`feature.${i}.copy`} value={f.copy} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
