import { ArrowRight, Banknote, Check, Fuel, Headset, House, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import ApplyForm from "@/components/ApplyForm";
import Plate from "@/components/Plate";
import VisitSection from "@/components/VisitSection";
import PositionButton from "@/components/PositionButton";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, EMAIL, PHONE_DISPLAY, PHONE_HREF, type Position } from "@/lib/site";

const FACTS = [
  { value: "CDL-A", label: "Positions open now" },
  { value: "Weekly", label: "Settlements, direct deposit", accent: true },
  { value: "24 / 7", label: "Dispatch and support" },
  { value: "Illinois", label: "Headquartered in Elmwood Park" },
];

const BENEFITS = [
  { icon: Banknote, title: "Weekly pay", body: "Settlements every week by direct deposit, with a clear breakdown of every load and deduction." },
  { icon: House, title: "Planned home time", body: "Tell us when you need to be home. Dispatch plans your loads around it, not the other way round." },
  { icon: Truck, title: "Late-model equipment", body: "Well-maintained trucks and trailers, with repairs handled quickly so you spend less time waiting." },
  { icon: Headset, title: "Dispatch that picks up", body: "A dedicated dispatcher and round-the-clock support line, so you are never on your own at 3 a.m." },
  { icon: Fuel, title: "Fuel card and discounts", body: "Company fuel card accepted at major truck stops across the country." },
  { icon: ShieldCheck, title: "Safety first", body: "No forced dispatch. If conditions are unsafe, you park, and we back that decision." },
];

const POSITIONS: { tag: string; title: string; desc: string; items: string[]; value: Position }[] = [
  {
    tag: "Company driver",
    title: "OTR Company Driver",
    desc: "Drive our truck, run our freight. We cover fuel, maintenance and insurance.",
    items: ["Solo, over-the-road", "Paid per mile, weekly", "Assigned truck"],
    value: "Company",
  },
  {
    tag: "Owner-operator",
    title: "Owner-Operator",
    desc: "Bring your own truck and lease on with our authority and freight network.",
    items: ["Percentage of gross", "No forced dispatch", "Transparent load boards"],
    value: "Owner-operator",
  },
  {
    tag: "Team",
    title: "Team Drivers",
    desc: "Run with a partner, cover more miles and split higher weekly earnings.",
    items: ["Couples and friends welcome", "Long-haul lanes", "Split pay, weekly"],
    value: "Team",
  },
];

const REQUIREMENTS = [
  "Valid Class A CDL",
  "Verifiable driving experience",
  "Clean MVR and safety record",
  "Current DOT medical card",
  "Pass DOT drug and alcohol screening",
];

const STEPS = [
  { n: "01", title: "Apply in two minutes", body: "Leave your name and phone number below, or call us directly." },
  { n: "02", title: "Talk with a recruiter", body: "We call you back, answer your questions and go over pay and lanes." },
  { n: "03", title: "Orientation and dispatch", body: "Complete paperwork and screening, meet your dispatcher and take your first load." },
];

const FAQ = [
  {
    question: "How soon do I get paid?",
    answer: "Settlements go out every week by direct deposit. Your recruiter will walk you through the pay schedule and your first settlement date.",
  },
  {
    question: "How often will I be home?",
    answer: "Home time is agreed with you up front and planned by your dispatcher. Tell us what schedule you need when you apply.",
  },
  {
    question: "Do I need to live near Chicago?",
    answer: "Our office is in Elmwood Park, Illinois. Call us to check which hiring areas are open right now.",
  },
  {
    question: "Who do I call with questions?",
    answer: (
      <>
        Call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> or write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. A recruiter
        will get back to you.
      </>
    ),
  },
];

export default function Home() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="hero">
        <div className="container cols hero-cols">
          <div className="hero-text">
            <p className="kicker kicker--line">Now hiring CDL-A drivers</p>
            <h1 className="hero-title">
              <span className="h-line">
                <span>Miles that pay.</span>
              </span>
              <span className="h-line">
                <span>
                  People who <em>answer.</em>
                </span>
              </span>
            </h1>
            <p className="hero-lede">
              ARAM Logistics Inc is a trucking company based in Elmwood Park, Illinois. We hire drivers who want steady
              freight, clear settlements and a dispatch team that knows them by name.
            </p>
            <div className="hero-actions">
              <a href="#apply" className="btn btn--primary btn--lg">
                Start your application <ArrowRight className="btn-icon icon-arrow" aria-hidden />
              </a>
              <a href={PHONE_HREF} className="btn btn--ghost btn--lg">
                <Phone className="btn-icon" aria-hidden /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <figure className="hero-figure">
            <Plate
              className="plate--portrait"
              src="https://images.unsplash.com/photo-1720811559395-3ed8d1b16649?fm=jpg&q=90&w=1600&h=2000&fit=crop&crop=focalpoint&fp-x=0.38&fp-y=0.6"
              alt="Red semi truck on an open highway"
              sizes="(max-width: 959px) 100vw, 520px"
              priority
            />
            <figcaption className="caption">Elmwood Park, Illinois</figcaption>
          </figure>
        </div>
      </section>

      {/* Fact strip */}
      <section className="facts" aria-label="Key facts">
        <div className="container facts-grid">
          {FACTS.map((f, i) => (
            <div className="fact" key={f.label} data-reveal style={{ "--d": i } as React.CSSProperties}>
              <p className={`fact-value${f.accent ? " fact-value--accent" : ""}`}>{f.value}</p>
              <p className="fact-label">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container cols">
          <div>
            <p className="kicker" data-reveal>About the company</p>
            <h2 data-reveal className="h2">A carrier built around the person behind the wheel.</h2>
            <Plate
              className="plate--3x2 about-plate"
              src="https://images.unsplash.com/photo-1778103617525-76877c583fa5?fm=jpg&q=90&w=1600&h=1500&fit=crop"
              alt="Semi truck on a highway past green fields"
              sizes="(max-width: 959px) 100vw, 560px"
            />
          </div>
          <div className="about-right">
            <div className="about-gallery">
              <Plate
                className="plate--portrait"
                src="https://images.unsplash.com/photo-1574757974346-45bae947d89a?fm=jpg&q=90&w=1600&h=2000&fit=crop"
                alt="Truck driver leaning out of the cab window, talking with a yard worker"
                sizes="(max-width: 959px) 50vw, 280px"
              />
              <Plate
                className="plate--portrait"
                src="https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?fm=jpg&q=90&w=1600&h=2000&fit=crop&crop=focalpoint&fp-x=0.55&fp-y=0.6"
                alt="Semi truck parked at a desert truck stop at dusk"
                sizes="(max-width: 959px) 50vw, 280px"
              />
            </div>
            <div className="about-body" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
              <p>
                ARAM Logistics Inc moves freight across the United States from our base in the Chicago area. We keep the
                operation lean on purpose: fewer layers between you and the people who plan your loads, pay your
                settlements and get you home.
              </p>
              <p>
                When you join, you talk to the same dispatcher and the same office every week. Questions about a load, a
                paycheck or a repair get a straight answer the same day.
              </p>
              <div className="about-meta">
                <span>
                  <MapPin className="meta-icon" aria-hidden /> Elmwood Park, IL 60707
                </span>
                <span>
                  <Truck className="meta-icon" aria-hidden /> Interstate carrier
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wide photo band */}
      <div className="container">
        <Plate
          className="plate--band"
          src="https://images.unsplash.com/photo-1766785368863-f2188a8c8b32?fm=jpg&q=90&w=3000&auto=format&fit=crop"
          alt="Trucks on a long highway"
          sizes="(max-width: 1240px) 100vw, 1240px"
        />
      </div>

      {/* Benefits */}
      <section id="benefits" className="section">
        <div className="container">
          <p className="kicker" data-reveal>Why drivers stay</p>
          <h2 data-reveal className="h2 benefits-title">What you get when you drive with us</h2>
          <div className="benefits-grid">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <div className="benefit" key={title} data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
                <Icon className="benefit-icon" aria-hidden />
                <h3 className="benefit-title">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="positions" className="section section--divided">
        <div className="container">
          <p className="kicker" data-reveal>Open positions</p>
          <h2 data-reveal className="h2 positions-title">Choose the seat that fits your life</h2>
          <div className="positions-grid">
            {POSITIONS.map((p, i) => (
              <article className="card" key={p.title} data-reveal style={{ "--d": i } as React.CSSProperties}>
                <span className="tag">{p.tag}</span>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.desc}</p>
                <ul className="dash-list">
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {p.value === "Owner-operator" && (
                  <Link href="/offer" className="card-link">
                    See the full owner-operator offer <ArrowRight className="btn-icon icon-arrow" aria-hidden />
                  </Link>
                )}
                <PositionButton position={p.value} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + How it works */}
      <section id="requirements" className="section section--divided">
        <div className="container cols">
          <div>
            <p className="kicker" data-reveal>Requirements</p>
            <h2 data-reveal className="h2 h2--sm">What you need to apply</h2>
            <ul className="check-list">
              {REQUIREMENTS.map((r, i) => (
                <li key={r} data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <Check className="check-icon" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker" data-reveal>How it works</p>
            <h2 data-reveal className="h2 h2--sm">From application to first load</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.n} data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <span className={`step-num${i === 0 ? " step-num--accent" : ""}`}>{s.n}</span>
                  <div>
                    <h3 className="step-title">{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section--divided">
        <div className="container faq-layout">
          <div>
            <p className="kicker" data-reveal>Questions</p>
            <h2 data-reveal className="h2">Drivers usually ask</h2>
          </div>
          <Accordion items={FAQ} />
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section section--divided">
        <div className="container cols">
          <div>
            <p className="kicker" data-reveal>Get in touch</p>
            <h2 className="apply-title" data-reveal>
              Ready to roll?
              <br />
              <em>Let&apos;s talk.</em>
            </h2>
            <p className="apply-lede" data-reveal style={{ "--d": 1 } as React.CSSProperties}>Call, write or leave your details. A recruiter will contact you within one business day.</p>
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
              <li data-reveal style={{ "--d": 3 } as React.CSSProperties}>
                <MapPin className="contact-icon" aria-hidden />
                <span>
                  {ADDRESS_LINE_1}
                  <br />
                  {ADDRESS_LINE_2}
                </span>
              </li>
            </ul>
          </div>
          <ApplyForm />
        </div>
      </section>

      {/* Visit */}
      <VisitSection />
    </main>
  );
}
