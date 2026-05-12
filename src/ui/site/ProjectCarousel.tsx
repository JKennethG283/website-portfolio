"use client";

import { type ReactNode, useRef } from "react";

type ProjectCarouselProps = {
  children: ReactNode;
};

export function ProjectCarousel({ children }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>(".project-card");
    if (!firstCard) return;

    const trackStyle = window.getComputedStyle(track);
    const gap =
      Number.parseFloat(trackStyle.columnGap || "0") ||
      Number.parseFloat(trackStyle.gap || "0");
    const cardWidth = firstCard.offsetWidth + gap;
    const amount = cardWidth * 3;

    track.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="projects-carousel">
      <div className="projects-carousel-controls" aria-label="Project carousel controls">
        <button
          type="button"
          className="projects-arrow"
          onClick={() => scrollByCards("left")}
          aria-label="Scroll projects left"
        >
          &#8592;
        </button>
        <button
          type="button"
          className="projects-arrow"
          onClick={() => scrollByCards("right")}
          aria-label="Scroll projects right"
        >
          &#8594;
        </button>
      </div>
      <div className="projects-grid" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}
