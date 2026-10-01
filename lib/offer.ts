/**
 * Owner-operator offer terms shown on /offer and used by the earnings calculator.
 *
 * ⚠ CONFIRM BEFORE PUBLISHING: these figures are placeholders taken from typical
 * owner-operator lease offers. Replace them with ARAM Logistics Inc's actual terms;
 * every number on the /offer page and in the calculator comes from here.
 */
export const OFFER = {
  weeklyGrossMin: 9000,
  weeklyGrossMax: 13000,
  rpmMin: 2.8,
  rpmMax: 4.0,
  dispatchPct: 0.12,
  deductions: [
    { label: "Insurance", amount: 400 },
    { label: "ELD", amount: 65 },
    { label: "IFTA and permits", amount: 35 },
  ],
  notCharged: ["No forced dispatch", "No trailer rental fee", "No escrow", "No hidden fees on your settlement"],
} as const;

/** Calculator ranges and starting values. */
export const CALC = {
  miles: { min: 2000, max: 5000, step: 100, initial: 3500 },
  rpm: { min: OFFER.rpmMin, max: OFFER.rpmMax, step: 0.05, initial: 2.75 },
  mpg: { min: 5, max: 9, step: 0.1, initial: 6.5 },
  diesel: { min: 3, max: 6, step: 0.05, initial: 3.8 },
} as const;

export const fixedWeekly = OFFER.deductions.reduce((sum, d) => sum + d.amount, 0);

export type EstimateInput = { miles: number; rpm: number; fuel?: { mpg: number; diesel: number } | null };

export type Estimate = {
  miles: number;
  rpm: number;
  gross: number;
  dispatch: number;
  fixed: number;
  netBeforeFuel: number;
  fuel: number | null;
  netAfterFuel: number | null;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** One source of truth for the math, used by the calculator and re-checked on the server. */
export function computeEstimate({ miles, rpm, fuel }: EstimateInput): Estimate {
  const gross = round2(miles * rpm);
  const dispatch = round2(gross * OFFER.dispatchPct);
  const netBeforeFuel = round2(gross - dispatch - fixedWeekly);
  const fuelCost = fuel ? round2((miles / fuel.mpg) * fuel.diesel) : null;
  return {
    miles,
    rpm,
    gross,
    dispatch,
    fixed: fixedWeekly,
    netBeforeFuel,
    fuel: fuelCost,
    netAfterFuel: fuelCost === null ? null : round2(netBeforeFuel - fuelCost),
  };
}

const inRange = (n: unknown, r: { min: number; max: number }): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= r.min && n <= r.max;

/** Validates calculator values sent from the browser; returns null if anything is off. */
export function parseEstimateInput(raw: unknown): EstimateInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!inRange(r.miles, CALC.miles) || !inRange(r.rpm, CALC.rpm)) return null;
  let fuel: EstimateInput["fuel"] = null;
  if (r.fuel && typeof r.fuel === "object") {
    const f = r.fuel as Record<string, unknown>;
    if (!inRange(f.mpg, CALC.mpg) || !inRange(f.diesel, CALC.diesel)) return null;
    fuel = { mpg: f.mpg, diesel: f.diesel };
  }
  return { miles: Math.round(r.miles), rpm: r.rpm, fuel };
}

export const usd = (n: number, cents = false) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

export const ESTIMATE_EVENT = "aram:estimate";
