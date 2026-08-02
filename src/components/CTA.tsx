import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { useSite } from "@/context/SiteContext";
import { EditableText, EditableImage } from "./editor/Editable";
import { cn } from "@/utils/cn";
import { Check, Phone, MessageSquare, ShieldCheck, KeyRound } from "lucide-react";

const interests: { value: "All" | "Lots" | "Condos" | "Townhouses"; label: string }[] = [
  { value: "All", label: "All Properties" },
  { value: "Lots", label: "Lots (Custom Build)" },
  { value: "Condos", label: "Condominium Suites" },
  { value: "Townhouses", label: "Fairway Townhomes" },
];

export default function CTA() {
  const { settings, addLead } = useSite();
  const [interest, setInterest] = useState<"All" | "Lots" | "Condos" | "Townhouses">("All");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carModel, setCarModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !carModel) return;

    addLead({
      name,
      phone,
      email: email || "Not provided",
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "Flexible / Needs Coordination",
      guestCount: "Direct Inquiry Form",
      carModel,
      plateNumber: plateNumber || "To follow",
      useVanAtSMO: true,
      propertyInterest: interest,
      budgetRange: "General Inquiry",
      notes: note || "Submitted from bottom contact form",
    });

    setSent(true);
  };

  return (
    <section id="cta" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-32 bg-white border-t border-highlands-900/8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-highlands-800/40 bg-gradient-to-br from-highlands-900 via-highlands-950 to-highlands-900 p-7 text-white shadow-2xl sm:p-12">
          <div
            className="grain pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
            aria-hidden="true"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-gold-300 uppercase shadow-xs">
                  Book Your Visit
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.1rem)] leading-[1.08] font-normal tracking-[-0.02em] text-white text-balance">
                  <EditableText field="cta.headline.1" value="Let's tour Tagaytay Highlands" />{" "}
                  <em className="shimmer-text font-medium not-italic">
                    <EditableText field="cta.headline.2" value="together." />
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-highlands-100/80">
                  <EditableText field="cta.bio" value={settings.specialistBio} />
                </p>
              </Reveal>

              <Reveal delay={220}>
                <ul className="mt-7 space-y-3.5">
                  {[
                    "Pre-registered exclusive gate pass for your vehicle",
                    "Meet Jewel at the Sales Marketing Office (SMO) & transfer to Highlands Van",
                    "Direct developer computation with zero markup & 0% interest schemes",
                  ].map((x, xi) => (
                    <li key={x} className="flex items-start gap-3 text-[14px] text-white/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                      <EditableText field={`cta.bullet.${xi}`} value={x} />
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-9 flex flex-col gap-4 border-t border-white/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <EditableImage
                      field="img:cta.avatar"
                      src={settings.specialistPhoto}
                      alt={settings.specialistName}
                      className="h-12 w-12 rounded-full"
                      imgClassName="h-12 w-12 rounded-full object-cover border-2 border-gold-400/60 shadow-md"
                    />
                    <div>
                      <p className="text-[14.5px] font-semibold text-white">
                        {settings.specialistName}
                      </p>
                      <p className="text-[12px] text-gold-300">{settings.specialistRole}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 hover:text-gold-300"
                      title="Call Jewel"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I'm%20inquiring%20about%20Tagaytay%20Highlands%20properties.`}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-10 w-10 place-items-center rounded-xl border border-gold-400/40 bg-gold-400/20 text-gold-300 transition-colors hover:bg-gold-400/30"
                      title="WhatsApp / Viber"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180}>
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-xl sm:p-8"
              >
                <fieldset className="border-0 p-0">
                  <legend className="text-[11px] font-semibold tracking-[0.18em] text-gold-300 uppercase">
                    I'm interested in
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {interests.map((it) => (
                      <button
                        key={it.value}
                        type="button"
                        aria-pressed={interest === it.value}
                        onClick={() => setInterest(it.value)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300",
                          interest === it.value
                            ? "border-gold-400 bg-gold-400/20 text-gold-200"
                            : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white",
                        )}
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cta-name"
                      className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase"
                    >
                      Full Name *
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cta-phone"
                      className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase"
                    >
                      Mobile / WhatsApp *
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      required
                      placeholder="+63 917 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                </div>

                {/* Gate 2 Car Details */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cta-car"
                      className="block text-[11px] font-semibold tracking-[0.18em] text-gold-300 uppercase"
                    >
                      Car Make &amp; Model (for Gate Pass) *
                    </label>
                    <input
                      id="cta-car"
                      type="text"
                      required
                      placeholder="e.g. Fortuner / Montero"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gold-400/30 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cta-plate"
                      className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase"
                    >
                      Plate No. <span className="text-white/40 normal-case">(Optional)</span>
                    </label>
                    <input
                      id="cta-plate"
                      type="text"
                      placeholder="e.g. NBD 1234 / CS # 1204"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="cta-email"
                    className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="cta-note"
                    className="block text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase"
                  >
                    Preferred date / questions (Optional)
                  </label>
                  <textarea
                    id="cta-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Target move-in, preferred district, weekend vs weekday visit..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-[14px] text-white placeholder-white/40 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                  />
                </div>

                <button
                  type="submit"
                  className={cn(
                    "group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 text-sm font-semibold transition-all duration-400",
                    sent
                      ? "bg-highlands-500 text-white"
                      : "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-[0_8px_24px_-6px_rgba(184,134,40,0.8)] hover:-translate-y-0.5",
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {sent ? (
                      <>
                        <Check className="h-4 w-4" /> Request Sent! Jewel will message your gate
                        pass shortly
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" /> Book VIP Tripping &amp; Issue Gate Pass
                      </>
                    )}
                  </span>
                  {!sent && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                </button>

                <p className="mt-4 text-center text-[11.5px] leading-relaxed text-white/60">
                  <ShieldCheck className="inline h-3.5 w-3.5 text-gold-300 mr-1" />
                  Direct sales inquiry. Zero spam. 100% confidential.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
