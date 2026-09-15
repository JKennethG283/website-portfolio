"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type RevealSectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function RevealSection({
  children,
  className = "",
  ...rest
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    // Content is visible before hydration and if JavaScript is unavailable.
    if (el.getBoundingClientRect().top > window.innerHeight)
      el.classList.add("will-reveal");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          io.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      {...rest}
      className={`reveal-section${className ? ` ${className}` : ""}`}
    >
      {children}
    </section>
  );
}
