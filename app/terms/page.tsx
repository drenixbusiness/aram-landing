import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms that apply when you use the ARAM Logistics Inc website and apply for a driving position.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: (
      <p>
        By using this website or sending an application through it, you agree to these Terms and Conditions and to
        our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the website.
      </p>
    ),
  },
  {
    id: "purpose",
    title: "Purpose of this website",
    body: (
      <p>
        This website gives drivers general information about ARAM Logistics Inc and a way to contact our recruiting
        team. It is provided for information only.
      </p>
    ),
  },
  {
    id: "no-offer",
    title: "No offer of employment or contract",
    body: (
      <>
        <p>
          Nothing on this website is an offer of employment, a lease agreement or a contract. Sending an application
          does not guarantee an interview, a position or any particular pay, lanes, equipment or home time.
        </p>
        <p>
          Any job offer or owner-operator lease will be made in a separate written agreement. The terms of that
          agreement will control over anything described on this website. Descriptions of positions, pay and benefits
          are general and may change without notice.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility and hiring checks",
    body: (
      <p>
        All positions depend on meeting our requirements and the rules that apply to commercial motor vehicle
        drivers, including a valid Class A CDL, a current DOT medical card, a review of your driving record and safety
        history, and DOT drug and alcohol testing. We will ask for your separate authorization before running any of
        these checks.
      </p>
    ),
  },
  {
    id: "your-information",
    title: "Information you send us",
    body: (
      <p>
        You agree that the information you give us is true, accurate and your own. Please do not send sensitive
        information such as your Social Security number, license images or bank details through the website form; a
        recruiter will tell you how to provide those securely if they are needed.
      </p>
    ),
  },
  {
    id: "communications",
    title: "Consent to be contacted",
    body: (
      <p>
        By sending the application form, you agree that ARAM Logistics Inc may contact you by phone call, text message
        or email about driving positions. Message and data rates may apply. You can opt out at any time by telling a
        recruiter, replying STOP to a text message, or writing to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>send false, misleading or someone else&apos;s information;</li>
          <li>send spam or automated submissions through the form;</li>
          <li>try to disrupt, damage or gain unauthorized access to the website;</li>
          <li>use the website for any unlawful purpose.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        The ARAM Logistics Inc name, logo and the text of this website belong to ARAM Logistics Inc and may not be
        used without our written permission. Photographs are used under the Unsplash License and belong to their
        photographers.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    body: (
      <p>
        The website may link to other websites, such as Google Maps for directions. We are not responsible for the
        content or practices of those websites.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: (
      <p>
        We work to keep the information on this website accurate and current, but the website is provided &ldquo;as
        is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, to the fullest extent the law
        allows. We do not promise that the website will always be available or free of errors.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the fullest extent the law allows, ARAM Logistics Inc is not liable for any indirect, incidental or
        consequential damages arising from your use of this website. Nothing in these terms limits any rights you
        have that cannot be limited by law.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the State of Illinois, without regard to its conflict-of-law rules.
        Any dispute about this website will be handled in the state or federal courts located in Cook County,
        Illinois.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. When we do, we will change the effective date at the top of this
        page. Using the website after a change means you accept the updated terms.
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      effective="September 30, 2026"
      intro={
        <p>
          These terms apply to your use of the ARAM Logistics Inc website and to any application you send through it.
          Please read them carefully.
        </p>
      }
      sections={sections}
    />
  );
}
