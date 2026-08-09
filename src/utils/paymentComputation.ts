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
  dpSpreadMonths: number = 0,
): string {
  const monthOffset = (spotAmount > 0 ? 1 : 0) + dpSpreadMonths + 1;
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
  const dpSpreadPercent = term.dpSpreadPercent || 0;
  const dpSpreadAmount = afterReservation * (dpSpreadPercent / 100);
  const dpSpreadMonths = term.dpSpreadMonths || 0;
  const dpSpreadMonthly = dpSpreadMonths > 0 ? dpSpreadAmount / dpSpreadMonths : 0;

  const balanceAmount = Math.max(0, afterReservation - spotAmount - dpSpreadAmount);
  const months = term.balanceMonths || 0;
  const interestRate = term.interestRate || 0;

  let monthlyAmount = 0;
  if (term.balanceType === "monthly" && months > 0) {
    if (interestRate > 0) {
      // Standard PMT formula for monthly interest
      const monthlyRate = interestRate / 12 / 100;
      monthlyAmount = (balanceAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    } else {
      monthlyAmount = balanceAmount / months;
    }
  }

  const schedule: ComputedSchedule[] = [];
  let outstanding = totalContractPrice;

  // 1. Reservation
  outstanding -= reservationFee;
  schedule.push({
    paymentNo: 0,
    dateDue: formatDate(startDate),
    particulars: "Reservation Fee",
    amountDue: reservationFee,
    outstandingBalance: outstanding,
  });

  let currentMonthOffset = 1;
  let nextPaymentNo = 1;

  // 2. Spot DP
  if (spotAmount > 0) {
    outstanding -= spotAmount;
    schedule.push({
      paymentNo: nextPaymentNo++,
      dateDue: formatDate(addMonths(startDate, currentMonthOffset++)),
      particulars: term.spotPercent === 100 ? "Spot Cash" : "Spot DP",
      amountDue: spotAmount,
      outstandingBalance: Math.max(0, outstanding),
    });
  }

  // 3. Stretched / Deferred DP
  if (dpSpreadAmount > 0 && dpSpreadMonths > 0) {
    for (let i = 0; i < dpSpreadMonths; i++) {
      outstanding -= dpSpreadMonthly;
      schedule.push({
        paymentNo: nextPaymentNo++,
        dateDue: formatDate(addMonths(startDate, currentMonthOffset++)),
        particulars: dpSpreadMonths === 1 ? "Deferred DP" : `Deferred DP ${i + 1}/${dpSpreadMonths}`,
        amountDue: dpSpreadMonthly,
        outstandingBalance: Math.max(0, outstanding),
      });
    }
  }

  // 4. Balance (Monthly or Lumpsum)
  if (balanceAmount > 0) {
    if (term.balanceType === "monthly" && months > 0 && monthlyAmount > 0) {
      for (let i = 0; i < months; i++) {
        outstanding -= monthlyAmount;
        schedule.push({
          paymentNo: nextPaymentNo++,
          dateDue: formatDate(addMonths(startDate, currentMonthOffset++)),
          particulars: `MA-${i + 1}`,
          amountDue: monthlyAmount,
          outstandingBalance: Math.max(0, outstanding),
        });
      }
    } else {
      outstanding -= balanceAmount;
      schedule.push({
        paymentNo: nextPaymentNo++,
        dateDue: balanceDueDate(term, startDate, spotAmount, turnoverDate, dpSpreadMonths),
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
    dpSpreadPercent: term.dpSpreadPercent ?? 0,
    dpSpreadMonths: term.dpSpreadMonths ?? 0,
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
    dpSpreadPercent: 0,
    dpSpreadMonths: 0,
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
    dpSpreadPercent: 0,
    dpSpreadMonths: 0,
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
    dpSpreadPercent: 0,
    dpSpreadMonths: 0,
    balanceType: "monthly",
    balanceMonths: 60,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "",
  },
  {
    label: "20% DP in 24 months / 80% Lumpsum",
    isPreset: true,
    termDiscountPercent: 2,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 0,
    dpSpreadPercent: 20,
    dpSpreadMonths: 24,
    balanceType: "lumpsum",
    balanceMonths: 1,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "Deferred DP scheme",
  },
  {
    label: "10% Spot / 10% in 12 months / 80% Bank",
    isPreset: true,
    termDiscountPercent: 3,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 10,
    dpSpreadPercent: 10,
    dpSpreadMonths: 12,
    balanceType: "lumpsum",
    balanceMonths: 1,
    interestRate: 0,
    reservationFee: 100000,
    notes: "",
    conditions: "Split DP scheme",
  },
  {
    label: "100% in 60 months (No DP)",
    isPreset: true,
    termDiscountPercent: 1,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 0,
    dpSpreadPercent: 0,
    dpSpreadMonths: 0,
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
    dpSpreadPercent: 0,
    dpSpreadMonths: 0,
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
