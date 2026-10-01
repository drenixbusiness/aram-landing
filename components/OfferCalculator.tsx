"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CALC, ESTIMATE_EVENT, OFFER, computeEstimate, usd, type EstimateInput } from "@/lib/offer";

/** Counts smoothly to a new value; jumps straight there for reduced motion or hidden tabs. */
function AnimatedMoney({ value, sign = "" }: { value: number; sign?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 450);
      const v = start + (value - start) * (1 - Math.pow(1 - p, 3));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Make sure we land exactly on the target even if frames are skipped.
    const done = window.setTimeout(() => {
      from.current = value;
      setShown(value);
    }, 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [value]);

  return (
    <>
      {sign}
      {usd(Math.round(shown))}
    </>
  );
}

type SliderProps = {
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  format: (n: number) => string;
  onChange: (n: number) => void;
};

function Slider({ label, value, range, format, onChange }: SliderProps) {
  const id = useId();
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  return (
    <div className="calc-slider">
      <div className="calc-slider-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        aria-valuetext={format(value)}
      />
      <div className="calc-slider-scale" aria-hidden>
        <span>{format(range.min)}</span>
        <span>{format(range.max)}</span>
      </div>
    </div>
  );
}

const miles = (n: number) => `${n.toLocaleString("en-US")} mi`;
const rate = (n: number) => `$${n.toFixed(2)}`;

export default function OfferCalculator() {
  const [m, setM] = useState<number>(CALC.miles.initial);
  const [r, setR] = useState<number>(CALC.rpm.initial);
  const [withFuel, setWithFuel] = useState(false);
  const [mpg, setMpg] = useState<number>(CALC.mpg.initial);
  const [diesel, setDiesel] = useState<number>(CALC.diesel.initial);

  const input: EstimateInput = useMemo(
    () => ({ miles: m, rpm: r, fuel: withFuel ? { mpg, diesel } : null }),
    [m, r, withFuel, mpg, diesel]
  );
  const est = useMemo(() => computeEstimate(input), [input]);
  const headline = est.netAfterFuel ?? est.netBeforeFuel;

  // Share the current numbers with the lease-on application form further down.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(ESTIMATE_EVENT, { detail: input }));
  }, [input]);

  return (
    <div className="calc">
      <div className="calc-controls" data-reveal>
        <Slider label="Miles per week" value={m} range={CALC.miles} format={miles} onChange={setM} />
        <Slider label="Rate per mile" value={r} range={CALC.rpm} format={rate} onChange={setR} />

        <label className={`calc-switch${withFuel ? " is-on" : ""}`}>
          <input type="checkbox" checked={withFuel} onChange={(e) => setWithFuel(e.target.checked)} />
          <span className="calc-switch-track" aria-hidden>
            <span className="calc-switch-thumb" />
          </span>
          <span>
            <span className="calc-switch-label">Include a fuel estimate</span>
            <span className="calc-switch-hint">See your net after diesel, based on your truck&apos;s MPG.</span>
          </span>
        </label>

        <div className={`calc-fuel${withFuel ? " is-open" : ""}`} inert={!withFuel}>
          <div className="calc-fuel-inner">
            <Slider label="Fuel economy" value={mpg} range={CALC.mpg} format={(n) => `${n.toFixed(1)} mpg`} onChange={setMpg} />
            <Slider label="Diesel price" value={diesel} range={CALC.diesel} format={(n) => `$${n.toFixed(2)}/gal`} onChange={setDiesel} />
          </div>
        </div>

        <p className="calc-note">
          Estimates only. Actual pay depends on lanes, loads and your truck. Fixed deductions are{" "}
          {usd(OFFER.deductions.reduce((s, d) => s + d.amount, 0))} a week plus {Math.round(OFFER.dispatchPct * 100)}% dispatch.
        </p>
      </div>

      <figure className="settlement" data-reveal style={{ "--d": 1 } as React.CSSProperties} aria-live="polite">
        <figcaption className="settlement-head">
          <span className="settlement-kicker">Sample weekly settlement</span>
          <span className="settlement-sub">ARAM Logistics Inc · Owner-operator</span>
        </figcaption>

        <div className="settlement-total">
          <span className="settlement-total-label">{est.netAfterFuel === null ? "Estimated net, before fuel" : "Estimated net, after fuel"}</span>
          <span className="settlement-total-value">
            <AnimatedMoney value={headline} />
          </span>
          <span className="settlement-total-sub">
            About <AnimatedMoney value={headline * 4} /> over four weeks
          </span>
        </div>

        <dl className="settlement-lines">
          <div className="settlement-line settlement-line--gross">
            <dt>
              Gross <small>{miles(est.miles)} × {rate(est.rpm)}</small>
            </dt>
            <dd>
              <AnimatedMoney value={est.gross} />
            </dd>
          </div>
          <div className="settlement-line">
            <dt>Dispatch fee ({Math.round(OFFER.dispatchPct * 100)}%)</dt>
            <dd>
              <AnimatedMoney value={est.dispatch} sign="−" />
            </dd>
          </div>
          {OFFER.deductions.map((d) => (
            <div className="settlement-line" key={d.label}>
              <dt>{d.label}</dt>
              <dd>−{usd(d.amount)}</dd>
            </div>
          ))}
          <div className="settlement-line settlement-line--sum">
            <dt>Net before fuel</dt>
            <dd>
              <AnimatedMoney value={est.netBeforeFuel} />
            </dd>
          </div>
          {est.fuel !== null && (
            <div className="settlement-line settlement-line--fuel">
              <dt>
                Fuel <small>{Math.round(est.miles / mpg).toLocaleString("en-US")} gal × ${diesel.toFixed(2)}</small>
              </dt>
              <dd>
                <AnimatedMoney value={est.fuel} sign="−" />
              </dd>
            </div>
          )}
        </dl>
      </figure>
    </div>
  );
}
