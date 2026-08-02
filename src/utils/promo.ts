import type { PropertyPromo, PromoDiscount } from "@/context/SiteContext";

export function parsePriceToNumber(priceStr: string): number | null {
  if (!priceStr) return null;
  const clean = priceStr.replace(/[^\d.MmkK]/g, "").trim();

  if (clean.toUpperCase().endsWith("M")) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? null : num * 1_000_000;
  }
  if (clean.toUpperCase().endsWith("K")) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? null : num * 1_000;
  }
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

export function formatNumberToPesos(num: number): string {
  if (num >= 1_000_000) {
    const inMillions = num / 1_000_000;
    const formatted =
      inMillions % 1 === 0
        ? inMillions.toFixed(0)
        : inMillions.toFixed(2).replace(/\.?0+$/, "");
    return `₱${formatted}M`;
  }
  if (num >= 1_000) {
    return `₱${(num / 1_000).toFixed(0)}K`;
  }
  return `₱${num.toLocaleString("en-PH")}`;
}

export type PromoCalculationResult = {
  isPromoActive: boolean;
  totalPercentage: number;
  discountedPriceStr: string;
  originalPriceStr: string;
  promoBadgeText: string;
  timeLeft: {
    expired: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
  };
};

export function calculatePromoPrice(
  originalPriceStr: string,
  promo: PropertyPromo | undefined,
): PromoCalculationResult {
  const defaultRes: PromoCalculationResult = {
    isPromoActive: false,
    totalPercentage: 0,
    discountedPriceStr: originalPriceStr,
    originalPriceStr,
    promoBadgeText: "",
    timeLeft: {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "Expired",
    },
  };

  if (
    !promo ||
    !promo.enabled ||
    !promo.endsAt ||
    !promo.discounts ||
    promo.discounts.length === 0
  ) {
    return defaultRes;
  }

  const endMs = new Date(promo.endsAt).getTime();
  const nowMs = Date.now();
  const diff = endMs - nowMs;

  if (diff <= 0 || isNaN(endMs)) {
    return defaultRes;
  }

  // Calculate remaining time
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatted = `${days > 0 ? `${days}d ` : ""}${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;

  // Calculate total percentage (sum of all stackable promo discounts)
  const validDiscounts: PromoDiscount[] = promo.discounts.filter(
    (d: PromoDiscount) => d.percentage > 0,
  );
  const totalPercentage: number = validDiscounts.reduce(
    (acc: number, d: PromoDiscount) => acc + d.percentage,
    0,
  );

  if (totalPercentage <= 0) {
    return defaultRes;
  }

  // Calculate discounted price
  let discountedPriceStr = promo.customDiscountedPrice?.trim() || "";
  if (!discountedPriceStr) {
    const originalNum = parsePriceToNumber(originalPriceStr);
    if (originalNum !== null) {
      // Additive discount percentage e.g. 30% + 10% = 40% off
      const discountAmount = originalNum * (Math.min(totalPercentage, 99) / 100);
      const finalPrice = Math.max(0, originalNum - discountAmount);
      discountedPriceStr = formatNumberToPesos(finalPrice);
    } else {
      discountedPriceStr = originalPriceStr;
    }
  }

  // Build badge text e.g. "30% + 10% PROMO" or "30% OFF"
  let promoBadgeText = promo.badgeText?.trim() || "";
  if (!promoBadgeText) {
    if (validDiscounts.length > 1) {
      const parts = validDiscounts.map((d: PromoDiscount) => `${d.percentage}%`);
      promoBadgeText = `${parts.join(" + ")} PROMO (Save ${totalPercentage}%)`;
    } else {
      promoBadgeText = `${validDiscounts[0]?.percentage || totalPercentage}% LIMITED PROMO`;
    }
  }

  return {
    isPromoActive: true,
    totalPercentage,
    discountedPriceStr,
    originalPriceStr,
    promoBadgeText,
    timeLeft: {
      expired: false,
      days,
      hours,
      minutes,
      seconds,
      formatted,
    },
  };
}
