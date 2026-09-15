"use client";

import { useEffect, useRef, type PointerEvent } from "react";

export function RobotMascot({
  open,
  panelId,
  onOpen,
}: {
  open: boolean;
  panelId: string;
  onOpen: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    left: number;
    top: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const direction = useRef(-1);
  const resumeWalking = useRef<(delay?: number) => void>(() => {});

  useEffect(() => {
    const el = root.current;
    if (!el || open) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const hover = matchMedia("(hover: hover)");
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let previous = 0;
    let x = 0;
    let y = 0;
    const left = 8;
    let right = 8;
    let floor = 0;

    const place = () => {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";
    };
    const blocked = () =>
      drag.current ||
      document.hidden ||
      reduced.matches ||
      (hover.matches && el.matches(":hover")) ||
      Boolean(el.querySelector(":focus-visible"));

    const measure = () => {
      const box = el.getBoundingClientRect();
      right = Math.max(8, innerWidth - box.width - 8);
      floor = Math.max(8, innerHeight - box.height - 18);
      x = Math.max(8, Math.min(right, box.left));
      y = Math.max(8, Math.min(floor, box.top));
      place();
    };

    const step = (time: number) => {
      frame = 0;
      if (blocked()) {
        el.dataset.walking = "false";
        return;
      }
      const elapsed = previous ? Math.min(time - previous, 40) / 1000 : 0;
      previous = time;
      // After dragging, settle back to the bottom before continuing the patrol.
      if (y < floor - 1) {
        y = Math.min(floor, y + elapsed * 180);
        el.dataset.walking = "false";
      } else {
        y = floor;
        if (x <= left) direction.current = 1;
        if (x >= right) direction.current = -1;
        el.dataset.direction = direction.current < 0 ? "left" : "right";
        el.dataset.walking = "true";
        const speed = innerWidth < 600 ? 32 : 48;
        x = Math.max(
          left,
          Math.min(right, x + direction.current * elapsed * speed),
        );
        if (elapsed > 0 && (x === left || x === right)) {
          direction.current *= -1;
          place();
          resume(900);
          return;
        }
      }
      place();
      frame = requestAnimationFrame(step);
    };

    function resume(delay = 1000) {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      el!.dataset.walking = "false";
      timer = setTimeout(() => {
        measure();
        if (blocked()) return;
        previous = 0;
        frame = requestAnimationFrame(step);
      }, delay);
    }
    resumeWalking.current = resume;
    const changed = () => resume();
    measure();
    resume();
    window.addEventListener("resize", changed);
    document.addEventListener("visibilitychange", changed);
    reduced.addEventListener("change", changed);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      el.dataset.walking = "false";
      resumeWalking.current = () => {};
      window.removeEventListener("resize", changed);
      document.removeEventListener("visibilitychange", changed);
      reduced.removeEventListener("change", changed);
    };
  }, [open]);

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !root.current) return;
    resumeWalking.current(2500);
    const box = root.current.getBoundingClientRect();
    root.current.dataset.walking = "false";
    root.current.style.left = `${box.left}px`;
    root.current.style.top = `${box.top}px`;
    root.current.style.right = "auto";
    root.current.style.bottom = "auto";
    suppressClick.current = false;
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: box.left,
      top: box.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    const el = root.current;
    if (!session || session.id !== event.pointerId || !el) return;
    const dx = event.clientX - session.startX;
    const dy = event.clientY - session.startY;
    if (Math.hypot(dx, dy) > 6) session.moved = true;
    if (!session.moved) return;
    el.dataset.dragging = "true";
    el.style.left = `${Math.max(8, Math.min(innerWidth - el.offsetWidth - 8, session.left + dx))}px`;
    el.style.top = `${Math.max(8, Math.min(innerHeight - el.offsetHeight - 8, session.top + dy))}px`;
  }
  function end(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    suppressClick.current =
      drag.current.moved || event.type === "pointercancel";
    drag.current = null;
    if (root.current) root.current.dataset.dragging = "false";
    resumeWalking.current(2500);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className="mascot-dock"
      ref={root}
      hidden={open}
      onPointerEnter={() => resumeWalking.current(0)}
      onPointerLeave={() => resumeWalking.current()}
      onFocus={() => resumeWalking.current(0)}
      onBlur={() => resumeWalking.current()}
    >
      <span className="mascot-invitation">
        Ask me anything <span aria-hidden="true">↗</span>
      </span>
      <button
        className="mascot-button"
        type="button"
        aria-label="Open Signal, Jonathan’s portfolio assistant"
        aria-controls={panelId}
        aria-expanded={open}
        aria-describedby="mascot-hint"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onClick={(event) => {
          if (event.detail === 0 || !suppressClick.current) {
            onOpen();
          }
          suppressClick.current = false;
        }}
      >
        <svg
          className="signal-robot"
          viewBox="0 0 100 105"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="robot-shell"
              x1="25"
              y1="20"
              x2="74"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f7fbff" />
              <stop offset=".5" stopColor="#c7d4e9" />
              <stop offset="1" stopColor="#7c91b8" />
            </linearGradient>
            <linearGradient
              id="robot-glass"
              x1="31"
              y1="32"
              x2="65"
              y2="65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#253854" />
              <stop offset="1" stopColor="#091421" />
            </linearGradient>
          </defs>
          <ellipse
            className="robot-shadow"
            cx="50"
            cy="99"
            rx="25"
            ry="4"
            fill="#0b111c"
            opacity=".22"
          />
          <g className="robot-body">
            <path d="M50 23v-9" stroke="#aabbd8" strokeWidth="3" />
            <circle
              className="robot-antenna"
              cx="50"
              cy="11"
              r="4"
              fill="#a7fff0"
            />
            <g className="robot-arm robot-arm--left">
              <rect
                x="14"
                y="57"
                width="10"
                height="24"
                rx="5"
                fill="url(#robot-shell)"
              />
            </g>
            <g className="robot-arm robot-arm--right">
              <rect
                x="76"
                y="57"
                width="10"
                height="24"
                rx="5"
                fill="url(#robot-shell)"
              />
            </g>
            <rect
              x="30"
              y="62"
              width="40"
              height="26"
              rx="13"
              fill="url(#robot-shell)"
            />
            <circle cx="50" cy="76" r="5" fill="#516d91" />
            <circle cx="50" cy="76" r="2.5" fill="#a7fff0" />
            <rect
              x="19"
              y="24"
              width="62"
              height="44"
              rx="19"
              fill="url(#robot-shell)"
              stroke="#eef5ff"
              strokeWidth="1.5"
            />
            <rect
              x="25"
              y="31"
              width="50"
              height="29"
              rx="12"
              fill="url(#robot-glass)"
            />
            <g className="robot-eyes" fill="#a7fff0">
              <rect x="35" y="40" width="7" height="11" rx="3.5" />
              <rect x="58" y="40" width="7" height="11" rx="3.5" />
            </g>
            <path
              d="M46 53q4 3 8 0"
              stroke="#a7fff0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M29 32q7-5 14-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".6"
            />
          </g>
          <rect
            className="robot-foot robot-foot--left"
            x="30"
            y="85"
            width="17"
            height="10"
            rx="5"
            fill="url(#robot-shell)"
          />
          <rect
            className="robot-foot robot-foot--right"
            x="53"
            y="85"
            width="17"
            height="10"
            rx="5"
            fill="url(#robot-shell)"
          />
        </svg>
      </button>
      <span id="mascot-hint" className="mascot-hint">
        Click to chat · drag to move
      </span>
    </div>
  );
}
