"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mapGroups, mapProjects, sharedTopics, type MapGroup } from "./data";
import { projectPoint, spherePoint } from "./graph";
import "./project-map.css";

const points = mapProjects.map((_, i) => spherePoint(i, mapProjects.length));
const dust = Array.from({ length: 220 }, (_, i) => spherePoint(i, 220));
const edges = mapProjects.flatMap((a, i) =>
  mapProjects.flatMap((b, j) =>
    j > i && sharedTopics(a, b).length ? [{ a: i, b: j }] : [],
  ),
);

export function ProjectMap() {
  const [selected, setSelected] = useState(mapProjects[0].id);
  const [filter, setFilter] = useState<MapGroup | "all">("all");
  const [paused, setPaused] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const rotation = useRef({ yaw: 0.4, tilt: -0.15 });
  const interaction = useRef({
    hovering: false,
    focusing: false,
    dragging: false,
    x: 0,
    y: 0,
  });
  const invalidate = useRef<() => void>(() => {});
  const project = mapProjects.find((p) => p.id === selected)!;
  const related = mapProjects
    .filter((p) => p.id !== selected && sharedTopics(project, p).length)
    .sort(
      (a, b) =>
        sharedTopics(project, b).length - sharedTopics(project, a).length,
    );

  useEffect(() => {
    const host = scene.current;
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!host || !surface || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame = 0,
      previous = 0,
      visible = false;
    const activeIndex = mapProjects.findIndex((p) => p.id === selected);
    const matches = (i: number) =>
      filter === "all" || mapProjects[i].group === filter;
    const draw = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) {
        previous = 0;
        return;
      }
      const held = interaction.current;
      const spinning =
        !paused &&
        !reduced.matches &&
        !held.hovering &&
        !held.focusing &&
        !held.dragging;
      if (spinning && previous)
        rotation.current.yaw += Math.min(time - previous, 40) * 0.000085;
      previous = time;
      const { yaw, tilt } = rotation.current;
      const radius = Math.min(width * 0.34, height * 0.37);
      const project = (p: { x: number; y: number; z: number }) =>
        projectPoint(p, yaw, tilt, radius, width, height);
      const projected = points.map(project);
      ctx.clearRect(0, 0, width, height);
      const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        radius * 1.45,
      );
      glow.addColorStop(0, "#7876d61e");
      glow.addColorStop(0.55, "#6093d90d");
      glow.addColorStop(1, "#6093d900");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      // Great circles and dust share the projects' 3D transform.
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const a = (step / 100) * Math.PI * 2;
          const c = Math.cos(a),
            s = Math.sin(a);
          const p = project(
            ring === 0
              ? { x: c, y: s, z: 0 }
              : ring === 1
                ? { x: 0, y: c, z: s }
                : { x: s, y: 0, z: c },
          );
          if (!step) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "#9cacf322";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      for (const particle of dust) {
        const p = project(particle);
        ctx.globalAlpha = 0.12 + (p.z + 1) * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#adbcff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const edge of edges) {
        const a = projected[edge.a],
          b = projected[edge.b];
        const active = edge.a === activeIndex || edge.b === activeIndex;
        ctx.globalAlpha =
          !matches(edge.a) || !matches(edge.b) ? 0.025 : active ? 0.45 : 0.065;
        ctx.strokeStyle = active
          ? mapGroups[mapProjects[activeIndex].group].color
          : "#b4bde7";
        ctx.lineWidth = active ? 1 : 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      projected.forEach((p, i) => {
        const button = buttons.current[i];
        if (!button) return;
        const active = i === activeIndex;
        const scale = 0.8 + (p.z + 1) * 0.13;
        button.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${scale})`;
        button.style.zIndex = String(active ? 100 : Math.round((p.z + 1) * 30));
        button.style.opacity = String(
          matches(i) ? (active ? 1 : 0.55 + (p.z + 1) * 0.225) : 0.15,
        );
        button.dataset.front = String(p.z > -0.15 || active);
      });
      if (spinning) frame = requestAnimationFrame(draw);
    };
    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    invalidate.current = requestDraw;
    const resize = new ResizeObserver(() => {
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      requestDraw();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previous = 0;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestDraw();
    });
    const visibility = () => {
      previous = 0;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestDraw();
    };
    resize.observe(host);
    intersection.observe(host);
    reduced.addEventListener("change", requestDraw);
    document.addEventListener("visibilitychange", visibility);
    host.classList.add("is-ready");
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      reduced.removeEventListener("change", requestDraw);
      document.removeEventListener("visibilitychange", visibility);
      invalidate.current = () => {};
      host.classList.remove("is-ready");
    };
  }, [selected, filter, paused]);

  const selectProject = (id: string) => {
    setSelected(id);
    const chosen = mapProjects.find((p) => p.id === id)!;
    if (filter !== "all" && chosen.group !== filter) setFilter("all");
  };

  return (
    <section
      id="project-map"
      className="project-map-section wide-container"
      aria-labelledby="project-map-title"
    >
      <div className="section-intro">
        <div>
          <p className="micro-label">THE PROJECT CONSTELLATION</p>
          <h2 id="project-map-title">
            Different ideas.
            <br />
            <span>Shared connections.</span>
          </h2>
        </div>
        <p>
          Explore the threads between my projects.
          <br />
          Select a point. See where it leads.
        </p>
      </div>
      <div className="project-map-shell">
        <div className="map-toolbar">
          <div
            className="map-filters"
            role="group"
            aria-label="Filter project map"
          >
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All work <span>{mapProjects.length}</span>
            </button>
            {(Object.keys(mapGroups) as MapGroup[]).map((group) => (
              <button
                key={group}
                type="button"
                aria-pressed={filter === group}
                style={
                  { "--node-color": mapGroups[group].color } as CSSProperties
                }
                onClick={() => {
                  setFilter(group);
                  setSelected(mapProjects.find((p) => p.group === group)!.id);
                }}
              >
                <i aria-hidden="true" />
                {mapGroups[group].name}
              </button>
            ))}
          </div>
          <button
            className="map-motion"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{" "}
            {paused ? "Resume rotation" : "Pause rotation"}
          </button>
          <span className="map-reduced-note">Reduced motion enabled</span>
        </div>
        <div className="map-layout">
          <div
            className="project-map-scene"
            ref={scene}
            aria-label="Rotating 3D project map"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              interaction.current.dragging = true;
              interaction.current.x = event.clientX;
              interaction.current.y = event.clientY;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const state = interaction.current;
              if (!state.dragging) return;
              rotation.current.yaw += (event.clientX - state.x) * 0.008;
              rotation.current.tilt = Math.max(
                -0.7,
                Math.min(
                  0.7,
                  rotation.current.tilt + (event.clientY - state.y) * 0.004,
                ),
              );
              state.x = event.clientX;
              state.y = event.clientY;
              invalidate.current();
            }}
            onLostPointerCapture={() => {
              interaction.current.dragging = false;
              invalidate.current();
            }}
            onPointerUp={(event) => {
              interaction.current.dragging = false;
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
              invalidate.current();
            }}
            onPointerCancel={() => {
              interaction.current.dragging = false;
              invalidate.current();
            }}
            onFocusCapture={() => {
              interaction.current.focusing = true;
              invalidate.current();
            }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                interaction.current.focusing = false;
                invalidate.current();
              }
            }}
          >
            <canvas ref={canvas} aria-hidden="true" />
            <span className="map-scene-label" aria-hidden="true">
              A BODY OF WORK
              <br />
              <b>Connected by curiosity.</b>
            </span>
            <div className="map-nodes">
              {mapProjects.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className="map-node"
                  ref={(node) => {
                    buttons.current[i] = node;
                  }}
                  style={
                    {
                      "--node-color": mapGroups[p.group].color,
                    } as CSSProperties
                  }
                  aria-label={`Explore ${p.name}`}
                  aria-pressed={selected === p.id}
                  aria-controls="map-project-detail"
                  disabled={filter !== "all" && p.group !== filter}
                  onClick={() => selectProject(p.id)}
                  onPointerEnter={() => {
                    interaction.current.hovering = true;
                    invalidate.current();
                  }}
                  onPointerLeave={() => {
                    interaction.current.hovering = false;
                    invalidate.current();
                  }}
                >
                  <i aria-hidden="true" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <p className="map-gesture-hint">
              Drag to rotate <span>·</span> Select a project to explore
            </p>
          </div>
          <aside
            className="map-detail"
            id="map-project-detail"
            style={
              {
                "--node-color": mapGroups[project.group].color,
              } as CSSProperties
            }
          >
            <label htmlFor="map-project-select">Jump to a project</label>
            <select
              id="map-project-select"
              value={selected}
              onChange={(event) => selectProject(event.target.value)}
            >
              {mapProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div
              className="map-project-copy"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="map-category">
                <i aria-hidden="true" />
                {mapGroups[project.group].name}
              </p>
              <h3>{project.name}</h3>
              <p className="map-description">{project.description}</p>
            </div>
            <ul className="map-topics" aria-label="Project themes">
              {project.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <Link
              className="text-link map-project-link"
              href={project.href}
              target={project.external ? "_blank" : undefined}
              rel={project.external ? "noopener noreferrer" : undefined}
            >
              {project.cta}
              <span aria-hidden="true">↗</span>
            </Link>
            <div className="map-related">
              <p>CONNECTED THROUGH SHARED THEMES</p>
              {related.slice(0, 3).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                >
                  <span>{p.name}</span>
                  <small>{sharedTopics(project, p)[0]}</small>
                  <b aria-hidden="true">↗</b>
                </button>
              ))}
            </div>
          </aside>
        </div>
        <div className="map-footnote">
          <span>Each line connects projects with a shared theme.</span>
          <a
            href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inspired by interconnected knowledge ↗
          </a>
        </div>
      </div>
      <details className="map-directory">
        <summary>
          Browse all {mapProjects.length} projects & contributions{" "}
          <span aria-hidden="true">+</span>
        </summary>
        <ul>
          {mapProjects.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                target={p.external ? "_blank" : undefined}
                rel={p.external ? "noopener noreferrer" : undefined}
              >
                {p.name}
                <span>{mapGroups[p.group].name} ↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
