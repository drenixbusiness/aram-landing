import { NextResponse } from "next/server";
import { EXPERIENCE_OPTIONS, POSITIONS, US_STATES } from "@/lib/site";
import { computeEstimate, parseEstimateInput, usd } from "@/lib/offer";

// Server-only: these never reach the browser (no NEXT_PUBLIC_ prefix).
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Light per-IP rate limit so the form can't be used to flood the group.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Payload = {
  name?: unknown;
  phone?: unknown;
  state?: unknown;
  experience?: unknown;
  position?: unknown;
  consent?: unknown;
  source?: unknown;
  estimate?: unknown;
  _honey?: unknown;
};

const bad = (message: string, status = 400) => NextResponse.json({ ok: false, error: message }, { status });

export async function POST(req: Request) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("[apply] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return bad("Not configured", 500);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  // Bots fill the hidden field; pretend it worked so they don't retry.
  if (typeof body._honey === "string" && body._honey.trim() !== "") return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return bad("Too many requests", 429);

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const phoneDigits = typeof body.phone === "string" ? body.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "") : "";
  const state = US_STATES.find((s) => s.value === body.state);
  const experience = EXPERIENCE_OPTIONS.find((x) => x === body.experience);
  const position = POSITIONS.find((p) => p === body.position);

  if (name.length < 2 || name.length > 100) return bad("Invalid name");
  if (phoneDigits.length !== 10) return bad("Invalid phone");
  if (!state) return bad("Invalid state");
  if (!experience) return bad("Invalid experience");
  if (!position) return bad("Invalid position");
  if (body.consent !== true) return bad("Consent required");

  const source = body.source === "offer" ? "offer" : "home";
  // Recompute from the raw slider values so the numbers in the group can't be faked.
  const estInput = source === "offer" && body.estimate ? parseEstimateInput(body.estimate) : null;
  const est = estInput ? computeEstimate(estInput) : null;

  const phone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
  const sentAt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const text = [
    "🚚 <b>New driver application</b>",
    "",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Phone:</b> +1 ${phone}`,
    `<b>State:</b> ${state.label} (${state.value})`,
    `<b>CDL-A experience:</b> ${experience}`,
    `<b>Position:</b> ${position}`,
    `<b>Consent to contact:</b> Yes`,
    `<b>Source:</b> ${source === "offer" ? "Owner-operator offer page" : "Home page"}`,
    ...(est
      ? [
          "",
          "📊 <b>Their calculator estimate</b>",
          `${est.miles.toLocaleString("en-US")} mi/week × $${est.rpm.toFixed(2)} = ${usd(est.gross)} gross`,
          `Net before fuel: <b>${usd(est.netBeforeFuel)}</b>/week`,
          ...(est.fuel !== null && estInput?.fuel
            ? [`Fuel (${estInput.fuel.mpg.toFixed(1)} mpg, $${estInput.fuel.diesel.toFixed(2)}/gal): −${usd(est.fuel)} → net after fuel <b>${usd(est.netAfterFuel!)}</b>`]
            : []),
        ]
      : []),
    "",
    `<i>Website · ${sentAt} (Chicago time)</i>`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (!res.ok || !data?.ok) {
      console.error("[apply] Telegram rejected the message:", res.status, data?.description);
      return bad("Delivery failed", 502);
    }
  } catch (err) {
    console.error("[apply] Telegram request failed:", (err as Error).message);
    return bad("Delivery failed", 502);
  }

  return NextResponse.json({ ok: true });
}
