import type { Metadata } from "next";
import { Calculator, CalendarCheck, FileCheck, Headset, Mail, Phone, ReceiptText, Route, UserRound, X } from "lucide-react";
import ApplyForm from "@/components/ApplyForm";
import OfferCalculator from "@/components/OfferCalculator";
import { OFFER, fixedWeekly, usd } from "@/lib/offer";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const pct = Math.round(OFFER.dispatchPct * 100);
const upTo = `$${Math.round(OFFER.weeklyGrossMax / 1000)}K`;

export const metadata: Metadata = {
  title: "Owner-Operator Offer",
  description: `Lease on with ARAM Logistics Inc: up to ${usd(OFFER.weeklyGrossMax)} weekly gross, ${pct}% dispatch, flat itemized deductions and no forced dispatch. Estimate your weekly net.`,
};

const REASONS = [
  { icon: Route, title: "No forced dispatch", body: "You choose the loads you run. Turning one down never costs you." },
  { icon: UserRound, title: "One dispatcher, by name", body: "The same person every week, who knows your truck, your lanes and when you need to be home." },
  { icon: CalendarCheck, title: "Pre-booked loads", body: "Your next load is lined up before you're empty, so you spend less time waiting." },
  { icon: Headset, title: "Support around the clock", body: "Someone answers day or night, weekends and holidays included." },
  { icon: ReceiptText, title: "Itemized settlements", body: "Every deduction is listed. What you see on this page is what you pay." },
  { icon: FileCheck, title: "Help with compliance", body: "We help with IFTA, permits and the paperwork that keeps you rolling." },
];

export default function OfferPage() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="hero offer-hero">
        <div className="container cols hero-cols">
          <div className="hero-text">
            <p className="kicker kicker--line">Owner-operator opportunity</p>
            <h1 className="hero-title offer-title">
              <span className="h-line">
                <span>Your truck.</span>
              </span>
              <span className="h-line">
                <span>Our freight.</span>
              </span>
              <span className="h-line">
                <span>
                  <em>Up to {upTo} a week.</em>
                </span>
              </span>
            </h1>
            <p className="hero-lede">
              Lease on with ARAM Logistics Inc and keep more of every mile: flat, itemized deductions, no forced
              dispatch and a dispatcher who knows you by name.
            </p>
            <div className="hero-actions">
              <a href="#calculator" className="btn btn--primary btn--lg">
                <Calculator className="btn-icon" aria-hidden /> Calculate your earnings
              </a>
              <a href={PHONE_HREF} className="btn btn--ghost btn--lg">
                <Phone className="btn-icon" aria-hidden /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <aside className="offer-glance" aria-label="The offer at a glance">
            <p className="offer-glance-kicker">The offer at a glance</p>
            <dl>
              <div>
                <dt>Weekly gross</dt>
                <dd className="is-accent">
                  {usd(OFFER.weeklyGrossMin)}–{usd(OFFER.weeklyGrossMax)}
                </dd>
              </div>
              <div>
                <dt>Rate per mile</dt>
                <dd>
                  ${OFFER.rpmMin.toFixed(2)}–${OFFER.rpmMax.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt>Dispatch fee</dt>
                <dd>{pct}%</dd>
              </div>
              <div>
                <dt>Fixed weekly costs</dt>
                <dd>{usd(fixedWeekly)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* Costs */}
      <section id="costs" className="section section--divided">
        <div className="container">
          <div className="costs-head">
            <p className="kicker" data-reveal>
              Pricing
            </p>
            <h2 data-reveal className="h2">
              What it costs you
            </h2>
            <p className="section-lede" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
              Straight numbers, every week. What you see here is exactly what shows up on your settlement.
            </p>
          </div>

          <div className="cost-sheets">
            <div className="cost-sheet" data-reveal>
              <p className="cost-sheet-title">Weekly deductions</p>
              <dl className="ledger">
                <div>
                  <dt>Dispatch fee</dt>
                  <dd>{pct}% of gross</dd>
                </div>
                {OFFER.deductions.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{usd(d.amount)}/week</dd>
                  </div>
                ))}
                <div className="ledger-total">
                  <dt>Flat weekly total</dt>
                  <dd>
                    {usd(fixedWeekly)} + {pct}%
                  </dd>
                </div>
              </dl>
            </div>

            <div className="cost-sheet" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              <p className="cost-sheet-title">What we don&apos;t charge</p>
              <ul className="not-charged">
                {OFFER.notCharged.map((item) => (
                  <li key={item}>
                    <span className="not-charged-badge" aria-hidden>
                      <X />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="section section--divided">
        <div className="container">
          <p className="kicker" data-reveal>
            Why owner-operators choose us
          </p>
          <h2 data-reveal className="h2 benefits-title">
            A small team that treats your business like it matters
          </h2>
          <div className="benefits-grid">
            {REASONS.map(({ icon: Icon, title, body }, i) => (
              <div className="benefit" key={title} data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
                <Icon className="benefit-icon" aria-hidden />
                <h3 className="benefit-title">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="section section--divided">
        <div className="container">
          <p className="kicker" data-reveal>
            Earnings calculator
          </p>
          <h2 data-reveal className="h2 calc-title">
            Estimate your weekly earnings
          </h2>
          <p className="section-lede" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            Move the sliders to see gross, deductions and net for a typical week, laid out the way your settlement
            will be.
          </p>
          <OfferCalculator />
        </div>
      </section>

      {/* Lease on */}
      <section id="lease-on" className="section section--divided">
        <div className="container cols">
          <div>
            <p className="kicker" data-reveal>
              Lease on
            </p>
            <h2 className="apply-title" data-reveal>
              Ready to lease on?
              <br />
              <em>Let&apos;s run the numbers.</em>
            </h2>
            <p className="apply-lede" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              Call our recruiting line or send a quick application. A recruiter will go over your settlement with you,
              line by line, within one business day.
            </p>
            <ul className="contact-list">
              <li data-reveal style={{ "--d": 1 } as React.CSSProperties}>
                <Phone className="contact-icon" aria-hidden />
                <a href={PHONE_HREF} className="contact-phone">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li data-reveal style={{ "--d": 2 } as React.CSSProperties}>
                <Mail className="contact-icon" aria-hidden />
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
            </ul>
          </div>
          <ApplyForm defaultPosition="Owner-operator" source="offer" title="Lease-on application" />
        </div>
      </section>
    </main>
  );
}
