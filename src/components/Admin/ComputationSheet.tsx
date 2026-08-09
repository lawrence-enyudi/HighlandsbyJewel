import type { ComputedResult } from "@/utils/paymentComputation";
import { fmtCurrency, OFFICIAL_COMPUTATION_NOTES } from "@/utils/paymentComputation";
import { cn } from "@/utils/cn";

type ComputationSheetProps = {
  computed: ComputedResult;
  projectName: string;
  buyerName: string;
  buyerType: string;
  blockLot: string;
  lotArea: string;
  paymentTermLabel: string;
  startDate: string;
};

export default function ComputationSheet({
  computed,
  projectName,
  buyerName,
  buyerType,
  blockLot,
  lotArea,
  paymentTermLabel,
  startDate,
}: ComputationSheetProps) {
  return (
    <div className="space-y-5 text-xs text-highlands-900">
      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-highlands-900">PAYMENT COMPUTATION TABLE</p>
            <p className="text-sm font-semibold text-gold-700">{projectName}</p>
          </div>
          <span className="text-[10px] font-bold text-pine-600 uppercase">Annex A</span>
        </div>
      </div>

      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <table className="w-full text-xs">
          <tbody>
            <tr>
              <td className="py-1 font-bold w-40">NAME OF BUYER</td>
              <td className="py-1 font-semibold text-highlands-900">{buyerName || "—"}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">BUYER TYPE</td>
              <td className="py-1">{buyerType || "—"}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">BLOCK & LOT NO. / UNIT</td>
              <td className="py-1">{blockLot || "—"}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">LOT / UNIT AREA</td>
              <td className="py-1">{lotArea || "—"}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">LIST PRICE</td>
              <td className="py-1 font-semibold text-gold-700">₱{fmtCurrency(computed.listPrice)}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">PAYMENT TERM</td>
              <td className="py-1 font-semibold text-highlands-700">{paymentTermLabel}</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">DATE</td>
              <td className="py-1">{startDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <p className="font-bold text-highlands-900 uppercase tracking-wider mb-2">
          Contract Price Computation:
        </p>
        <table className="w-full text-xs">
          <tbody>
            <tr>
              <td className="py-1">LIST PRICE (VAT-in)</td>
              <td></td>
              <td className="py-1 text-right font-medium">₱{fmtCurrency(computed.listPrice)}</td>
            </tr>
            {computed.promoDiscount > 0 && (
              <tr>
                <td className="py-1 text-pine-600">Less: Promo Discount</td>
                <td></td>
                <td className="py-1 text-right text-rose-600">₱{fmtCurrency(computed.promoDiscount)}</td>
              </tr>
            )}
            {computed.cashDiscount > 0 && (
              <tr>
                <td className="py-1 text-pine-600">Less: Cash Discount</td>
                <td></td>
                <td className="py-1 text-right text-rose-600">₱{fmtCurrency(computed.cashDiscount)}</td>
              </tr>
            )}
            {computed.termDiscount > 0 && (
              <tr>
                <td className="py-1 text-pine-600">Less: Term Discount</td>
                <td className="text-pine-600">{computed.term.termDiscountPercent}%</td>
                <td className="py-1 text-right text-rose-600">₱{fmtCurrency(computed.termDiscount)}</td>
              </tr>
            )}
            {computed.extraDiscount > 0 && (
              <tr>
                <td className="py-1 text-pine-600">Less: Extra Discount</td>
                <td className="text-pine-600">{computed.term.extraDiscountPercent}%</td>
                <td className="py-1 text-right text-rose-600">₱{fmtCurrency(computed.extraDiscount)}</td>
              </tr>
            )}
            {computed.otherCharges > 0 && (
              <tr>
                <td className="py-1 text-pine-600">Add: Other Charges (O.C.)</td>
                <td className="text-pine-600">{computed.term.otherChargesPercent}%</td>
                <td className="py-1 text-right text-highlands-700 font-medium border-t border-highlands-900/10">
                  ₱{fmtCurrency(computed.otherCharges)}
                </td>
              </tr>
            )}
            <tr className="border-t-2 border-highlands-900/20">
              <td className="py-2 font-bold text-highlands-900 text-sm">Total Contract Price</td>
              <td></td>
              <td className="py-2 text-right font-bold text-highlands-900 text-sm">
                ₱{fmtCurrency(computed.totalContractPrice)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-highlands-900/15 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-highlands-800 text-white text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 text-center font-bold">Payment No.</th>
                <th className="py-2.5 px-3 text-center font-bold">Date Due</th>
                <th className="py-2.5 px-3 text-center font-bold">Particulars</th>
                <th className="py-2.5 px-3 text-right font-bold">Amount Due</th>
                <th className="py-2.5 px-3 text-right font-bold">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-highlands-900/6">
              {computed.schedule.map((row) => (
                <tr
                  key={row.paymentNo}
                  className={cn(
                    "hover:bg-cream-50/60",
                    row.particulars === "Reservation Fee" && "bg-gold-50/40",
                    (row.particulars === "Spot Cash" || row.particulars === "Spot DP") && "bg-gold-50/40",
                  )}
                >
                  <td className="py-2 px-3 text-center font-medium">{row.paymentNo}</td>
                  <td className="py-2 px-3 text-center">{row.dateDue}</td>
                  <td className="py-2 px-3 text-center font-medium">{row.particulars}</td>
                  <td className="py-2 px-3 text-right font-semibold text-highlands-900">
                    ₱{fmtCurrency(row.amountDue)}
                  </td>
                  <td className="py-2 px-3 text-right text-pine-700">
                    ₱{fmtCurrency(row.outstandingBalance)}
                  </td>
                </tr>
              ))}
              <tr className="bg-highlands-800 text-white font-bold">
                <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-[10px] tracking-wider">
                  Total
                </td>
                <td className="py-2.5 px-3 text-right">₱{fmtCurrency(computed.totalContractPrice)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-highlands-900/10 bg-cream-50/60 p-3 text-[10.5px] text-pine-600 space-y-1">
        <p className="font-bold text-highlands-900 uppercase">Notes:</p>
        {OFFICIAL_COMPUTATION_NOTES.map((note, idx) => (
          <p key={idx}>
            {idx + 1}. {note}
          </p>
        ))}
        {computed.term.conditions && (
          <p className="font-semibold text-highlands-900">• {computed.term.conditions}</p>
        )}
        {computed.term.notes && (
          <p className="font-semibold text-highlands-900">• {computed.term.notes}</p>
        )}
      </div>
    </div>
  );
}
