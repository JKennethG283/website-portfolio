"use client";

import Image from "next/image";
import { useRef } from "react";

function PlaygroundCard({
  preview,
  title,
  description,
  href,
  cta,
  icon,
}: {
  preview: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--rx", `${-y * 4}deg`);
    card.style.setProperty("--ry", `${x * 4}deg`);
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={cardRef}
      className="pg-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {preview}
      <div className="pg-card-body">
        <div className="pg-card-title-row">
          <span className="pg-card-icon">{icon}</span>
          <div>
            <h3 className="pg-card-title">{title}</h3>
            <p className="pg-card-desc">{description}</p>
          </div>
        </div>
        <a href={href} className="pg-card-cta">
          {cta} <span className="pg-card-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

export function PlaygroundCards() {
  return (
    <div className="pg-grid">
      <PlaygroundCard
        title="Hand Tracking AI"
        description="Real-time finger tracking with computer vision."
        href="/object-detection"
        cta="Try live demo"
        icon={
          <Image
            src="/images/Hand_Icon.png"
            alt=""
            width={44}
            height={44}
            className="pg-icon-img"
          />
        }
        preview={
          <div className="pg-preview">
            <Image
              src="/images/Hand_Demo.png"
              alt="Hand tracking AI demo preview"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className="pg-preview-img"
            />
            <div className="pg-preview-overlay" />
          </div>
        }
      />
      <PlaygroundCard
        title="Rock Paper Scissors AI"
        description="An AI opponent that learns your patterns every round."
        href="/rps-markov"
        cta="Challenge the AI"
        icon={
          <Image
            src="/images/RPS_Icon.png"
            alt=""
            width={44}
            height={44}
            className="pg-icon-img"
          />
        }
        preview={
          <div className="pg-preview">
            <Image
              src="/images/RPS_Demo.png"
              alt="Rock Paper Scissors AI demo preview"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className="pg-preview-img"
            />
            <div className="pg-preview-overlay" />
          </div>
        }
      />
    </div>
  );
}
