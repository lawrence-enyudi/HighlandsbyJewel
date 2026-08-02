import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/utils/cn";
import { Star, Quote, PenLine, X, Check, ChevronLeft, ChevronRight } from "lucide-react";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < value ? "fill-gold-400 text-gold-400" : "fill-transparent text-highlands-900/20",
          )}
        />
      ))}
    </div>
  );
}

function ReviewForm({ onClose }: { onClose: () => void }) {
  const { addReview } = useSite();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [quote, setQuote] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    addReview({ name: name.trim(), location: location.trim(), rating, quote: quote.trim() });
    setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative z-10 w-full max-w-md rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-2xl text-highlands-900 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-highlands-900 hover:bg-cream-200"
          aria-label="Close review form"
        >
          <X className="h-4 w-4" />
        </button>

        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-highlands-600/30 bg-highlands-50 text-highlands-700">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-xl font-normal text-highlands-900">
              Salamat, {name.split(" ")[0]}!
            </h3>
            <p className="mt-1.5 text-sm text-pine-600">
              Your site tripping experience is now live on the website.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-50 border border-gold-400/40 text-gold-700">
                <PenLine className="h-4 w-4" />
              </span>
              <h3 className="font-display text-lg font-normal text-highlands-900">
                Share Your Site Tripping Experience
              </h3>
            </div>
            <p className="mt-1.5 text-xs text-pine-600">
              No sign-in needed — just your name, rating, and a few words after your visit.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              {/* Rating */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-highlands-900">
                  Your Rating
                </label>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHover(i + 1)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(i + 1)}
                      className="p-0.5"
                      aria-label={`Rate ${i + 1} stars`}
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          i < (hover || rating)
                            ? "fill-gold-400 text-gold-400"
                            : "fill-transparent text-highlands-900/25",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-highlands-900">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3.5 py-2.5 text-sm text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-highlands-900">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Makati"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3.5 py-2.5 text-sm text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-highlands-900">
                  Your Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="How was your site tripping with Jewel? The views, the tour, the experience..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3.5 py-2.5 text-sm text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
              >
                Post My Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { reviews } = useSite();
  const approved = useMemo(() => reviews.filter((r) => r.approved), [reviews]);

  const [formOpen, setFormOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // How many cards to show per view (responsive handled via CSS; we rotate by 1)
  const total = approved.length;

  // Auto-rotate every 7 seconds and jump to a random review set.
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (total <= 1) return prev;
        let next = Math.floor(Math.random() * total);
        if (next === prev) next = (next + 1) % total;
        return next;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, [paused, total]);

  // Keep index valid if reviews change
  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [total, index]);

  // Build the 3 visible reviews starting at current index (wraps around)
  const visible = useMemo(() => {
    if (total === 0) return [];
    const count = Math.min(3, total);
    return Array.from({ length: count }).map((_, i) => approved[(index + i) % total]);
  }, [approved, index, total]);

  const avg =
    total > 0 ? (approved.reduce((a, r) => a + r.rating, 0) / total).toFixed(1) : "5.0";

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-32 bg-white border-t border-highlands-900/8"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Site Tripping Experiences"
          title="Real stories from real visitors."
          accent="After every tour."
          copy="Hear directly from families who booked a site tripping with Jewel — the cool 22°C air, the sweeping Taal Lake views, and a warm, no-pressure visit."
        />

        {total === 0 ? (
          <Reveal className="mt-14 text-center">
            <p className="text-sm text-pine-600">
              Be the first to share your site tripping experience!
            </p>
          </Reveal>
        ) : (
          <div
            className="mt-14"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="grid gap-5 md:grid-cols-3">
              {visible.map((t, i) => (
                <article
                  key={`${t.id}-${index}-${i}`}
                  className={cn(
                    "animate-scale-in group relative overflow-hidden rounded-3xl border border-highlands-900/8 bg-cream-50/50 p-7 transition-all duration-300 hover:border-gold-500/30 hover:shadow-md sm:p-8",
                    i === 2 && "hidden lg:block",
                    i === 1 && "hidden md:block",
                  )}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <Quote className="h-7 w-7 text-gold-400/50" />
                  <Stars value={t.rating} className="mt-4" />
                  <blockquote className="relative mt-4 font-display text-[16px] leading-[1.7] font-light text-highlands-900 sm:text-[17px]">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-highlands-900/8 pt-5">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/30 bg-white text-[13px] font-semibold text-gold-800 shadow-2xs">
                      {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-highlands-900">
                        {t.name}
                      </span>
                      {t.location && (
                        <span className="block text-[12.5px] text-pine-600">{t.location}</span>
                      )}
                    </span>
                  </figcaption>
                </article>
              ))}
            </div>

            {/* Controls + rotating dots */}
            {total > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-highlands-900/15 bg-white text-highlands-900 shadow-2xs transition-colors hover:bg-cream-50"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {approved.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Go to review ${i + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === index ? "w-6 bg-gold-500" : "w-2 bg-highlands-900/20 hover:bg-highlands-900/40",
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIndex((prev) => (prev + 1) % total)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-highlands-900/15 bg-white text-highlands-900 shadow-2xs transition-colors hover:bg-cream-50"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Aggregate + Add review CTA */}
        <Reveal delay={150} className="mt-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-highlands-900/8 bg-gradient-to-br from-highlands-50 to-lake-50 px-8 py-7 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-display text-4xl font-normal text-gold-700">{avg}</p>
                <Stars value={Math.round(Number(avg))} className="mt-1 justify-center" />
              </div>
              <div className="h-12 w-px bg-highlands-900/10" />
              <p className="max-w-xs text-[13.5px] text-pine-700">
                <span className="font-semibold text-highlands-900">
                  {total} verified {total === 1 ? "review" : "reviews"}
                </span>{" "}
                from guests who visited Tagaytay Highlands with Jewel.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-6 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <PenLine className="h-4 w-4" />
              Add Your Review
            </button>
          </div>
        </Reveal>
      </div>

      {formOpen && <ReviewForm onClose={() => setFormOpen(false)} />}
    </section>
  );
}
