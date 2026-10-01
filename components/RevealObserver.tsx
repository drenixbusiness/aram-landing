"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds .is-visible to [data-reveal] elements once they reach the viewport.
 *
 * Anything whose top is above the reveal line counts, including elements the page
 * jumped or scrolled straight past (anchor links, fast flings, End key), so nothing
 * can stay hidden. New elements (client navigation, re-renders) are picked up too.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const pending = new Set<HTMLElement>();
    let frame = 0;

    const collect = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) => pending.add(el));

    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.92;
      for (const el of pending) {
        if (!el.isConnected) {
          pending.delete(el);
          continue;
        }
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("is-visible");
          pending.delete(el);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    collect();
    check();
    // Tells the fail-safe in <head> that reveals are running.
    root.setAttribute("data-reveal-ready", "");

    const mo = new MutationObserver(() => {
      collect();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    // Safety net for anything that skips scroll events (browser quirks, throttled tabs).
    const sweep = window.setInterval(() => pending.size && check(), 1000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(sweep);
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [pathname]);

  return null;
}
