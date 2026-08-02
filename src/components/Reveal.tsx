import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { EditableText } from "./editor/Editable";

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  id?: string;
};

export function Reveal({ children, className, delay = 0, as, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      id={id}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "is-visible", className)}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-gold-600/30 bg-gold-50/90 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-gold-700 uppercase shadow-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  copy,
  align = "center",
  fieldPrefix,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
  align?: "center" | "left";
  fieldPrefix?: string;
}) {
  const base = fieldPrefix || (title ? `heading.${title.slice(0, 12).toLowerCase().replace(/[^a-z0-9]/g, "")}` : "heading");
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      <Reveal>
        <Eyebrow>
          <EditableText field={`${base}.eyebrow`} value={eyebrow} />
        </Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
          <EditableText field={`${base}.title`} value={title} />{" "}
          {accent && (
            <em className="shimmer-text not-italic font-medium">
              <EditableText field={`${base}.accent`} value={accent} />
            </em>
          )}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={150}>
          <p className="mt-4 text-[15px] leading-relaxed text-pine-700 sm:text-base">
            <EditableText field={`${base}.copy`} value={copy} />
          </p>
        </Reveal>
      )}
    </div>
  );
}
