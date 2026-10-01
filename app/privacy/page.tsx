import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ARAM Logistics Inc collects, uses and protects the information drivers share through this website.",
};

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>When you use the quick application form, we collect the information you choose to give us:</p>
        <ul>
          <li>your full name;</li>
          <li>your phone number;</li>
          <li>the state you live in;</li>
          <li>your CDL-A experience range;</li>
          <li>the position you are interested in (company driver, owner-operator or team);</li>
          <li>your agreement to be contacted about driving positions.</li>
        </ul>
        <p>
          If you call or email us, we also keep the details you share in that conversation, such as your email
          address, driving history and availability.
        </p>
        <p>
          Like most websites, our hosting provider automatically records basic technical data when you visit, such as
          your IP address, browser type, the pages you view and the time of your visit. We do not use advertising
          cookies or third-party tracking pixels on this website.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <>
        <p>We use your information only to:</p>
        <ul>
          <li>contact you about driving positions with ARAM Logistics Inc;</li>
          <li>review your application and qualifications;</li>
          <li>carry out the pre-hire checks that federal and state rules require for commercial drivers, with your separate authorization;</li>
          <li>keep this website secure and working properly;</li>
          <li>meet our legal and regulatory obligations.</li>
        </ul>
        <p>We do not sell your personal information, and we do not share it with anyone for their own marketing.</p>
      </>
    ),
  },
  {
    id: "calls-and-texts",
    title: "Calls and text messages",
    body: (
      <>
        <p>
          By sending the application form, you agree that a recruiter from ARAM Logistics Inc may call or text you at
          the phone number you provided about driving positions. Message and data rates may apply. You can ask us to
          stop at any time by telling the recruiter, replying STOP to a text message, or writing to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <p>Your phone number and consent to receive texts are never shared with third parties for marketing purposes.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "When we share information",
    body: (
      <>
        <p>We share personal information only in these cases:</p>
        <ul>
          <li>
            <strong>Service providers.</strong> Form submissions are delivered to our private recruiting group on
            Telegram, and the website is run by a hosting provider. They process your data only to provide those
            services to us.
          </li>
          <li>
            <strong>Hiring checks.</strong> If you move forward in the hiring process, we may share information with
            background, drug-testing and driving-record providers, and with prior employers, as required for
            commercial drivers and only with your authorization.
          </li>
          <li>
            <strong>Legal reasons.</strong> When the law requires it, or to protect the rights and safety of our
            drivers, our company or the public.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep application details for as long as we need them to consider you for a position, and afterwards only
        as long as the law requires or allows. If you are hired, your information becomes part of your driver
        qualification and employment records, which we keep for the periods set by federal and state rules.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We use reasonable administrative and technical safeguards to protect your information, and the website is
        served over an encrypted connection. No method of transmission or storage is completely secure, so please do
        not send sensitive information such as your Social Security number through the website form.
      </p>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    body: (
      <>
        <p>
          You can ask us to show you the personal information we hold about you, correct it, or delete it, and you can
          withdraw your consent to be contacted at any time. Depending on the state you live in, you may have
          additional rights under state privacy law. We will not treat you differently for using any of these rights.
        </p>
        <p>
          To make a request, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call{" "}
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>. We may need to confirm your identity before we act on it.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-party content and services",
    body: (
      <p>
        Photographs on this website come from Unsplash and are served through our own website. The office map is drawn with map tiles from CARTO based on OpenStreetMap data, so your browser requests
        those tiles from CARTO's servers when the map comes into view. The &ldquo;Get directions&rdquo; link opens
        Google Maps. These services have their own privacy practices, which we do not control.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is intended for adults seeking commercial driving work. We do not knowingly collect information
        from anyone under 18. If you believe a minor has sent us information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will change the effective date at the top
        of this page. Please also read our <Link href="/terms">Terms and Conditions</Link>.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <address className="legal-address">
        ARAM Logistics Inc
        <br />
        {ADDRESS_LINE_1}
        <br />
        {ADDRESS_LINE_2}
        <br />
        <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        <br />
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </address>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effective="September 30, 2026"
      intro={
        <p>
          This policy explains what information ARAM Logistics Inc collects when you visit this website or apply for a
          driving position, how we use it, and the choices you have.
        </p>
      }
      sections={sections}
    />
  );
}
