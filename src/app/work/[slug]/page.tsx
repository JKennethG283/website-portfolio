import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectVisual } from "@/components/site/ProjectVisual";
import { featuredProjects } from "@/data/portfolio";
import { caseStudies } from "@/data/project-case-studies";

export const dynamicParams = false;
export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((project) => project.slug === slug);
  if (!project) notFound();
  return {
    title: `${project.name} — Jonathan Kenneth`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = caseStudies.find((project) => project.slug === slug);
  if (!project) notFound();
  const featured = featuredProjects.find((item) => item.id === slug);
  const next =
    caseStudies[(caseStudies.indexOf(project) + 1) % caseStudies.length];

  return (
    <>
      <a className="skip-link" href="#case-content">
        Skip to content
      </a>
      <header className="case-header wide-container">
        <Link className="wordmark" href="/">
          <span className="brand-symbol" aria-hidden="true">
            ✳
          </span>
          Jonathan Kenneth.
        </Link>
        <Link className="text-link" href="/#projects">
          All projects <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main
        className="landscape-portfolio case-page wide-container"
        id="case-content"
      >
        <div className="case-intro">
          <p className="micro-label">{project.category}</p>
          <p className="case-project-name">{project.name}</p>
          <h1>{project.headline}</h1>
          <p className="case-summary">{project.summary}</p>
        </div>
        <dl className="case-facts">
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{project.tags.join(" · ")}</dd>
          </div>
        </dl>
        {featured && (
          <div className="case-featured-visual">
            <ProjectVisual project={featured} />
          </div>
        )}
        <div className="case-sections">
          {project.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
        {project.gallery?.map((item) => (
          <figure
            className={`case-gallery${item.mobile ? " case-gallery--mobile" : ""}`}
            key={item.src}
          >
            <a
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open full image: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width ?? (item.mobile ? 390 : 1440)}
                height={item.height ?? (item.mobile ? 844 : 1000)}
                sizes={item.mobile ? "390px" : "(max-width: 700px) 100vw, 80vw"}
              />
            </a>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
        <div className="case-actions">
          {project.links?.map((link) => (
            <a
              className="pill-link pill-link--light"
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <Link className="text-link" href="/#contact">
            Discuss this project <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <nav className="case-next" aria-label="Project navigation">
          <Link href="/#projects">← All projects</Link>
          <Link href={`/work/${next.slug}`}>Next: {next.name} →</Link>
        </nav>
      </main>
    </>
  );
}
