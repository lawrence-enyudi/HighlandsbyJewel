import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { Reveal } from "./Reveal";
import { EditableImage, EditableText } from "./editor/Editable";
import { CalendarCheck, Expand, MapPinned, Navigation, X } from "lucide-react";

const DEFAULT_MAP = "/images/Highlands%20Map.jpg";

const MAP_PRESETS = [
  { name: "Tagaytay Highlands Digital Map", url: DEFAULT_MAP },
];

export default function DigitalMapSection() {
  const { openSiteTrippingModal, settings } = useSite();
  const mapSrc = settings.imageOverrides?.["digital.map"] || DEFAULT_MAP;
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <section
        id="digital-map"
        className="relative scroll-mt-24 overflow-hidden border-t border-highlands-900/8 bg-gradient-to-b from-highlands-950 to-highlands-900 py-16 sm:py-24"
      >
        {/* Ambient glow */}
        <div
          className="animate-drift pointer-events-none absolute -top-16 left-1/3 h-60 w-60 rounded-full bg-highlands-500/15 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="animate-floaty pointer-events-none absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-gold-500/12 blur-[90px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-gold-300 uppercase shadow-xs backdrop-blur-md">
                <MapPinned className="h-3.5 w-3.5" />
                Digital Estate Map
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.1] font-normal tracking-[-0.02em] text-white text-balance">
                <EditableText
                  field="map.heading.1"
                  value="Explore the entire Tagaytay Highlands"
                />{" "}
                <em className="shimmer-text font-medium not-italic">
                  <EditableText field="map.heading.2" value="at a glance." />
                </em>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-3 text-[14px] leading-relaxed text-highlands-100/70 sm:text-[15.5px]">
                <EditableText
                  field="map.copy"
                  value="See every residential enclave, golf course, restaurant, chapel, cable car, and amenity across The Highlands, The Midlands, Midlands West, and The Greenlands — spanning three provinces."
                />
              </p>
            </Reveal>
          </div>

          {/* Map Card */}
          <Reveal delay={200} className="mt-10">
            <div className="group relative overflow-hidden rounded-[20px] border border-white/15 bg-black/20 p-1.5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6)] sm:rounded-[28px] sm:p-2">
              <div className="relative overflow-hidden rounded-[14px] sm:rounded-[22px]">
                <EditableImage
                  field="digital.map"
                  src={mapSrc}
                  alt="Tagaytay Highlands Digital Estate Map showing The Highlands, The Midlands, Midlands West, and The Greenlands"
                  className="relative"
                  imgClassName="w-full object-cover sm:object-contain"
                  presets={MAP_PRESETS}
                >
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[14px] sm:rounded-[22px]" />
                </EditableImage>

                {/* Floating badges on map */}
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/30 bg-highlands-950/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md sm:left-5 sm:top-5">
                  <MapPinned className="h-3.5 w-3.5 text-gold-300" />
                  Tagaytay Highlands · 3 Provinces
                </div>

                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-highlands-950/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-highlands-800 sm:bottom-5 sm:right-5"
                >
                  <Expand className="h-3.5 w-3.5 text-gold-300" />
                  View Full Map
                </button>
              </div>
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={280}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openSiteTrippingModal("Full Estate Map Tour")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Map-Guided Site Tripping
              </button>
              <a
                href="#communities"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white shadow-xs backdrop-blur-md transition-colors hover:bg-white/15"
              >
                <Navigation className="h-4 w-4 text-gold-300" />
                Explore the 4 Communities
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fullscreen Map Lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-highlands-950/95 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen estate map"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="Close full-screen map"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={mapSrc}
            alt="Tagaytay Highlands Digital Estate Map — full resolution"
            className="max-h-[92vh] max-w-[96vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
