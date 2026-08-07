import { useSite } from "@/context/SiteContext";
import { Reveal, Eyebrow } from "./Reveal";
import { EditableText, EditableImage } from "./editor/Editable";
import {
  CalendarCheck,
  Phone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Award,
  HeartHandshake,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function AboutJewel() {
  const { settings, openSiteTrippingModal } = useSite();

  return (
    <section
      id="about-jewel"
      className="relative scroll-mt-24 overflow-hidden border-t border-highlands-900/8 bg-white py-16 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Photo Column */}
          <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
            <EditableImage
              field="img:jewel.photo"
              src={settings.specialistPhoto}
              alt={`${settings.specialistName} - Property Specialist at Tagaytay Highlands`}
              className="group relative overflow-hidden rounded-[32px] border border-highlands-900/12 shadow-[0_20px_50px_-15px_rgba(22,61,44,0.18)] bg-white"
              imgClassName="h-[320px] w-full object-cover object-top sm:h-[540px]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-highlands-950/10 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 rounded-2xl p-4.5 bg-white/95 backdrop-blur-md border border-white/40 shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.2em] text-gold-700 uppercase">
                      <Sparkles className="h-3 w-3" />
                      <EditableText field="jewel.badge" value="Dedicated On-Site Specialist" />
                    </span>
                    <h3 className="mt-1 font-display text-xl font-medium text-highlands-900">
                      <EditableText field="jewel.name" value={settings.specialistName} />
                    </h3>
                    <p className="text-xs text-pine-600 font-medium">
                      <EditableText field="jewel.role" value={settings.specialistRole} />
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I'd%20like%20to%20inquire%20about%20Tagaytay%20Highlands.`}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-10 w-10 place-items-center rounded-xl border border-highlands-600/30 bg-highlands-50 text-highlands-700 transition-colors hover:bg-highlands-100 shadow-xs"
                      title="WhatsApp Jewel"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-highlands-900/15 bg-white text-highlands-900 transition-colors hover:bg-cream-50 shadow-xs"
                      title="Call Jewel"
                    >
                      <Phone className="h-4 w-4 text-gold-600" />
                    </a>
                  </div>
                </div>
              </div>
            </EditableImage>

            {/* Floating credentials chip */}
            <div className="animate-floaty absolute -top-4 -right-4 hidden rounded-2xl px-4.5 py-3.5 bg-white border border-highlands-900/10 shadow-lg sm:block">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gold-50 text-gold-700 border border-gold-400/40">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-gold-800 uppercase">
                    <EditableText field="jewel.float.label" value="Official On-Site" />
                  </p>
                  <p className="text-xs font-semibold text-highlands-900">
                    <EditableText field="jewel.float.value" value="Gate Pass Processing" />
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy Column */}
          <div>
            <Reveal>
              <Eyebrow>Meet Your Specialist</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.4rem)] leading-[1.06] font-normal tracking-[-0.02em] text-highlands-900 text-balance">
                "<EditableText field="jewel.headline" value="I believe buying a mountain home should be" />{" "}
                <em className="shimmer-text font-medium not-italic">
                  <EditableText field="jewel.headline.accent" value="exciting & stress-free." />
                </em>"
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-5 text-[16px] leading-relaxed text-pine-700 sm:text-[17px]">
                <EditableText
                  field="jewel.intro"
                  value={`Hi, I'm Jewel! As an accredited property specialist at Tagaytay Highlands, I focus on what truly matters to buyers: complete clarity, direct developer pricing, and a warm, pressure-free site tour experience.`}
                />
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-pine-600">
                <EditableText field="jewel.story" value={settings.specialistStory} />
              </p>
            </Reveal>

            {/* 3 Commitments */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: KeyRound,
                  t: "Exclusive Gate Pass",
                  d: "I handle security clearance so your entry is 100% seamless.",
                  f: "jewel.commit.0",
                },
                {
                  icon: HeartHandshake,
                  t: "Zero Pressure",
                  d: "Explore at your own pace with transparent payment schedules.",
                  f: "jewel.commit.1",
                },
                {
                  icon: ShieldCheck,
                  t: "0% Interest Terms",
                  d: "Direct developer inventory with flexible installment options.",
                  f: "jewel.commit.2",
                },
              ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <Reveal
                    key={item.f}
                    delay={200 + i * 80}
                    className="rounded-2xl border border-highlands-900/8 bg-cream-50/70 p-4.5 shadow-2xs"
                  >
                    <IconComponent className="h-5 w-5 text-gold-700" />
                    <h4 className="mt-3 font-display text-[15px] font-medium text-highlands-900">
                      <EditableText field={`${item.f}.title`} value={item.t} />
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-pine-600 font-medium">
                      <EditableText field={`${item.f}.desc`} value={item.d} />
                    </p>
                  </Reveal>
                );
              })}
            </div>

            {/* Personal Quote Card */}
            <Reveal delay={450} className="mt-8">
              <div className="rounded-2xl border border-gold-500/30 bg-gold-50/70 p-5 shadow-xs">
                <p className="font-display text-[15px] italic text-highlands-900 sm:text-[16px]">
                  "<EditableText field="jewel.quote" value={settings.specialistQuote} />"
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gold-800 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-highlands-600" />
                  <span>Jewel Villafranca · Accredited Property Specialist</span>
                </div>
              </div>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal delay={520} className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openSiteTrippingModal()}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-4 text-sm font-semibold text-highlands-950 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <CalendarCheck className="h-4 w-4" />
                <span className="relative z-10">
                  <EditableText field="jewel.cta.primary" value="Schedule VIP Tour with Jewel" />
                </span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I%20saw%20your%20Tagaytay%20Highlands%20website%20and%20would%20like%20to%20ask%20a%20question.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-highlands-900/15 bg-white px-6 py-4 text-sm font-semibold text-highlands-900 shadow-xs transition-colors hover:bg-cream-50"
              >
                <MessageSquare className="h-4 w-4 text-highlands-600" />
                <span>
                  <EditableText field="jewel.cta.secondary" value="Message Jewel on WhatsApp" />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
