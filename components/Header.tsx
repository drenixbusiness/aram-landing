"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { EMAIL, NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import Logo from "./Logo";

const DESKTOP_QUERY = "(min-width: 960px)";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onMq = () => mq.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Section scrolling (and the clean, hash-free URL) is handled by <HashlessAnchors />; links here only close the menu.

  return (
    <>
      <header className={`site-header${open ? " is-menu-open" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="logo-link" aria-label="ARAM Logistics Inc, home" onClick={close}>
            <Logo className="logo--header" priority />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href="/#apply" className="btn btn--primary header-cta">
            Apply now
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="menu-toggle-icon menu-toggle-icon--open" aria-hidden />
            <X className="menu-toggle-icon menu-toggle-icon--close" aria-hidden />
          </button>
        </div>
      </header>

      {/* Rendered outside the header: its backdrop-filter would otherwise trap position:fixed. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="container mobile-menu-inner">
          <nav aria-label="Mobile">
            <ol className="mm-list">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={l.href} onClick={close}>
                    <span className="mm-num">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mm-actions">
            <Link href="/#apply" className="btn btn--primary btn--lg btn--block" onClick={close}>
              Apply now
            </Link>
            <a href={PHONE_HREF} className="btn btn--ghost btn--lg btn--block">
              <Phone className="btn-icon" aria-hidden /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="mm-email">
              <Mail className="btn-icon" aria-hidden /> {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
