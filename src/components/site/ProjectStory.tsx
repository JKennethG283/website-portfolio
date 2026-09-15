"use client";

import Link from "next/link";
import { ProjectVisual } from "./ProjectVisual";
import type { FeaturedProject } from "@/data/portfolio";
import { useEffect, useRef, useState } from "react";

export function ProjectStory({ projects }: { projects: FeaturedProject[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const chapters = Array.from(
      container.querySelectorAll<HTMLElement>(".story-chapter"),
    );
    const layers = Array.from(
      container.querySelectorAll<HTMLElement>(".story-layer"),
    );
    const desktop = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches) {
        layers.forEach((layer) => {
          layer.style.opacity = "";
          layer.style.transform = "";
        });
        return;
      }
      const anchor = window.innerHeight * 0.56;
      const centers = chapters.map((chapter) => {
        const box = chapter.getBoundingClientRect();
        return box.top + box.height / 2;
      });
      let position = 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (anchor >= centers[i])
          position =
            i +
            Math.min(1, (anchor - centers[i]) / (centers[i + 1] - centers[i]));
      }
      const current = Math.round(position);
      setActive((previous) => (previous === current ? previous : current));
      // Incoming layers cover an opaque previous image; this avoids dark dips during crossfades.
      layers.forEach((layer, i) => {
        layer.style.opacity = String(
          i === 0 ? 1 : Math.max(0, Math.min(1, (position - i + 0.65) / 0.3)),
        );
        layer.style.transform = `scale(${1 + Math.max(0, Math.min(1, position - i + 1)) * 0.035})`;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
    };
  }, [projects]);

  return (
    <div className="project-story" ref={root}>
      <div className="story-stage" aria-hidden="true">
        <div className="story-canvas">
          {projects.map((project, index) => (
            <div
              className="story-layer"
              key={project.id}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <ProjectVisual project={project} />
            </div>
          ))}
        </div>
        <div className="story-pagination">
          <span>SELECTED WORK</span>
          <div>
            {projects.map((project, index) => (
              <span
                className={active === index ? "is-active" : ""}
                key={project.id}
              />
            ))}
          </div>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="story-chapters">
        {projects.map((project, index) => (
          <article className="story-chapter" key={project.id} id={project.id}>
            <div className="mobile-project-image">
              <ProjectVisual project={project} />
            </div>
            <p className="micro-label">
              PROJECT 0{index + 1} <span>/ {project.category}</span>
            </p>
            <h3>{project.name}</h3>
            <p className="project-role">{project.role}</p>
            <p className="chapter-thesis">{project.title}</p>
            <p className="chapter-description">{project.description}</p>
            <ul className="tech-tags" aria-label="Technologies">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <p className="chapter-detail">{project.detail}</p>
            <Link className="text-link" href={`/work/${project.id}`}>
              Explore the project
              <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
