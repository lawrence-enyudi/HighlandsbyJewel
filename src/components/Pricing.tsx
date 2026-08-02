import { Reveal, SectionHeading } from "./Reveal";
import { EditableText } from "./editor/Editable";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/utils/cn";
import { Check, CalendarCheck, MessageCircle } from "lucide-react";

export default function Pricing() {
  const { settings, openSiteTrippingModal } = useSite();

  const tiersList =
    settings.ownershipTiers && settings.ownershipTiers.length > 0 ? settings.ownershipTiers : [];

  const inferTierAction = (tierName: string, action?: string) => {
    if (action) return action;
    const lower = tierName.toLowerCase();
    if (lower.includes("spot") || lower.includes("cash")) return "spotCash";
    if (lower.includes("0%") || lower.includes("deferred") || lower.includes("interest")) return "zeroComputation";
    if (lower.includes("bank")) return "bankComputation";
    return "tripping";
  };

  const handleTierAction = (tierName: string, action?: string) => {
    const resolved = inferTierAction(tierName, action);

    if (resolved === "spotCash") {
      const msg = encodeURIComponent(
        `Hi Jewel! I'm interested in the Spot Cash terms for Tagaytay Highlands. Could you send me the latest cash discount, promo, and available units/lots?`,
      );
      window.open(
        `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${msg}`,
        "_blank",
      );
    } else if (resolved === "zeroComputation") {
      const msg = encodeURIComponent(
        `Hi Jewel! Please send me a 0% interest computation for Tagaytay Highlands. I want to know the down payment, monthly schedule, and current promos.`,
      );
      window.open(
        `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${msg}`,
        "_blank",
      );
    } else if (resolved === "bankComputation") {
      const msg = encodeURIComponent(
        `Hi Jewel! Please send me a bank financing computation for Tagaytay Highlands. I want to compare the down payment, monthly amortization, and accredited bank options (BDO, BPI, Metrobank, Security Bank).`,
      );
      window.open(
        `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${msg}`,
        "_blank",
      );
    } else if (resolved === "inquire") {
      document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      openSiteTrippingModal(`${tierName} Option`);
    }
  };

  const actionIcon = (action?: string) => {
    if (action === "spotCash" || action === "zeroComputation" || action === "bankComputation" || action === "whatsapp") return <MessageCircle className="h-4 w-4" />;
    return <CalendarCheck className="h-4 w-4" />;
  };

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden border-y border-highlands-900/8 bg-cream-50/60 py-16 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Ownership terms"
          title="Three flexible paths to"
          accent="Tagaytay Highlands."
          copy="Transparent, developer-direct terms. 0% interest schemes up to 60 months, bank financing assistance, and zero hidden markups."
        />

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
          {tiersList.map((t, i) => (
            <Reveal
              key={t.id || t.name}
              delay={i * 120}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500 sm:p-8",
                t.featured
                  ? "border-gold-500/40 bg-gradient-to-b from-gold-50/80 via-white to-white shadow-md lg:-translate-y-4"
                  : "border-highlands-900/10 bg-white shadow-2xs hover:-translate-y-1.5 hover:border-gold-500/30 hover:shadow-md",
              )}
            >
              <div className="relative flex items-center justify-between">
                <h3 className="font-display text-xl font-normal text-highlands-900">
                  <EditableText field={`tier.${i}.name`} value={t.name} />
                </h3>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase",
                    t.featured
                      ? "border-gold-500 bg-gold-400/20 text-gold-800"
                      : "border-highlands-900/12 bg-cream-50 text-pine-700",
                  )}
                >
                  <EditableText field={`tier.${i}.tag`} value={t.tag} />
                </span>
              </div>

              <div className="relative mt-6 flex items-baseline gap-2">
                <span className="font-display text-[clamp(2rem,4.5vw,2.75rem)] leading-none font-normal text-highlands-900">
                  <EditableText field={`tier.${i}.price`} value={t.price} />
                </span>
              </div>
              <p className="relative mt-1.5 text-[12px] tracking-wide text-pine-600 uppercase font-medium">
                <EditableText field={`tier.${i}.unit`} value={t.unit} />
              </p>

              <p className="relative mt-5 text-[13.5px] leading-relaxed text-pine-700">
                <EditableText field={`tier.${i}.copy`} value={t.copy} />
              </p>

              <ul className="relative mt-6 flex-1 space-y-3 border-t border-highlands-900/8 pt-6">
                {t.perks.map((p, pi) => (
                  <li key={`${t.id}-${pi}`} className="flex items-start gap-3 text-[13.5px] text-highlands-900">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        t.featured ? "text-gold-700" : "text-highlands-600",
                      )}
                    />
                    <EditableText field={`tier.${i}.perk.${pi}`} value={p} />
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleTierAction(t.name, t.action)}
                className={cn(
                  "relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
                  t.featured
                    ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-md"
                    : "border border-highlands-900/15 bg-white text-highlands-900 hover:bg-cream-50",
                )}
              >
                {actionIcon(inferTierAction(t.name, t.action))}
                <EditableText field={`tier.${i}.cta`} value={t.cta} />
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-[13px] text-pine-600 font-medium">
            <EditableText
              field="pricing.disclaimer"
              value="All computations are direct from Tagaytay Highlands Sales. Jewel will prepare your personalized payment schedule and amortization table during your site tripping."
            />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
