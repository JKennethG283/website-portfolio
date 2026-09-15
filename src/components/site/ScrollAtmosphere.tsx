"use client";

import { useEffect } from "react";

/** Native scrolling, with one animation-frame update and no React render per frame. */
export function ScrollAtmosphere() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".landscape-hero");
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    const contact = document.querySelector<HTMLElement>(".contact-landscape");
    let frame = 0;
    const update = () => {
      frame = 0;
      const still = motion.matches;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty(
        "--progress",
        String(range > 0 ? window.scrollY / range : 0),
      );
      if (hero) {
        const offset = Math.min(window.scrollY, hero.offsetHeight);
        hero.style.setProperty(
          "--parallax",
          still ? "0px" : `${offset * 0.23}px`,
        );
        const amount = still ? 0 : offset / hero.offsetHeight;
        hero.style.setProperty("--journey", String(amount));
        hero.style.setProperty(
          "--stars-far-y",
          `${still ? 0 : offset * -0.12}px`,
        );
        hero.style.setProperty(
          "--stars-near-y",
          `${still ? 0 : offset * -0.29}px`,
        );
        hero.style.setProperty("--stars-x", `${still ? 0 : offset * 0.08}px`);
        hero.style.setProperty(
          "--ridge-far-y",
          `${still ? 0 : offset * 0.12}px`,
        );
        hero.style.setProperty(
          "--ridge-near-y",
          `${still ? 0 : offset * 0.28}px`,
        );
        hero.style.setProperty("--landscape-scale", String(1 + amount * 0.08));
      }
      if (contact) {
        const box = contact.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0)
          contact.style.setProperty(
            "--contact-drift",
            `${still ? 0 : (innerHeight / 2 - box.top - box.height / 2) * 0.12}px`,
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
