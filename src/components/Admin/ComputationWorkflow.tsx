import { useMemo, useRef, useState } from "react";
import { X, Printer, Calculator } from "lucide-react";
import type { InventoryUnit, PaymentTerm, ProjectFile } from "@/context/SiteContext";
import ComputationSheet from "./ComputationSheet";
import {
  BUYER_TYPES,
  computePayment,
  formatDate,
  type ComputationDiscounts,
} from "@/utils/paymentComputation";

function formatLocation(unit: InventoryUnit): string {
  if (unit.kind === "unit") return unit.unitNumber ? `Unit ${unit.unitNumber}` : "—";
  const parts = [unit.block && `Blk ${unit.block}`, unit.lot && `Lot ${unit.lot}`].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

type ComputationWorkflowProps = {
  project: ProjectFile;
  unit: InventoryUnit;
  onClose: () => void;
};

export default function ComputationWorkflow({ project, unit, onClose }: ComputationWorkflowProps) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerType, setBuyerType] = useState<string>(BUYER_TYPES[0]);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [turnoverDate, setTurnoverDate] = useState("");
  const [selectedTermId, setSelectedTermId] = useState(project.paymentTerms[0]?.id || "");
  const [promoMode, setPromoMode] = useState<"none" | "with">("none");
  const [promoPercent, setPromoPercent] = useState(1);
  const [cashMode, setCashMode] = useState<"none" | "with">("none");
  const [cashType, setCashType] = useState<"percent" | "amount">("percent");
  const [cashValue, setCashValue] = useState(1.36);
  const [showResult, setShowResult] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const selectedTerm = project.paymentTerms.find((t) => t.id === selectedTermId);

  const needsTurnoverDate =
    selectedTerm?.balanceType === "turnover" || selectedTerm?.balanceType === "lumpsum_or_turnover";

  const discounts: ComputationDiscounts = useMemo(
    () => ({
      promoMode,
      promoPercent,
      cashMode,
      cashType,
      cashValue,
    }),
    [promoMode, promoPercent, cashMode, cashType, cashValue],
  );

  const computed = useMemo(() => {
    if (!selectedTerm || unit.tcp <= 0) return null;
    return computePayment({
      listPrice: unit.tcp,
      term: selectedTerm,
      startDate: new Date(startDate),
      turnoverDate: turnoverDate ? new Date(turnoverDate) : null,
      discounts,
    });
  }, [selectedTerm, unit.tcp, startDate, turnoverDate, discounts]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Payment Computation - ${project.name}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; padding: 20px; font-size: 11px; color: #122b28; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 8px; text-align: left; }
        th { background: #0f4a34; color: white; font-size: 9px; text-transform: uppercase; }
        tr:nth-child(even) { background: #f4faf7; }
        .text-right { text-align: right; }
        .font-bold { font-weight: 700; }
      </style></head><body>
      ${printRef.current.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-highlands-900/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-highlands-900/8 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-xl text-highlands-900">Payment Computation</h2>
            <p className="mt-0.5 text-xs text-pine-600">
              {project.name} · {formatLocation(unit)} · ₱{unit.tcp.toLocaleString("en-PH")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-cream-50 hover:bg-cream-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">
          <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-4">
            <p className="text-[11px] font-bold uppercase text-gold-800">Step 1 — Property (from inventory)</p>
            <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <div><span className="text-pine-600">Location:</span> <strong>{formatLocation(unit)}</strong></div>
              <div><span className="text-pine-600">Area:</span> <strong>{unit.area || "—"}</strong></div>
              <div><span className="text-pine-600">Status:</span> <strong>{unit.status}</strong></div>
              <div><span className="text-pine-600">TCP:</span> <strong className="text-gold-800">₱{unit.tcp.toLocaleString("en-PH")}</strong></div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-500/30 bg-gold-50/60 p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase text-gold-800">Step 2 — Buyer Details</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-[10px] font-bold uppercase">Buyer Name *</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. GELA"
                  className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase">Buyer Type</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                >
                  {BUYER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase text-gold-800">Step 3 — Discounts</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase">Promo Discount</label>
                <select
                  value={promoMode}
                  onChange={(e) => setPromoMode(e.target.value as "none" | "with")}
                  className="w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                >
                  <option value="none">None</option>
                  <option value="with">With</option>
                </select>
                {promoMode === "with" && (
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={promoPercent}
                    onChange={(e) => setPromoPercent(Number(e.target.value))}
                    placeholder="Promo discount %"
                    className="w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase">Cash Discount</label>
                <select
                  value={cashMode}
                  onChange={(e) => setCashMode(e.target.value as "none" | "with")}
                  className="w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                >
                  <option value="none">None</option>
                  <option value="with">With</option>
                </select>
                {cashMode === "with" && (
                  <div className="flex gap-2">
                    <select
                      value={cashType}
                      onChange={(e) => setCashType(e.target.value as "percent" | "amount")}
                      className="rounded-lg border border-highlands-900/15 bg-white px-2 py-2 text-xs"
                    >
                      <option value="percent">%</option>
                      <option value="amount">₱ Amount</option>
                    </select>
                    <input
                      type="number"
                      min={0}
                      step={cashType === "percent" ? 0.01 : 1}
                      value={cashValue}
                      onChange={(e) => setCashValue(Number(e.target.value))}
                      className="flex-1 rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase text-gold-800">Step 4 — Payment Scheme</p>
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(e.target.value)}
              className="w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-xs font-medium"
            >
              {project.paymentTerms.map((term: PaymentTerm) => (
                <option key={term.id} value={term.id}>
                  {term.label || "Unnamed Scheme"}
                </option>
              ))}
            </select>
            {needsTurnoverDate && (
              <div>
                <label className="text-[10px] font-bold uppercase">Expected Turnover Date (optional)</label>
                <input
                  type="date"
                  value={turnoverDate}
                  onChange={(e) => setTurnoverDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-2 text-xs"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!buyerName.trim() || !computed}
              onClick={() => setShowResult(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-5 py-2.5 text-xs font-semibold text-highlands-950 shadow-xs disabled:opacity-50"
            >
              <Calculator className="h-4 w-4" /> Generate Computation
            </button>
            {showResult && computed && (
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full border border-highlands-900/15 bg-white px-5 py-2.5 text-xs font-semibold"
              >
                <Printer className="h-4 w-4 text-gold-700" /> Print / Save PDF
              </button>
            )}
          </div>

          {showResult && computed && (
            <div ref={printRef}>
              <ComputationSheet
                computed={computed}
                projectName={project.name}
                buyerName={buyerName}
                buyerType={buyerType}
                blockLot={formatLocation(unit)}
                lotArea={unit.area}
                paymentTermLabel={selectedTerm?.label || ""}
                startDate={formatDate(new Date(startDate))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
