import { Plus, Trash2 } from "lucide-react";
import type { PaymentTerm } from "@/context/SiteContext";
import { createPaymentTerm } from "@/utils/paymentComputation";
import { cn } from "@/utils/cn";

const BALANCE_TYPES: { value: PaymentTerm["balanceType"]; label: string }[] = [
  { value: "monthly", label: "Monthly Installment" },
  { value: "lumpsum", label: "Lumpsum after N months" },
  { value: "turnover", label: "Upon Turnover" },
  { value: "lumpsum_or_turnover", label: "Lumpsum or Turnover (whichever first)" },
];

type PaymentSchemeEditorProps = {
  terms: PaymentTerm[];
  onChange: (terms: PaymentTerm[]) => void;
};

export default function PaymentSchemeEditor({ terms, onChange }: PaymentSchemeEditorProps) {
  const updateTerm = (id: string, patch: Partial<PaymentTerm>) => {
    onChange(terms.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeTerm = (id: string) => {
    onChange(terms.filter((t) => t.id !== id));
  };

  const addCustomTerm = () => {
    onChange([
      ...terms,
      createPaymentTerm({
        label: "Custom Payment Scheme",
        spotPercent: 20,
        balanceType: "monthly",
        balanceMonths: 36,
        interestRate: 0,
      }),
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-highlands-900">
          Payment Schemes ({terms.length})
        </h4>
        <button
          type="button"
          onClick={addCustomTerm}
          className="inline-flex items-center gap-1 rounded-lg border border-gold-400/40 bg-gold-50 px-2.5 py-1 text-[11px] font-semibold text-gold-800 hover:bg-gold-100"
        >
          <Plus className="h-3 w-3" /> Add Custom Scheme
        </button>
      </div>

      <div className="space-y-3">
        {terms.map((term) => (
          <div
            key={term.id}
            className={cn(
              "rounded-xl border p-3 space-y-3",
              term.isPreset ? "border-highlands-900/10 bg-cream-50/50" : "border-gold-400/30 bg-gold-50/30",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Scheme Label</label>
                  <input
                    type="text"
                    value={term.label}
                    onChange={(e) => updateTerm(term.id, { label: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                    placeholder="e.g. 20% Spot, 80% Lumpsum after 36 months, 0% interest"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Spot %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={term.spotPercent}
                    onChange={(e) => updateTerm(term.id, { spotPercent: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Deferred DP %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={term.dpSpreadPercent || 0}
                    onChange={(e) => updateTerm(term.id, { dpSpreadPercent: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">DP Months</label>
                  <input
                    type="number"
                    min={0}
                    value={term.dpSpreadMonths || 0}
                    onChange={(e) => updateTerm(term.id, { dpSpreadMonths: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Balance Type</label>
                  <select
                    value={term.balanceType}
                    onChange={(e) =>
                      updateTerm(term.id, { balanceType: e.target.value as PaymentTerm["balanceType"] })
                    }
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  >
                    {BALANCE_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Months / Timing</label>
                  <input
                    type="number"
                    min={0}
                    value={term.balanceMonths}
                    onChange={(e) => updateTerm(term.id, { balanceMonths: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Interest %</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={term.interestRate}
                    onChange={(e) => updateTerm(term.id, { interestRate: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Term Discount %</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={term.termDiscountPercent}
                    onChange={(e) => updateTerm(term.id, { termDiscountPercent: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Extra Discount %</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={term.extraDiscountPercent}
                    onChange={(e) => updateTerm(term.id, { extraDiscountPercent: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Other Charges %</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={term.otherChargesPercent}
                    onChange={(e) => updateTerm(term.id, { otherChargesPercent: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Reservation Fee</label>
                  <input
                    type="number"
                    min={0}
                    value={term.reservationFee}
                    onChange={(e) => updateTerm(term.id, { reservationFee: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-highlands-900">Conditions / Notes</label>
                  <textarea
                    rows={2}
                    value={term.conditions || ""}
                    onChange={(e) => updateTerm(term.id, { conditions: e.target.value })}
                    className="mt-1 w-full resize-none rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                    placeholder="e.g. 80% Spot, 20% after 36 months or upon turnover, whichever comes first"
                  />
                </div>
              </div>
              {!term.isPreset && (
                <button
                  type="button"
                  onClick={() => removeTerm(term.id)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  aria-label="Remove scheme"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {term.isPreset && (
              <p className="text-[10px] text-pine-600">Common preset scheme — edit percentages as needed for this project.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
