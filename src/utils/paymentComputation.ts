import type { PaymentTerm } from "@/context/SiteContext";

export type ComputedSchedule = {
  paymentNo: number;
  dateDue: string;
  particulars: string;
  amountDue: number;
  outstandingBalance: number;
};

export type ComputationDiscounts = {
  promoMode: "none" | "with";
  promoPercent: number;
  cashMode: "none" | "with";
  cashType: "percent" | "amount";
  cashValue: number;
};

export type ComputationParams = {
  listPrice: number;
  term: PaymentTerm;
  startDate: Date;
  turnoverDate?: Date | null;
  discounts: ComputationDiscounts;
};

export type ComputedResult = {
  term: PaymentTerm;
  listPrice: number;
  promoDiscount: number;
  cashDiscount: number;
  termDiscount: number;
  extraDiscount: number;
  totalDiscounts: number;
  subtotalAfterDiscount: number;
  otherCharges: number;
  totalContractPrice: number;
  spotAmount: number;
  balanceAmount: number;
  monthlyAmount: number;
  schedule: ComputedSchedule[];
};

export const BUYER_TYPES = [
  "Individual",
  "Corporation",
  "OFW",
  "Joint Buyers",
  "Repeat Buyer",
  "Referral",
] as const;

export const INVENTORY_STATUSES = [
  "Available",
  "Reserved",
  "Hold",
  "Sold",
  "Not for Sale",
] as const;

export const OFFICIAL_COMPUTATION_NOTES = [
  "This computation sheet only intends to provide an indicative reservation price. Prices, terms and conditions are subject to change without prior notice.",
  "Submission of post-dated checks is required.",
  "Price includes the Value Added Tax, currently at 12%.",
  "Any government mandated adjustments on taxes shall be applied accordingly.",
] as const;

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-PH", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtCurrency(n: number): string {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function resolveCashDiscount(listPrice: number, discounts: ComputationDiscounts): number {
  if (discounts.cashMode !== "with") return 0;
  if (discounts.cashType === "amount") return Math.min(listPrice, Math.max(0, discounts.cashValue));
  return listPrice * (Math.max(0, discounts.cashValue) / 100);
}

function balanceParticulars(term: PaymentTerm, turnoverDate?: Date | null): string {
  const balancePct = Math.max(0, 100 - term.spotPercent);
  switch (term.balanceType) {
    case "lumpsum":
      return term.balanceMonths > 0
        ? `Lumpsum (${balancePct}% after ${term.balanceMonths} months, ${term.interestRate}% interest)`
        : `Lumpsum (${balancePct}%)`;
    case "turnover":
      return turnoverDate
        ? `Balance upon Turnover (${formatDate(turnoverDate)})`
        : "Balance upon Turnover";
    case "lumpsum_or_turnover":
      return term.balanceMonths > 0
        ? `Lumpsum after ${term.balanceMonths} months or Upon Turnover, whichever comes first`
        : "Lumpsum or Upon Turnover, whichever comes first";
    default:
      return term.balanceMonths > 0 ? `Monthly Amortization (${term.balanceMonths} mo.)` : "Balance";
  }
}

function balanceDueDate(
  term: PaymentTerm,
  startDate: Date,
  spotAmount: number,
  turnoverDate?: Date | null,
): string {
  const monthOffset = spotAmount > 0 ? 2 : 1;
  switch (term.balanceType) {
    case "lumpsum":
      return term.balanceMonths > 0
        ? formatDate(addMonths(startDate, monthOffset + term.balanceMonths - 1))
        : formatDate(addMonths(startDate, monthOffset));
    case "turnover":
      return turnoverDate ? formatDate(turnoverDate) : "Upon Turnover";
    case "lumpsum_or_turnover": {
      const lumpsumDate =
        term.balanceMonths > 0
          ? formatDate(addMonths(startDate, monthOffset + term.balanceMonths - 1))
          : formatDate(addMonths(startDate, monthOffset));
      if (turnoverDate) {
        return `${lumpsumDate} / ${formatDate(turnoverDate)} (whichever comes first)`;
      }
      return `${lumpsumDate} or Upon Turnover (whichever comes first)`;
    }
    default:
      return "";
  }
}

export function computePayment(params: ComputationParams): ComputedResult {
  const { listPrice, term, startDate, turnoverDate, discounts } = params;

  const promoDiscount =
    discounts.promoMode === "with" ? listPrice * (Math.max(0, discounts.promoPercent) / 100) : 0;
  const cashDiscount = resolveCashDiscount(listPrice, discounts);
  const termDiscount = listPrice * (term.termDiscountPercent / 100);
  const extraDiscount = listPrice * (term.extraDiscountPercent / 100);
  const totalDiscounts = promoDiscount + cashDiscount + termDiscount + extraDiscount;
  const subtotalAfterDiscount = Math.max(0, listPrice - totalDiscounts);
  const otherCharges = subtotalAfterDiscount * (term.otherChargesPercent / 100);
  const totalContractPrice = subtotalAfterDiscount + otherCharges;

  const reservationFee = term.reservationFee || 100000;
  const afterReservation = totalContractPrice - reservationFee;
  const spotAmount = afterReservation * (term.spotPercent / 100);
  const balanceAmount = afterReservation - spotAmount;
  const months = term.balanceMonths || 0;
  const monthlyAmount =
    term.balanceType === "monthly" && months > 0 ? balanceAmount / months : 0;

  const schedule: ComputedSchedule[] = [];
  let outstanding = totalContractPrice;

  outstanding -= reservationFee;
  schedule.push({
    paymentNo: 0,
    dateDue: formatDate(startDate),
    particulars: "Reservation Fee",
    amountDue: reservationFee,
    outstandingBalance: outstanding,
  });

  if (spotAmount > 0) {
    outstanding -= spotAmount;
    schedule.push({
      paymentNo: 1,
      dateDue: formatDate(addMonths(startDate, 1)),
      particulars: term.spotPercent === 100 ? "Spot Cash" : "Spot DP",
      amountDue: spotAmount,
      outstandingBalance: Math.max(0, outstanding),
    });
  }

  if (balanceAmount > 0) {
    if (term.balanceType === "monthly" && months > 0 && monthlyAmount > 0) {
      const startIdx = spotAmount > 0 ? 2 : 1;
      const monthOffset = spotAmount > 0 ? 2 : 1;
      for (let i = 0; i < months; i++) {
        outstanding -= monthlyAmount;
        schedule.push({
          paymentNo: startIdx + i,
          dateDue: formatDate(addMonths(startDate, monthOffset + i)),
          particulars: `MA-${i + 1}`,
          amountDue: monthlyAmount,
          outstandingBalance: Math.max(0, outstanding),
        });
      }
    } else {
      outstanding -= balanceAmount;
      schedule.push({
        paymentNo: spotAmount > 0 ? 2 : 1,
        dateDue: balanceDueDate(term, startDate, spotAmount, turnoverDate),
        particulars: balanceParticulars(term, turnoverDate),
        amountDue: balanceAmount,
        outstandingBalance: Math.max(0, outstanding),
      });
    }
  }

  return {
    term,
    listPrice,
    promoDiscount,
    cashDiscount,
    termDiscount,
    extraDiscount,
    totalDiscounts,
    subtotalAfterDiscount,
    otherCharges,
    totalContractPrice,
    spotAmount,
    balanceAmount,
    monthlyAmount,
    schedule,
  };
}

/** Migrate legacy payment terms from older saved projects. */
export function normalizePaymentTerm(term: PaymentTerm): PaymentTerm {
  return {
    ...term,
    balanceType: term.balanceType || (term.balanceMonths > 0 ? "monthly" : "lumpsum"),
    interestRate: term.interestRate ?? 0,
    isPreset: term.isPreset ?? false,
    conditions: term.conditions ?? "",
  };
}

export const PRESET_PAYMENT_TERMS: Omit<PaymentTerm, "id">[] = [
  {
    label: "100% Spot Cash (30 days)",
    isPreset: true,
    termDiscountPercent: 20,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 100,
    balanceType: "lumpsum",
    balanceMonths: 0,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
  },
  {
    label: "50% Spot / 50% in 60 months",
    isPreset: true,
    termDiscountPercent: 10,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 50,
    balanceType: "monthly",
    balanceMonths: 60,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
  },
  {
    label: "20% Spot / 80% in 60 months",
    isPreset: true,
    termDiscountPercent: 5,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 20,
    balanceType: "monthly",
    balanceMonths: 60,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
  },
  {
    label: "100% in 60 months (No DP)",
    isPreset: true,
    termDiscountPercent: 1,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 0,
    balanceType: "monthly",
    balanceMonths: 60,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
  },
];

export function createPaymentTerm(overrides: Partial<Omit<PaymentTerm, "id">> = {}): PaymentTerm {
  return normalizePaymentTerm({
    id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: "",
    isPreset: false,
    termDiscountPercent: 0,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 20,
    balanceType: "monthly",
    balanceMonths: 60,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
    ...overrides,
  });
}

export function createPresetTerms(): PaymentTerm[] {
  return PRESET_PAYMENT_TERMS.map((term) => createPaymentTerm(term));
}
