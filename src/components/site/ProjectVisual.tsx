import Image from "next/image";
import type { FeaturedProject } from "@/data/portfolio";

export function ProjectVisual({ project }: { project: FeaturedProject }) {
  return (
    <div className={`product-visual product-visual--${project.imageFormat}`}>
      <Image
        src={project.backdrop}
        alt=""
        fill
        sizes="(max-width: 700px) 100vw, 60vw"
        className="product-backdrop"
      />
      <span className="visual-status">{project.status}</span>
      <div className="product-capture">
        <div className="capture-window">
          {project.imageFormat === "desktop" && (
            <div className="capture-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>{project.name}</p>
            </div>
          )}
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={project.imageFormat === "mobile" ? 390 : 1440}
            height={project.imageFormat === "mobile" ? 844 : 1000}
            sizes={
              project.imageFormat === "mobile"
                ? "300px"
                : "(max-width: 700px) 100vw, 60vw"
            }
            className="product-screenshot"
          />
        </div>
      </div>
      <div className="visual-caption">
        <span>{project.caption}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </div>
  );
}
