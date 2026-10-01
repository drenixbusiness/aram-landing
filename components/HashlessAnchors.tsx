"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Drops "#section" from the address bar, keeping only the clean page URL. */
function stripHash() {
  if (window.location.hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
}

/**
 * In-page links (e.g. "/#benefits") scroll to their section without putting "#benefits"
 * in the address bar, so the URL always looks like a plain page address.
 */
export default function HashlessAnchors() {
  const pathname = usePathname();

  // Arriving with a hash (shared link, or a section link from another page):
  // land on the section, then clean the URL.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    stripHash();
  }, [pathname]);

  useEffect(() => {
    // Capture phase: runs before Next's <Link>, which then sees defaultPrevented and stands down.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;

      e.preventDefault();
      document.body.style.overflow = ""; // in case the mobile menu's scroll lock is still on
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      stripHash();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
