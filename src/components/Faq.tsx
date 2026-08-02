import { useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import { EditableText } from "./editor/Editable";
import { faqs } from "@/data/content";
import { cn } from "@/utils/cn";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-16 sm:py-32 bg-cream-50/50 border-t border-highlands-900/8">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Straight Answers"
          title="Frequently asked questions about"
          accent="Tagaytay Highlands."
          copy="No brochure jargon. If you have any questions about memberships, gate passes, or titles, Jewel will provide clear answers."
        />

        <div className="mt-14 divide-y divide-highlands-900/8 overflow-hidden rounded-3xl border border-highlands-900/10 bg-white shadow-xs">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-start gap-4 px-6 py-5 text-left transition-colors duration-300 hover:bg-cream-50/80 sm:px-8 sm:py-6"
                  >
                    <span className="mt-0.5 font-display text-[13px] font-bold text-gold-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-medium text-highlands-900 sm:text-[16.5px]">
                      <EditableText field={`faq.${i}.q`} value={f.q} />
                    </span>
                    <span
                      className={cn(
                        "relative mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-highlands-900 transition-all duration-300",
                        isOpen
                          ? "rotate-45 border-gold-500 bg-gold-50 text-gold-800"
                          : "border-highlands-900/15 bg-cream-50",
                      )}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  className={cn(
                    "grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pl-[3.4rem] text-[14.5px] leading-relaxed text-pine-700 sm:px-8 sm:pb-7 sm:pl-[4.1rem]">
                      <EditableText field={`faq.${i}.a`} value={f.a} />
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
