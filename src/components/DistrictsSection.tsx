import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { DISTRICTS_DATA, type DistrictInfo } from "@/data/communities";
import { Reveal, Eyebrow } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import {
  MapPin,
  Mountain,
  CalendarCheck,
  ChevronRight,
  Check,
  Layers,
} from "lucide-react";
import { cn } from "@/utils/cn";

const DISTRICT_IMG_PRESETS = [
  { name: "Misty Ridge Vista", url: "https://images.pexels.com/photos/19739231/pexels-photo-19739231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Pine Forest Hills", url: "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Cedar Cabins", url: "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Mountain Resort Pool", url: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Eco Farm Fields", url: "https://images.pexels.com/photos/14023023/pexels-photo-14023023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
];

export default function DistrictsSection() {
  const { openSiteTrippingModal, settings } = useSite();
  const [activeDistrictId, setActiveDistrictId] = useState<DistrictInfo["id"]>("highlands");

  const currentDistrict =
    DISTRICTS_DATA.find((d) => d.id === activeDistrictId) || DISTRICTS_DATA[0];

  const getDistrictPhoto = (id: DistrictInfo["id"]) => {
    if (id === "highlands") return settings.communityPhotos?.highlands || currentDistrict.coverImage;
    if (id === "midlands") return settings.communityPhotos?.midlands || currentDistrict.coverImage;
    if (id === "midlands-west") return settings.communityPhotos?.midlandsWest || currentDistrict.coverImage;
    if (id === "greenlands") return settings.communityPhotos?.greenlands || currentDistrict.coverImage;
    return currentDistrict.coverImage;
  };

  const fieldPrefix = `dist.${currentDistrict.id}`;

  return (
    <section
      id="communities"
      className="relative scroll-mt-24 overflow-hidden border-t border-highlands-900/8 bg-white py-16 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>The 4 Masterplanned Communities</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.5rem)] leading-[1.06] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
              <EditableText field="dist.headline.1" value="Four distinctive districts." />{" "}
              <em className="shimmer-text font-medium not-italic">
                <EditableText field="dist.headline.2" value="One grand mountain estate." />
              </em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 text-[15.5px] leading-relaxed text-pine-700 sm:text-[16.5px]">
              <EditableText
                field="dist.intro"
                value="Tagaytay Highlands is composed of four distinctive districts: The Highlands, The Midlands, The Midlands West, and The Greenlands."
              />
            </p>
          </Reveal>
        </div>

        {/* 4 District Switcher Tabs */}
        <Reveal delay={220} className="mt-10">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-highlands-900/10 bg-cream-50/80 p-2 sm:grid-cols-4 lg:rounded-full">
            {DISTRICTS_DATA.map((district) => {
              const isActive = activeDistrictId === district.id;
              return (
                <button
                  key={district.id}
                  type="button"
                  onClick={() => setActiveDistrictId(district.id)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl px-4 py-3 text-center transition-all duration-300 lg:rounded-full",
                    isActive
                      ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 font-semibold shadow-md"
                      : "text-highlands-900/70 hover:bg-white hover:text-highlands-900",
                  )}
                >
                  <span className="text-[13.5px] sm:text-sm font-display font-medium">
                    <EditableText field={`dist.${district.id}.tabname`} value={district.name} />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] mt-0.5 tracking-wider uppercase",
                      isActive ? "text-highlands-950 font-semibold" : "text-pine-600",
                    )}
                  >
                    <EditableText field={`dist.${district.id}.landareashort`} value={district.landArea} />
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active District Banner & Overview */}
        <div className="mt-10 overflow-hidden rounded-[32px] border border-highlands-900/10 bg-cream-50/50 shadow-md">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Content */}
            <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-600/30 bg-gold-50 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-gold-800 uppercase shadow-xs">
                    <Mountain className="h-3.5 w-3.5" />
                    <EditableText field={`${fieldPrefix}.elevation`} value={currentDistrict.elevation} />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-highlands-900/10 bg-white px-3 py-1 text-[11px] text-pine-700 font-medium shadow-xs">
                    <MapPin className="h-3 w-3 text-gold-600" />
                    <EditableText field={`${fieldPrefix}.landarea`} value={`Land Area: ${currentDistrict.landArea}`} />
                  </span>
                </div>

                <h3 className="mt-4 font-display text-3xl font-normal text-highlands-900 sm:text-4xl">
                  <EditableText field={`${fieldPrefix}.name`} value={currentDistrict.name} />
                </h3>
                <p className="mt-1 text-sm font-semibold text-gold-700">
                  <EditableText field={`${fieldPrefix}.tagline`} value={currentDistrict.tagline} />
                </p>

                <p className="mt-4 text-[14.5px] leading-relaxed text-pine-700">
                  <EditableText field={`${fieldPrefix}.desc`} value={currentDistrict.description} />
                </p>

                {/* Developed Communities */}
                <div className="mt-6 border-t border-highlands-900/8 pt-5">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-gold-600" />
                    <p className="text-xs font-semibold tracking-wider text-highlands-900 uppercase">
                      <EditableText
                        field={`${fieldPrefix}.communities.label`}
                        value={`Developed Communities in ${currentDistrict.name}`}
                      />
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {currentDistrict.developedCommunities.map((comm, idx) => (
                      <span
                        key={comm}
                        className="rounded-full border border-highlands-900/10 bg-white px-3 py-1 text-[11.5px] text-highlands-900 font-medium shadow-2xs"
                      >
                        <EditableText field={`${fieldPrefix}.community.${idx}`} value={comm} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-highlands-900/8 pt-5">
                  <p className="text-xs font-semibold tracking-wider text-highlands-900 uppercase">
                    <EditableText
                      field={`${fieldPrefix}.amenities.label`}
                      value="Featured District Amenities & Landmarks"
                    />
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {currentDistrict.featuredAmenities.map((amenity, idx) => (
                      <li
                        key={amenity}
                        className="flex items-start gap-2 text-xs text-pine-700 font-medium"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-highlands-600 mt-0.5" />
                        <EditableText field={`${fieldPrefix}.amenity.${idx}`} value={amenity} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-highlands-900/8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openSiteTrippingModal(`Tour ${currentDistrict.name}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-6 py-3 text-xs font-semibold text-highlands-950 transition-transform hover:-translate-y-0.5 shadow-md"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <EditableText field={`${fieldPrefix}.cta`} value={`Book VIP Tour for ${currentDistrict.name}`} />
                </button>
              </div>
            </div>

            {/* Right District Cover Image — Editable */}
            <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-full overflow-hidden">
              <EditableImage
                field={`img:${fieldPrefix}.cover`}
                src={getDistrictPhoto(currentDistrict.id)}
                alt={currentDistrict.name}
                className="h-full w-full min-h-[220px] sm:min-h-[300px]"
                imgClassName="h-full w-full object-cover"
                presets={DISTRICT_IMG_PRESETS}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-cream-50/70 lg:via-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl p-4 bg-white/95 backdrop-blur-md border border-white/40 shadow-md">
                  <p className="text-[11px] font-bold text-gold-700 uppercase tracking-wider">
                    <EditableText field={`${fieldPrefix}.theme.label`} value="District Theme & Architecture" />
                  </p>
                  <p className="mt-1 text-xs text-pine-700">
                    <EditableText field={`${fieldPrefix}.theme`} value={currentDistrict.theme} />
                  </p>
                </div>
              </EditableImage>
            </div>
          </div>
        </div>

        {/* Featured Projects under Current District */}
        <div className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                <EditableText field={`${fieldPrefix}.proj.label`} value="Featured Highlights" />
              </span>
              <h4 className="mt-1 font-display text-2xl font-normal text-highlands-900">
                <EditableText
                  field={`${fieldPrefix}.proj.heading`}
                  value={`Key Residential Enclaves in ${currentDistrict.name}`}
                />
              </h4>
            </div>
            <span className="text-xs text-pine-600 font-medium">
              <EditableText field={`${fieldPrefix}.proj.count`} value={`${currentDistrict.projects.length} Featured Enclaves`} />
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentDistrict.projects.map((proj, pi) => {
              const pfx = `${fieldPrefix}.proj.${pi}`;
              return (
                <div
                  key={proj.name}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-highlands-900/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lg"
                >
                  <EditableImage
                    field={`img:${pfx}.img0`}
                    src={proj.images[0]}
                    alt={proj.name}
                    className="relative aspect-[16/10] overflow-hidden"
                    imgClassName="h-full w-full object-cover"
                    presets={DISTRICT_IMG_PRESETS}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full border border-gold-400/40 bg-white/95 px-3 py-0.5 text-[10px] font-bold text-gold-800 uppercase backdrop-blur-md shadow-xs">
                      <EditableText field={`${pfx}.type`} value={proj.type} />
                    </span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h5 className="font-display text-lg font-medium text-white">
                        <EditableText field={`${pfx}.name`} value={proj.name} />
                      </h5>
                      <p className="text-[11.5px] text-gold-300 font-semibold">
                        <EditableText field={`${pfx}.price`} value={proj.priceRange} />
                      </p>
                    </div>
                  </EditableImage>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-pine-600 uppercase font-semibold tracking-wider">
                      <EditableText field={`${pfx}.sizes`} value={proj.sizes} />
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-pine-700 line-clamp-3">
                      <EditableText field={`${pfx}.desc`} value={proj.description} />
                    </p>

                    <div className="mt-4 flex-1 space-y-1.5 border-t border-highlands-900/8 pt-3">
                      {proj.highlights.map((hl, hi) => (
                        <p key={hl} className="flex items-center gap-2 text-[11px] text-highlands-900 font-medium">
                          <Check className="h-3 w-3 text-highlands-600 shrink-0" />
                          <EditableText field={`${pfx}.hl.${hi}`} value={hl} />
                        </p>
                      ))}
                    </div>

                    <div className="mt-5 pt-3 border-t border-highlands-900/8 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openSiteTrippingModal(`${proj.name} (${proj.type})`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 transition-colors hover:text-gold-900"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" />
                        <EditableText field={`${pfx}.cta`} value="Book Site Tripping" />
                      </button>
                      <ChevronRight className="h-4 w-4 text-gold-600 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
