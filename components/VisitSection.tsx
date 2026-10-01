import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import OfficeMap from "./OfficeMap";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, DIRECTIONS_URL, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function VisitSection() {
  return (
    <section id="visit" className="section section--divided">
      <div className="container">
        <div className="visit-panel" data-reveal>
          <div className="visit-info">
            <p className="kicker">Our office</p>
            <h2 className="h2 h2--sm">Visit us in Elmwood Park</h2>
            <p className="visit-lede">
              Our office is in Elmwood Park, just west of Chicago. Stop by, or call ahead and we&apos;ll set up a time
              to meet.
            </p>

            <dl className="visit-list">
              <div className="visit-row">
                <span className="visit-badge" aria-hidden>
                  <MapPin />
                </span>
                <div>
                  <dt>Office</dt>
                  <dd>
                    {ADDRESS_LINE_1}
                    <br />
                    {ADDRESS_LINE_2}
                  </dd>
                </div>
              </div>
              <div className="visit-row">
                <span className="visit-badge" aria-hidden>
                  <Phone />
                </span>
                <div>
                  <dt>Recruiting</dt>
                  <dd>
                    <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
                  </dd>
                </div>
              </div>
              <div className="visit-row">
                <span className="visit-badge" aria-hidden>
                  <Mail />
                </span>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </dd>
                </div>
              </div>
            </dl>

            <a href={DIRECTIONS_URL} target="_blank" rel="noopener" className="btn btn--primary btn--lg visit-btn">
              <Navigation className="btn-icon" aria-hidden /> Get directions
            </a>
          </div>

          <div className="visit-map">
            <OfficeMap />
          </div>
        </div>
      </div>
    </section>
  );
}
