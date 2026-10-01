"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, MapPin, Phone, UserRound } from "lucide-react";
import Select from "./Select";
import { ESTIMATE_EVENT, computeEstimate, usd, type EstimateInput } from "@/lib/offer";
import {
  EXPERIENCE_OPTIONS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SELECT_POSITION_EVENT,
  US_STATES,
  type Position,
} from "@/lib/site";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "Company", label: "Company" },
  { value: "Owner-operator", label: "Owner-op" },
  { value: "Team", label: "Team" },
];

const EXPERIENCE = EXPERIENCE_OPTIONS.map((x) => ({ value: x, label: x }));

type Status = "idle" | "sending" | "success" | "error";
type Field = "name" | "phone" | "state";

const ERRORS: Record<Field, string> = {
  name: "Please enter your full name.",
  phone: "Please enter a 10-digit phone number.",
  state: "Please choose your state.",
};

const digits = (s: string) => s.replace(/\D/g, "");

/** Formats US numbers as (555) 000-0000 while typing. */
function formatPhone(raw: string) {
  let d = digits(raw);
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

type Props = {
  /** Position selected when the form loads (and after "Send another"). */
  defaultPosition?: Position;
  /** "offer": shows and sends the earnings-calculator estimate along with the application. */
  source?: "home" | "offer";
  title?: string;
};

export default function ApplyForm({ defaultPosition = "Company", source = "home", title = "Quick application" }: Props) {
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState<string>(EXPERIENCE[0].value);
  const [state, setState] = useState("");
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [estimate, setEstimate] = useState<EstimateInput | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});

  useEffect(() => {
    const onSelect = (e: Event) => {
      setPosition((e as CustomEvent<Position>).detail);
      setStatus((s) => (s === "success" ? "idle" : s));
    };
    window.addEventListener(SELECT_POSITION_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_POSITION_EVENT, onSelect);
  }, []);

  // On the offer page, keep the driver's latest calculator numbers to send with the application.
  useEffect(() => {
    if (source !== "offer") return;
    const onEstimate = (e: Event) => setEstimate((e as CustomEvent<EstimateInput>).detail);
    window.addEventListener(ESTIMATE_EVENT, onEstimate);
    return () => window.removeEventListener(ESTIMATE_EVENT, onEstimate);
  }, [source]);
  const est = estimate ? computeEstimate(estimate) : null;

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const valid: Record<Field, boolean> = {
    name: name.trim().length > 1,
    phone: digits(phone).length === 10,
    state: state !== "",
  };
  const progress = (Number(valid.name) + Number(valid.phone) + Number(valid.state) + Number(consent)) / 4;

  const clearError = (f: Field) => errors[f] && setErrors((prev) => ({ ...prev, [f]: false }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || status === "sending") return;

    const next = { name: !valid.name, phone: !valid.phone, state: !valid.state };
    setErrors(next);
    const first = (Object.keys(next) as Field[]).find((f) => next[f]);
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const honey = new FormData(e.currentTarget).get("_honey");

    setStatus("sending");
    try {
      // Our own API route posts the application to the recruiting Telegram group.
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name, phone, state, experience, position, consent, source,
          estimate: source === "offer" ? estimate : undefined,
          _honey: honey ?? "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setName("");
    setPhone("");
    setExperience(EXPERIENCE[0].value);
    setState("");
    setPosition(defaultPosition);
    setConsent(false);
    setErrors({});
    setStatus("idle");
    requestAnimationFrame(() => document.getElementById("f-name")?.focus());
  }

  const sending = status === "sending";

  return (
    <div className="card form-card" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
      <div className="form-progress" aria-hidden style={{ transform: `scaleX(${status === "success" ? 1 : progress})` }} />

      {status !== "success" ? (
        <form className="apply-form" noValidate onSubmit={onSubmit}>
          <div className="form-head">
            <h3 className="form-title">{title}</h3>
            <p className="form-sub">Takes about a minute.</p>
          </div>

          <input type="text" name="_honey" className="hp" tabIndex={-1} autoComplete="off" aria-hidden />

          <div className={`field${errors.name ? " has-error" : ""}`}>
            <label htmlFor="f-name">Full name</label>
            <div className="input-wrap">
              <UserRound className="field-icon" aria-hidden />
              <input
                id="f-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Smith"
                value={name}
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? "f-name-err" : undefined}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
              />
            </div>
            {errors.name && <p className="field-error" id="f-name-err">{ERRORS.name}</p>}
          </div>

          <div className="field-row">
            <div className={`field${errors.phone ? " has-error" : ""}`}>
              <label htmlFor="f-phone">Phone</label>
              <div className="input-wrap">
                <Phone className="field-icon" aria-hidden />
                <input
                  id="f-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  inputMode="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  aria-invalid={errors.phone || undefined}
                  aria-describedby={errors.phone ? "f-phone-err" : undefined}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    clearError("phone");
                  }}
                />
              </div>
              {errors.phone && <p className="field-error" id="f-phone-err">{ERRORS.phone}</p>}
            </div>

            <div className="field">
              <label id="f-exp-label" htmlFor="f-exp">CDL-A experience</label>
              <Select
                id="f-exp"
                name="experience"
                labelId="f-exp-label"
                options={EXPERIENCE}
                value={experience}
                onChange={setExperience}
                icon={<Clock aria-hidden />}
              />
            </div>
          </div>

          <div className={`field${errors.state ? " has-error" : ""}`}>
            <label id="f-state-label" htmlFor="f-state">State</label>
            <Select
              id="f-state"
              name="state"
              labelId="f-state-label"
              options={US_STATES}
              value={state}
              onChange={(v) => {
                setState(v);
                clearError("state");
              }}
              placeholder="Select your state"
              searchPlaceholder="Search states"
              searchable
              icon={<MapPin aria-hidden />}
              invalid={errors.state}
              describedBy={errors.state ? "f-state-err" : undefined}
            />
            {errors.state && <p className="field-error" id="f-state-err">{ERRORS.state}</p>}
          </div>

          {est && (
            <div className="form-estimate">
              <span className="form-estimate-label">Your estimate, sent with this application</span>
              <span className="form-estimate-value">
                {est.miles.toLocaleString("en-US")} mi × ${est.rpm.toFixed(2)} → {usd(est.netAfterFuel ?? est.netBeforeFuel)}
                <small>/week net {est.netAfterFuel === null ? "before" : "after"} fuel</small>
              </span>
            </div>
          )}

          <fieldset className="field">
            <legend>Position</legend>
            <div className="segmented" style={{ "--seg": POSITIONS.findIndex((p) => p.value === position) } as React.CSSProperties}>
              <span className="segmented-thumb" aria-hidden />
              {POSITIONS.map((p) => (
                <label key={p.value}>
                  <input
                    type="radio"
                    name="position"
                    value={p.value}
                    checked={position === p.value}
                    onChange={() => setPosition(p.value)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className={`consent${consent ? " is-checked" : ""}`}>
            <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="consent-box" aria-hidden>
              <svg viewBox="0 0 16 16">
                <path d="M3.5 8.5l3 3 6-7" pathLength={1} />
              </svg>
            </span>
            <span className="consent-text">
              By sending, you agree to be contacted by ARAM Logistics Inc about driving positions. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Conditions</Link>.
            </span>
          </label>

          <button
            type="submit"
            className={`btn btn--primary btn--block btn--submit${sending ? " is-sending" : ""}`}
            disabled={!consent || sending}
            aria-busy={sending}
          >
            <span>Send application</span>
            {sending ? <span className="spinner" aria-hidden /> : <ArrowRight className="btn-icon icon-arrow" aria-hidden />}
          </button>

          {status === "error" && (
            <p className="form-error" role="alert">
              Something went wrong. Please call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
            </p>
          )}
        </form>
      ) : (
        <div className="form-success" ref={successRef} tabIndex={-1}>
          <svg className="success-icon" viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="16.5" pathLength={1} />
            <path d="M11 18.5l5 5 9-10" pathLength={1} />
          </svg>
          <h3 className="success-title">Thank you. We&apos;ll call you soon.</h3>
          <p>
            A recruiter will reach out within one business day. Can&apos;t wait? Call{" "}
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
          </p>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Send another
          </button>
        </div>
      )}
    </div>
  );
}
