import { useMemo, useState, useEffect } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import { useSite, type Property, type PropertyCategory } from "@/context/SiteContext";
import { calculatePromoPrice } from "@/utils/promo";
import { EditableText, EditableImage } from "./editor/Editable";
import { cn } from "@/utils/cn";
import {
  CalendarCheck,
  Eye,
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  Bed,
  Bath,
  Maximize2,
  Flame,
  Clock,
  Tag,
  Images,
} from "lucide-react";

const filters: ("All" | PropertyCategory)[] = ["All", "Lot", "Condo", "Townhouse"];
type Filter = (typeof filters)[number];

const statusStyle: Record<Property["status"], string> = {
  Available: "border-highlands-600/30 bg-highlands-50 text-highlands-800",
  "Few Left": "border-gold-600/35 bg-gold-50 text-gold-800",
  "Pre-Selling": "border-pine-600/20 bg-pine-50 text-pine-800",
  "Hot Deal": "border-amber-600/40 bg-amber-50 text-amber-900",
};

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] text-pine-600 uppercase font-semibold">{label}</p>
      <p className="mt-1 text-[13px] font-medium text-highlands-900">{value}</p>
    </div>
  );
}

function PropertyCard({
  p,
  onOpen,
  onBookTripping,
  currentTime,
}: {
  p: Property;
  onOpen: () => void;
  onBookTripping: () => void;
  currentTime: number;
}) {
  const images = p.images && p.images.length > 0 ? p.images : [p.image];
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const promoState = useMemo(() => {
    return calculatePromoPrice(p.price, p.promo);
  }, [p.price, p.promo, currentTime]);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-highlands-900/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lg">
      <div className="relative aspect-[16/11] overflow-hidden">
        <EditableImage
          field={`img:prop.${p.id}`}
          src={images[activeImgIndex] || p.image}
          alt={`${p.name} at ${p.village}`}
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-highlands-950/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {promoState.isPromoActive ? (
              <span className="flex items-center gap-1 rounded-full border border-amber-400 bg-white/95 px-3 py-1 text-[10.5px] font-bold text-amber-800 uppercase shadow-xs backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{promoState.promoBadgeText}</span>
              </span>
            ) : (
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase backdrop-blur-md shadow-2xs",
                  statusStyle[p.status],
                )}
              >
                {p.status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {images.length > 1 && (
              <span className="flex items-center gap-1 rounded-full border border-white/40 bg-highlands-950/70 px-2.5 py-0.5 text-[10px] text-white backdrop-blur-md">
                <Images className="h-3 w-3 text-gold-300" />
                <span>{activeImgIndex + 1}/{images.length}</span>
              </span>
            )}
            <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-highlands-900 uppercase backdrop-blur-md shadow-2xs">
              {p.category}
            </span>
          </div>
        </div>

        {/* Multi-angle Navigation Arrows on Image */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePrevImg}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-highlands-900 hover:bg-white border border-highlands-900/10 shadow-md transition-transform active:scale-95"
              aria-label="Previous photo angle"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-highlands-900 hover:bg-white border border-highlands-900/10 shadow-md transition-transform active:scale-95"
              aria-label="Next photo angle"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Live Promo Countdown Pill Banner */}
        {promoState.isPromoActive && (
          <div className="absolute top-14 left-4 right-4 rounded-xl border border-amber-300 bg-white/95 px-3 py-1.5 backdrop-blur-md flex items-center justify-between gap-2 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-800 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Promo Ends:</span>
            </span>
            <span className="font-mono text-xs font-bold text-highlands-900 tracking-wider">
              {promoState.timeLeft.formatted}
            </span>
          </div>
        )}

        <div className="absolute inset-x-5 bottom-4">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.2em] text-gold-300 uppercase">
            <MapPin className="h-3 w-3" />
            <EditableText field={`prop.${p.id}.village`} value={p.village} />
          </p>
          <h3 className="mt-1.5 font-display text-[22px] leading-tight font-normal text-white">
            <EditableText field={`prop.${p.id}.name`} value={p.name} />
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[13.5px] leading-relaxed text-pine-700 line-clamp-2">
          <EditableText field={`prop.${p.id}.blurb`} value={p.blurb} />
        </p>

        {/* Dynamic Category Specs */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-highlands-900/8 py-4">
          {p.category === "Lot" ? (
            <>
              <Spec label="Lot Area" value={p.lotArea || p.area} />
              <Spec label="Elevation" value={p.elevation} />
              <div>
                <p className="text-[10px] tracking-[0.16em] text-pine-600 uppercase font-semibold">
                  {promoState.isPromoActive ? "Promo Price" : "Price from"}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-highlands-900">
                  {promoState.isPromoActive
                    ? promoState.discountedPriceStr
                    : p.price}
                </p>
              </div>
            </>
          ) : (
            <>
              <Spec label="Bedrooms" value={p.beds} />
              <Spec label="Baths" value={p.baths || "Ensuite"} />
              <Spec label="Floor Area" value={p.floorArea || p.area} />
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-highlands-900/10 bg-cream-50 px-2.5 py-1 text-[11px] text-highlands-900 font-medium"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Price & Promo Savings Bar */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-highlands-900/8 pt-4">
          <div>
            {promoState.isPromoActive ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-pine-600 line-through">
                    {promoState.originalPriceStr}
                  </span>
                  <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-bold text-rose-700 uppercase">
                    -{promoState.totalPercentage}%
                  </span>
                </div>
                <p className="font-display text-xl text-highlands-900 font-semibold leading-tight">
                  {promoState.discountedPriceStr}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-display text-lg text-highlands-900 font-semibold">
                  <EditableText field={`prop.${p.id}.price`} value={p.price} />
                </p>
                <p className="text-[10px] text-pine-600 font-medium">
                  <EditableText field={`prop.${p.id}.monthly`} value={p.monthly} />
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="grid h-9 w-9 place-items-center rounded-full border border-highlands-900/15 bg-white text-highlands-900 transition-colors hover:bg-cream-50 hover:border-highlands-900/30 shadow-xs"
              title="View all photos & details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onBookTripping}
              className="group/btn inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-3.5 py-2 text-[12px] font-semibold text-highlands-950 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>{promoState.isPromoActive ? "Lock Promo" : "Book Tripping"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailModal({
  p,
  onClose,
  onBookTripping,
  currentTime,
}: {
  p: Property;
  onClose: () => void;
  onBookTripping: () => void;
  currentTime: number;
}) {
  const images = p.images && p.images.length > 0 ? p.images : [p.image];
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const promoState = useMemo(() => {
    return calculatePromoPrice(p.price, p.promo);
  }, [p.price, p.promo, currentTime]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-highlands-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
      onClick={onClose}
    >
      <div
        className="animate-scale-in max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-highlands-900/10 bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Photo Viewer */}
        <div className="relative">
          <EditableImage
            field={`img:prop.${p.id}.detail`}
            src={images[selectedImgIndex] || p.image}
            alt={`${p.name} - view ${selectedImgIndex + 1}`}
            className="absolute inset-0"
            imgClassName="h-64 w-full object-cover sm:h-96 transition-all duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/85 via-transparent to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-highlands-900 shadow-md backdrop-blur-md transition-colors hover:bg-white z-10"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute inset-x-6 bottom-4">
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.2em] text-gold-300 uppercase">
              <MapPin className="h-3 w-3" /> {p.village} · [{p.category}]
            </span>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl font-normal text-white">{p.name}</h3>
          </div>
        </div>

        {/* Multiple Photo Thumbnails Strip */}
        {images.length > 1 && (
          <div className="bg-cream-50 border-y border-highlands-900/8 px-6 py-3 flex items-center gap-2.5 overflow-x-auto">
            <span className="text-[11px] text-pine-700 uppercase font-semibold tracking-wider shrink-0 flex items-center gap-1">
              <Images className="h-3.5 w-3.5 text-gold-700" /> Angles ({images.length}):
            </span>
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setSelectedImgIndex(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all",
                  selectedImgIndex === i
                    ? "border-gold-500 ring-2 ring-gold-400/50 scale-105"
                    : "border-highlands-900/10 opacity-70 hover:opacity-100",
                )}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Prominent Limited-Time Promo Box */}
          {promoState.isPromoActive && (
            <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-amber-800">
                    <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      {p.promo?.title || "Limited-Time Exclusive Promo"}
                    </p>
                    <p className="text-[11px] text-amber-800/80">
                      Developer savings applied when you reserve during your site tripping
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-right shadow-2xs">
                  <p className="text-[10px] text-amber-800 uppercase font-semibold">Promo Countdown</p>
                  <p className="font-mono text-xs font-bold text-amber-900">
                    ⏳ {promoState.timeLeft.formatted}
                  </p>
                </div>
              </div>

              {/* Stackable Promo Breakdown list */}
              <div className="mt-4">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Stackable Promo Inclusions ({promoState.totalPercentage}% Total Savings):
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {p.promo?.discounts.map((disc) => (
                    <div
                      key={disc.id}
                      className="flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                        <Tag className="h-3.5 w-3.5 text-amber-600" />
                        <span>{disc.label}</span>
                      </span>
                      <span className="font-bold text-amber-800">+{disc.percentage}% OFF</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-amber-200 pt-3">
                <div>
                  <p className="text-[11px] text-pine-600">Regular Standard Price</p>
                  <p className="text-sm line-through text-pine-600 font-medium">{promoState.originalPriceStr}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-amber-800 font-bold uppercase">Discounted Promo Price</p>
                  <p className="font-display text-2xl font-bold text-highlands-900">
                    {promoState.discountedPriceStr}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-[15px] leading-relaxed text-pine-700">{p.blurb}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-highlands-900/10 bg-cream-50 p-5 sm:grid-cols-4">
            <Spec
              label={promoState.isPromoActive ? "Promo Price" : "Price from"}
              value={promoState.isPromoActive ? promoState.discountedPriceStr : p.price}
            />
            <Spec label="Monthly" value={p.monthly} />
            <Spec label="Elevation" value={p.elevation} />
            <Spec label="Category" value={p.category} />
          </div>

          {/* Conditional Specs */}
          {p.category !== "Lot" ? (
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-gold-600/20 bg-gold-50/60 p-4 sm:grid-cols-4 text-xs">
              <div className="flex items-center gap-2 text-highlands-900 font-medium">
                <Bed className="h-4 w-4 text-gold-700" />
                <span>{p.beds}</span>
              </div>
              <div className="flex items-center gap-2 text-highlands-900 font-medium">
                <Bath className="h-4 w-4 text-gold-700" />
                <span>{p.baths || "Ensuite Baths"}</span>
              </div>
              <div className="flex items-center gap-2 text-highlands-900 font-medium">
                <Maximize2 className="h-4 w-4 text-gold-700" />
                <span>{p.floorArea || p.area} Floor</span>
              </div>
              <div className="text-pine-700 font-medium">
                <span className="text-gold-800">{p.parking || "Parking Included"}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-gold-600/20 bg-gold-50/60 p-4 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-highlands-900 font-semibold">
                <strong>Lot Cut:</strong> {p.lotArea || p.area}
              </span>
              <span className="text-gold-800 font-medium">Clean Titled · Immediate Mountain Home Construction</span>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-xs font-bold tracking-wider text-highlands-900 uppercase">
              Key Highlights &amp; Inclusions
            </h4>
            <ul className="mt-3 space-y-2.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[14px] text-pine-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-highlands-600" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookTripping();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-6 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>
                {promoState.isPromoActive
                  ? "Lock Promo Price & Book Site Tripping"
                  : "Book VIP Tripping for this Unit"}
              </span>
            </button>
            <a
              href="#cta"
              onClick={onClose}
              className="flex-1 rounded-full border border-highlands-900/15 bg-white px-6 py-3.5 text-center text-sm font-semibold text-highlands-900 transition-colors hover:bg-cream-50"
            >
              Request 0% Interest Computation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Properties() {
  const { properties, openSiteTrippingModal } = useSite();
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Property | null>(null);

  // 1-second interval timer to update all promo countdowns in real-time
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const list = useMemo(
    () => (filter === "All" ? properties : properties.filter((p) => p.category === filter)),
    [filter, properties],
  );

  return (
    <section id="properties" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-32 bg-cream-50/40">
      <div className="hairline absolute inset-x-0 top-0 h-px" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Featured Highlands Portfolio"
            title="Explore our available"
            accent="lots, condos & townhouses."
            copy="Direct developer pricing across The Highlands, The Midlands, Midlands West, and The Greenlands. Jewel provides transparent computations with stackable limited-time promos and 0% interest schemes up to 60 months."
          />

          <Reveal delay={220} className="shrink-0">
            <div
              role="tablist"
              aria-label="Filter properties by category"
              className="flex flex-wrap gap-1.5 rounded-full border border-highlands-900/10 bg-white p-1.5 shadow-xs"
            >
              {filters.map((f) => {
                const selected = filter === f;
                return (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={selected}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all duration-300",
                      selected
                        ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                        : "text-highlands-900/70 hover:bg-cream-50 hover:text-highlands-900",
                    )}
                  >
                    {f === "All" ? "All Categories" : f === "Lot" ? "Lots" : f === "Condo" ? "Condos" : "Townhouses"}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <div
              key={p.id}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <PropertyCard
                p={p}
                onOpen={() => setActive(p)}
                onBookTripping={() => openSiteTrippingModal(p.name)}
                currentTime={currentTime}
              />
            </div>
          ))}
        </div>

        <Reveal delay={120} className="mt-14 text-center">
          <div className="inline-flex flex-col items-center justify-center gap-3 rounded-2xl border border-highlands-900/10 bg-white px-6 py-4 shadow-xs sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2 text-xs font-bold text-highlands-900 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-gold-600" /> Looking for unreleased inventory across the 4 districts?
            </span>
            <button
              type="button"
              onClick={() => openSiteTrippingModal("Unreleased Q1 Inventory List")}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-4 py-2 text-xs font-semibold text-highlands-950 transition-transform hover:-translate-y-0.5 shadow-xs"
            >
              Request Masterplan &amp; Price List <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Reveal>
      </div>

      {active && (
        <DetailModal
          p={active}
          onClose={() => setActive(null)}
          onBookTripping={() => openSiteTrippingModal(active.name)}
          currentTime={currentTime}
        />
      )}
    </section>
  );
}
