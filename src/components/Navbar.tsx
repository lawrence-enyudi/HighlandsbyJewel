import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/utils/cn";

const links = [
  { label: "Properties", href: "#properties" },
  { label: "4 Communities", href: "#communities" },
  { label: "Digital Map", href: "#digital-map" },
  { label: "Clubs & Dining", href: "#amenities" },
  { label: "Site Tripping", href: "#site-tripping" },
  { label: "About Jewel", href: "#about-jewel" },
  { label: "FAQ", href: "#faq" },
];

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a
      href="#top"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Tagaytay Highlands by Jewel — home"
    >
      <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-gold-400/40 bg-white shadow-md transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-2">
        <img
          src="/images/highlandslogo.png"
          alt="Tagaytay Highlands"
          className="h-9 w-9 object-contain"
        />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[16px] font-medium tracking-tight",
            dark ? "text-white" : "text-highlands-900",
          )}
        >
          Tagaytay Highlands
        </span>
        <span
          className={cn(
            "mt-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase",
            dark ? "text-gold-300" : "text-gold-600",
          )}
        >
          by Jewel
          <span className={dark ? "text-white/30" : "text-highlands-900/30"}>·</span>
          Accredited Specialist
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const { settings } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "border-b border-highlands-900/8 bg-white/92 backdrop-blur-xl shadow-xs"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative rounded-full px-3.5 py-2 text-[13.5px] font-medium text-highlands-900/80 transition-colors duration-300 hover:text-highlands-900"
                >
                  {l.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 scale-x-0 bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-transform duration-400 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-highlands-900/15 bg-white/80 text-highlands-900 transition-colors hover:bg-white xl:hidden shadow-xs"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute top-1.5 left-0 h-0.5 w-5 bg-current transition-all duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
        <div className="h-px w-full bg-highlands-900/8">
          <div
            className="h-0.5 bg-gradient-to-r from-highlands-500 via-gold-400 to-gold-600 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[64px] bottom-0 z-40 origin-top border-t border-highlands-900/10 bg-cream-50/98 px-6 py-8 backdrop-blur-2xl transition-all duration-400 xl:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${open ? i * 45 : 0}ms` }}
                className={cn(
                  "block border-b border-highlands-900/8 py-3.5 font-display text-xl font-normal text-highlands-900 transition-all duration-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-highlands-900/8 pt-4 text-xs text-pine-600">
          <span>{settings.specialistName} · Property Specialist</span>
          <span className="text-gold-600 font-medium">Tagaytay Highlands</span>
        </div>
      </div>
    </header>
  );
}
