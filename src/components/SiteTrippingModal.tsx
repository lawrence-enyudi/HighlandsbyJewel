import { useState, useEffect, type FormEvent } from "react";
import { useSite } from "@/context/SiteContext";
import {
  Calendar,
  Clock,
  Users,
  Car,
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  KeyRound,
  Bus,
} from "lucide-react";

const TIME_SLOTS = [
  "09:30 AM (Morning Mountain Breeze Tour)",
  "01:30 PM (Mid-Day Country Club Tour)",
  "03:30 PM (Golden Hour Sunset Tour)",
];

const GUEST_OPTIONS = [
  "1-2 Persons (Couple / Solo Buyer)",
  "3-4 Persons (Small Family)",
  "5+ Persons (Family Group)",
];

const BUDGET_OPTIONS = [
  "₱7M – ₱12M (Condo Residences & Entry Lots)",
  "₱13M – ₱25M (Prime Highlands Lots)",
  "₱25M – ₱60M+ (Fairway Townhomes & Luxury Estates)",
  "Open / Seeking Investment Advice",
];

const PROPERTY_OPTIONS = [
  { value: "All", label: "All Properties (Lots, Condos & Townhouses)" },
  { value: "Lots", label: "Lots (Custom Mountain Build)" },
  { value: "Condos", label: "Condos (Turnkey Mountain Living)" },
  { value: "Townhouses", label: "Townhouses (Fairway & Enclave Luxury)" },
] as const;

export default function SiteTrippingModal() {
  const {
    isSiteTrippingModalOpen,
    closeSiteTrippingModal,
    selectedTrippingProperty,
    addLead,
    settings,
  } = useSite();

  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [guestCount, setGuestCount] = useState(GUEST_OPTIONS[0]);

  // Vehicle Registration for Gate 2
  const [carModel, setCarModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [useVanAtSMO, setUseVanAtSMO] = useState(true);

  const [propertyInterest, setPropertyInterest] = useState<"All" | "Lots" | "Condos" | "Townhouses">("All");
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[1]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedTrippingProperty) {
      if (selectedTrippingProperty.toLowerCase().includes("lot")) {
        setPropertyInterest("Lots");
      } else if (selectedTrippingProperty.toLowerCase().includes("condo")) {
        setPropertyInterest("Condos");
      } else if (selectedTrippingProperty.toLowerCase().includes("townhouse") || selectedTrippingProperty.toLowerCase().includes("villa") || selectedTrippingProperty.toLowerCase().includes("cabin")) {
        setPropertyInterest("Townhouses");
      } else {
        setPropertyInterest("All");
      }
    } else {
      setPropertyInterest("All");
    }
  }, [selectedTrippingProperty, isSiteTrippingModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSiteTrippingModal();
    };
    if (isSiteTrippingModalOpen) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isSiteTrippingModalOpen, closeSiteTrippingModal]);

  if (!isSiteTrippingModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !carModel) return;

    addLead({
      name,
      phone,
      email: email || "Not provided",
      preferredDate,
      preferredTime,
      guestCount,
      carModel,
      plateNumber: plateNumber || "To follow / Conduction",
      useVanAtSMO,
      propertyInterest,
      budgetRange,
      notes: notes || "No specific request noted.",
    });

    setStep("success");
  };

  const handleResetAndClose = () => {
    setStep("form");
    closeSiteTrippingModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tripping-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleResetAndClose}
      />

      <div
        className="animate-scale-in relative z-10 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-highlands-900/10 bg-white p-6 shadow-2xl sm:p-8 text-highlands-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-cream-50 text-highlands-900 transition-colors hover:bg-cream-100"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "form" ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-600/30 bg-gold-50 px-3.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-gold-800 uppercase shadow-2xs">
                <KeyRound className="h-3.5 w-3.5 text-gold-600" /> Exclusive Gate Pass Clearance
              </span>
              <span className="text-xs text-pine-600 font-medium">100% Free · No Obligation</span>
            </div>

            <h2
              id="tripping-modal-title"
              className="mt-3 font-display text-2xl font-normal text-highlands-900 sm:text-3xl"
            >
              Book Your Private Highlands Tour
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-pine-700">
              Meet <strong className="font-semibold text-highlands-900">{settings.specialistName}</strong>{" "}
              (Property Specialist) at our <strong>Sales Marketing Office (SMO)</strong>. Please
              register your vehicle below so we can endorse your exclusive <strong>gate pass</strong>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Date & Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    <Calendar className="h-3.5 w-3.5 text-gold-600" /> Preferred Tour Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[14px] text-highlands-900 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    <Clock className="h-3.5 w-3.5 text-gold-600" /> Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[13.5px] text-highlands-900 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gate 2 Vehicle Registration Box */}
              <div className="rounded-2xl border border-gold-500/30 bg-gold-50/60 p-4.5">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gold-700" />
                  <span className="text-xs font-bold tracking-wider text-gold-800 uppercase">
                    Gate Pass Vehicle Registration
                  </span>
                </div>
                <p className="mt-1 text-xs text-pine-700 leading-relaxed">
                  All visitors must register their vehicle make and model to be granted entry by
                  estate security for your <strong>gate pass</strong>.
                </p>

                <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-highlands-900 uppercase tracking-wider">
                      Car Make &amp; Model *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota Fortuner / Honda CR-V"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-3.5 py-2.5 text-sm text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-highlands-900 uppercase tracking-wider">
                      Plate No. / Conduction <span className="text-pine-600 normal-case font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NBD 1234 / CS # 1204"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-3.5 py-2.5 text-sm text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* SMO to Van transfer notice */}
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-highlands-900/10 bg-white p-3 transition-colors hover:bg-cream-50 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={useVanAtSMO}
                    onChange={(e) => setUseVanAtSMO(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-highlands-900/20 text-gold-600 focus:ring-gold-400"
                  />
                  <div className="text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-highlands-900">
                      <Bus className="h-3.5 w-3.5 text-gold-700" /> Transfer to Highlands Van at the SMO (Sales Marketing Office)
                    </span>
                    <p className="mt-0.5 text-[11.5px] text-pine-700 leading-relaxed">
                      Park at the SMO and Jewel will drive you in our comfortable Highlands van so you don't have to navigate mountain roads yourself.
                    </p>
                  </div>
                </label>
              </div>

              {/* Properties to Inspect */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    <Building2 className="h-3.5 w-3.5 text-gold-600" /> Properties to Inspect *
                  </label>
                  <select
                    value={propertyInterest}
                    onChange={(e) =>
                      setPropertyInterest(
                        e.target.value as "All" | "Lots" | "Condos" | "Townhouses",
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[13.5px] text-highlands-900 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  >
                    {PROPERTY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    <Users className="h-3.5 w-3.5 text-gold-600" /> Number of Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[13.5px] text-highlands-900 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  >
                    {GUEST_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Gabriel Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[14px] text-highlands-900 placeholder-pine-600/40 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    Mobile / Viber / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +63 917 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[14px] text-highlands-900 placeholder-pine-600/40 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[14px] text-highlands-900 placeholder-pine-600/40 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                    Target Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-3 text-[13.5px] text-highlands-900 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  >
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.16em] text-highlands-900 uppercase">
                  Special Notes / Inquiries (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Preferred district, lot size, target build timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full resize-none rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-[14px] text-highlands-900 placeholder-pine-600/40 transition-colors focus:border-gold-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-4 text-[14px] font-semibold text-highlands-950 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <KeyRound className="h-4 w-4" /> Issue My VIP Gate Pass
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-pine-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-highlands-600" /> Direct Tagaytay Highlands Sales
                </span>
                <span>Gate pass confirmation sent via WhatsApp/SMS</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-highlands-600/30 bg-highlands-50 text-highlands-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <span className="mt-6 inline-block text-[11px] font-bold tracking-[0.2em] text-gold-700 uppercase">
              Gate Pass Processing
            </span>
            <h3 className="mt-2 font-display text-2xl font-normal text-highlands-900 sm:text-3xl">
              You're all set to visit Tagaytay Highlands!
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-pine-700">
              Thank you, <strong className="text-highlands-900">{name}</strong>.{" "}
              {settings.specialistName} will endorse your{" "}
              <strong className="text-gold-800">{carModel}</strong> to{" "}
              <strong className="text-highlands-900">estate gate security</strong> and meet you at the{" "}
              <strong className="text-highlands-900">Sales Marketing Office (SMO)</strong> on{" "}
              <strong className="text-highlands-900">{preferredDate}</strong>.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-highlands-900/10 bg-cream-50 p-5 text-left shadow-2xs">
              <p className="text-[11px] font-bold tracking-wider text-pine-600 uppercase">
                Property Specialist Contact
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-highlands-900">{settings.specialistName}</p>
                  <p className="text-xs text-pine-600">{settings.specialistRole}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-highlands-900/10 bg-white text-highlands-900 shadow-2xs transition-colors hover:bg-cream-100"
                    title="Call Jewel"
                  >
                    <Phone className="h-4 w-4 text-gold-600" />
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I%20just%20booked%20a%20site%20tripping%20for%20${encodeURIComponent(preferredDate)}.%20My%20car%20is%20${encodeURIComponent(carModel)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-highlands-600/30 bg-highlands-50 text-highlands-700 shadow-2xs transition-colors hover:bg-highlands-100"
                    title="WhatsApp Jewel"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I%20just%20booked%20a%20site%20tripping%20for%20${encodeURIComponent(preferredDate)}.%20My%20car%20is%20${encodeURIComponent(carModel)}.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-highlands-900 text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all hover:bg-highlands-800"
              >
                <MessageSquare className="h-4 w-4 text-gold-300" /> Message on WhatsApp / Viber
              </a>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-full border border-highlands-900/15 bg-white px-6 py-3 text-sm font-semibold text-highlands-900 transition-colors hover:bg-cream-50"
              >
                Back to properties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
