"use client";

import { useEffect, useState } from "react";
import { telHref } from "../site.config";

/**
 * Scroll-driven chrome that sits outside the static markup:
 *
 * - The header gains a solid backdrop and hairline once the page scrolls, so it
 *   floats cleanly over the hero and stays legible over everything after it.
 * - The mobile bar stays hidden until the hero leaves the viewport, so it never
 *   duplicates the hero's own call to action on the same screen.
 */
export default function SiteChrome() {
  const [pastHero, setPastHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hero = document.getElementById("top");
    let observer: IntersectionObserver | undefined;

    if (hero) {
      observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
        rootMargin: "-40px 0px 0px 0px",
      });
      observer.observe(hero);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  // The header is server-rendered; this only toggles its state attribute.
  useEffect(() => {
    document.querySelector(".nav")?.setAttribute("data-scrolled", String(scrolled));
  }, [scrolled]);

  // CSS `scroll-behavior: smooth` silently no-ops in some Chrome configurations,
  // which leaves every in-page anchor looking broken. Drive the scroll ourselves
  // so behaviour is identical everywhere, with a proper sticky-header offset.
  useEffect(() => {
    const HEADER_OFFSET = 84;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function scrollToY(targetY: number, done?: () => void) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.max(0, Math.min(targetY, max));
      const start = window.pageYOffset;
      const delta = target - start;
      if (reduce || Math.abs(delta) < 2) {
        window.scrollTo(0, target);
        done?.();
        return;
      }
      const dur = Math.min(900, Math.max(380, Math.abs(delta) * 0.5));
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        window.scrollTo(0, Math.round(start + delta * ease(p)));
        if (p < 1) requestAnimationFrame(step);
        else done?.();
      };
      requestAnimationFrame(step);
    }

    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      ev.preventDefault();
      scrollToY(el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET, () => {
        history.replaceState(null, "", `#${id}`);
        el.setAttribute("tabindex", "-1");
        (el as HTMLElement).focus({ preventScroll: true });
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="mobileBar" data-visible={pastHero ? "true" : "false"}>
      <a className="mobileBarCall" href={telHref}>
        <span aria-hidden="true">✆</span> Call
      </a>
      <a className="mobileBarCta" href="#contact">
        Free mockup <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
