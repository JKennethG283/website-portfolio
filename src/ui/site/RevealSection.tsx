"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      queueMicrotask(() => setVisible(true));
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
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
      className={`reveal-section${visible ? " is-revealed" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </section>
  );
}
