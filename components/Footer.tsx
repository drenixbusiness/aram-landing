import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="footer-logo" aria-label="ARAM Logistics Inc, home">
          <Logo className="logo--footer" />
        </Link>
        <span>39 W Conti Pkwy, Apt 1W, Elmwood Park, IL 60707</span>
        <nav className="footer-legal" aria-label="Legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </nav>
        <span>© 2026 ARAM Logistics Inc</span>
      </div>
    </footer>
  );
}
