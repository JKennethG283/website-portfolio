"use client";

import { useEffect } from "react";

/** Native scrolling, with one animation-frame update and no React render per frame. */
export function ScrollAtmosphere() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".landscape-hero");
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty(
        "--progress",
        String(range > 0 ? window.scrollY / range : 0),
      );
      if (hero) {
        const offset = Math.min(window.scrollY, hero.offsetHeight);
        hero.style.setProperty(
          "--parallax",
          motion.matches ? "0px" : `${offset * 0.23}px`,
        );
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      resize.disconnect();
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true" />;
}
