import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site/SiteHeader";
import { RevealSection } from "@/components/site/RevealSection";
import { ProjectStory } from "@/components/site/ProjectStory";
import { ScrollAtmosphere } from "@/components/site/ScrollAtmosphere";
import { ProjectMap } from "@/features/project-map/ProjectMap";

import {
  featuredProjects,
  supportingProjects,
  earlierProjects,
} from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollAtmosphere />
      <SiteHeader />
      <main id="main-content" className="landscape-portfolio">
        <section
          className="landscape-hero"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-landscape" aria-hidden="true">
            <Image
              src="/images/landscapes/alpine-night.jpg"
              alt=""
              fill
              preload
              sizes="(max-width: 700px) 1400px, 100vw"
              className="hero-landscape-image"
            />
          </div>
          <div className="hero-wash" />
          <div className="wide-container hero-layout">
            <div className="hero-intro">
              <span className="signal-dot" /> AI PRODUCT DEVELOPER{" "}
              <span className="hero-location">SYDNEY, AU</span>
            </div>
            <h1 id="hero-title">
              Finding signal.
              <br />
              <span>Building what’s next.</span>
            </h1>
            <div className="hero-bottom-copy">
              <p>
                I’m Jonathan Kenneth Gunawan.
                <br />I build AI products across workflows, markets, and mobile.
                <br className="desktop-break" /> Currently an intern at
                Gradstack and an AI student at UTS.
              </p>
              <a className="pill-link pill-link--light" href="#projects">
                Explore my work <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hero-baseline">
              <a href="#projects" className="scroll-cue">
                <span aria-hidden="true">↓</span> SCROLL TO EXPLORE
              </a>
              <span>ARTIFICIAL INTELLIGENCE. HUMAN CURIOSITY.</span>
            </div>
          </div>
        </section>

        <div className="focus-strip" aria-label="Focus areas">
          <div className="wide-container">
            <span>AI products & agents</span>
            <i aria-hidden="true">✳</i>
            <span>Machine learning</span>
            <i aria-hidden="true">✳</i>
            <span>Voice & mobile</span>
            <i aria-hidden="true">✳</i>
            <span>Full-stack development</span>
          </div>
        </div>

        <RevealSection
          className="experience-section wide-container"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="experience-intro">
            <p className="micro-label">CURRENTLY BUILDING WITH</p>
            <h2 id="experience-title">
              Gradstack<span>®</span>
            </h2>
            <p className="experience-dates">
              Intern · <time dateTime="2026-07">July 2026</time>–present
            </p>
            <span className="experience-status">
              <span className="signal-dot" /> Sydney · AI & software development
            </span>
          </div>
          <div className="experience-detail">
            <h3>Turning learning and assessment into usable software.</h3>
            <p>
              I contribute to Gradstack’s AI fluency assessment and learning
              platform as part of the engineering team.
            </p>
            <ul>
              <li>
                Built candidate-facing assessment and results experiences,
                including downloadable result summaries.
              </li>
              <li>
                Worked on searchable learning catalogues and interfaces that
                help learners find a starting point.
              </li>
              <li>
                Contributed to the data models behind learning progress and
                achievements.
              </li>
            </ul>
            <p className="experience-note">
              Team contributions · Public overview
            </p>
          </div>
        </RevealSection>

        <section
          className="work-section wide-container"
          id="projects"
          aria-labelledby="work-title"
        >
          <RevealSection className="work-heading">
            <div>
              <p className="micro-label">SELECTED WORK</p>
              <h2 id="work-title">
                Ideas, made <span>real.</span>
              </h2>
            </div>
            <p>
              From a question to a working system.
              <br />A few things I’ve been building.
              <br />
              <a href="#project-map" className="text-link">
                Explore the project map <span aria-hidden="true">↗</span>
              </a>
            </p>
          </RevealSection>
          <ProjectStory projects={featuredProjects} />
          <RevealSection className="project-index">
            <div className="index-heading">
              <h3>More ways I build</h3>
              <span className="micro-label">CONTRIBUTIONS & EXPERIMENTS</span>
            </div>
            <div className="supporting-grid">
              {supportingProjects.map((project) => (
                <article className="supporting-card" key={project.name}>
                  <p className="micro-label">{project.category}</p>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  <ul className="tech-tags" aria-label="Technologies">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {project.external ? (
                    <a
                      className="text-link"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.cta}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link className="text-link" href={project.href}>
                      {project.cta}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                </article>
              ))}
            </div>
            <details className="earlier-work">
              <summary>
                <span>
                  Earlier ML work{" "}
                  <small>Research foundations & coursework</small>
                </span>
                <span className="details-toggle" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="index-list">
                {earlierProjects.map((project) => (
                  <a
                    className="index-row"
                    key={project.repo}
                    href={`https://github.com/JKennethG283/${project.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="index-field">{project.field}</span>
                    <div>
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                    </div>
                    <span className="index-status">View repository</span>
                    <span className="index-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </details>
          </RevealSection>
        </section>

        <ProjectMap />

        <RevealSection
          className="about-landscape"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="wide-container about-layout">
            <div className="portrait-wrap">
              <Image
                src="/images/profile.jpg"
                alt="Jonathan Kenneth Gunawan"
                width={600}
                height={800}
                sizes="(max-width: 700px) 90vw, 35vw"
                className="portrait-image"
              />
              <div className="portrait-caption">
                <span>THE PERSON BEHIND THE PROJECTS</span>
                <span>↗</span>
              </div>
            </div>
            <div className="about-text">
              <p className="micro-label">A LITTLE ABOUT ME</p>
              <h2 id="about-title">
                Curiosity first.
                <br />
                <span>Then, code.</span>
              </h2>
              <p>
                I’m Jonathan, a Bachelor of Artificial Intelligence student at
                the University of Technology Sydney and an intern at Gradstack
                since July 2026. I’m interested in what happens when rigorous
                machine learning meets something people can actually use.
              </p>
              <p>
                My work spans agent workflows, financial research, voice-first
                mobile experiences, and learning platforms. I enjoy connecting
                the model to the interface and the system behind it. I care
                about clear thinking, reproducible work, and responsible AI.
              </p>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/jonathan-kenneth-gunawan-8149782a3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                More about my journey <span aria-hidden="true">↗</span>
              </a>
              <div className="about-footnote">
                <span>BASED IN SYDNEY</span>
                <span>STUDYING AT UTS</span>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection
          className="toolkit-section wide-container"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-intro">
            <div>
              <p className="micro-label">MY TOOLKIT</p>
              <h2 id="skills-title">
                Across the <span>whole stack.</span>
              </h2>
            </div>
            <p>
              The tools change. The approach stays:
              <br />
              understand, experiment, evaluate, build.
            </p>
          </div>
          <div className="capability-grid">
            <article>
              <span className="capability-icon" aria-hidden="true">
                ⌘
              </span>
              <h3>Build the product</h3>
              <p>Interfaces and APIs that make the model useful.</p>
              <ul className="tech-tags">
                <li>TypeScript</li>
                <li>React</li>
                <li>Next.js</li>
                <li>React Native / Expo</li>
                <li>Node.js</li>
                <li>FastAPI</li>
                <li>Express</li>
                <li>Python</li>
                <li>SQL</li>
              </ul>
            </article>
            <article>
              <span className="capability-icon" aria-hidden="true">
                ⤳
              </span>
              <h3>Find the pattern</h3>
              <p>
                Models built around the problem and measured against a baseline.
              </p>
              <ul className="tech-tags">
                <li>XGBoost</li>
                <li>AutoGluon</li>
                <li>Chronos</li>
                <li>LSTM</li>
                <li>Time series</li>
              </ul>
            </article>
            <article>
              <span className="capability-icon" aria-hidden="true">
                ✳
              </span>
              <h3>Connect the context</h3>
              <p>Language systems grounded in the information that matters.</p>
              <ul className="tech-tags">
                <li>LLMs</li>
                <li>LangGraph</li>
                <li>RAG</li>
                <li>Embeddings</li>
                <li>Hybrid search</li>
                <li>Sentiment analysis</li>
              </ul>
            </article>
            <article>
              <span className="capability-icon" aria-hidden="true">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                >
                  <ellipse cx="12" cy="5" rx="8" ry="3" />
                  <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
                </svg>
              </span>
              <h3>Data &amp; infrastructure</h3>
              <p>
                Data storage and background jobs that keep products running.
              </p>
              <ul className="tech-tags">
                <li>Supabase</li>
                <li>PostgreSQL</li>
                <li>SQLite</li>
                <li>SQLAlchemy</li>
                <li>Redis</li>
                <li>Celery</li>
              </ul>
            </article>
          </div>
          <div className="learning-note">
            <span className="signal-dot" />
            <p>
              Always exploring{" "}
              <span>
                — evaluation, fine-tuning, and MLOps. Building with responsible
                AI and reproducibility in mind.
              </span>
            </p>
          </div>
        </RevealSection>

        <RevealSection
          className="lab-section"
          id="playground"
          aria-labelledby="lab-title"
        >
          <div className="wide-container">
            <div className="section-intro">
              <div>
                <p className="micro-label">THE PLAYGROUND</p>
                <h2 id="lab-title">
                  Less theory.
                  <br />
                  <span>More “try this.”</span>
                </h2>
              </div>
              <p>
                A couple of small experiments.
                <br />
                An invitation to play with the possibilities.
              </p>
            </div>
            <div className="experiment-grid">
              <Link href="/object-detection" className="experiment-card">
                <div className="experiment-preview">
                  <Image
                    src="/images/Hand_Demo.png"
                    alt="Hand landmark tracking demonstration"
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                  <span className="experiment-badge">
                    <span className="signal-dot" /> INTERACTIVE DEMO
                  </span>
                </div>
                <div className="experiment-copy">
                  <div>
                    <p className="micro-label">COMPUTER VISION</p>
                    <h3>A show of hands.</h3>
                    <p>
                      Real-time hand tracking. Your camera, a little AI, and all
                      ten fingers.
                    </p>
                  </div>
                  <span className="circle-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="experiment-footer">
                  <span>Try hand tracking</span>
                  <span>Camera required</span>
                </div>
              </Link>
              <Link href="/rps-markov" className="experiment-card">
                <div className="experiment-preview">
                  <Image
                    src="/images/RPS_Demo.png"
                    alt="Rock paper scissors game against an adaptive AI"
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                  <span className="experiment-badge">
                    <span className="signal-dot" /> INTERACTIVE DEMO
                  </span>
                </div>
                <div className="experiment-copy">
                  <div>
                    <p className="micro-label">ADAPTIVE MACHINE LEARNING</p>
                    <h3>Your next move?</h3>
                    <p>
                      Rock, paper, scissors—with an opponent that learns your
                      patterns.
                    </p>
                  </div>
                  <span className="circle-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="experiment-footer">
                  <span>Challenge the AI</span>
                  <span>No setup needed</span>
                </div>
              </Link>
            </div>
          </div>
        </RevealSection>

        <section
          className="contact-landscape"
          id="contact"
          aria-labelledby="contact-title"
        >
          <Image
            src="/images/landscapes/mountain-sky.jpg"
            alt=""
            fill
            sizes="100vw"
            className="contact-landscape-image"
          />
          <div className="contact-shade" />
          <RevealSection className="wide-container contact-inner">
            <p className="micro-label">
              THE NEXT GOOD IDEA STARTS WITH A CONVERSATION
            </p>
            <h2 id="contact-title">
              Let’s build
              <br />
              <span>something thoughtful.</span>
            </h2>
            <a
              className="pill-link pill-link--light"
              href="mailto:jonathan.kenneth.gunawan@gmail.com"
            >
              Say hello <span aria-hidden="true">↗</span>
            </a>
            <a
              className="contact-email"
              href="mailto:jonathan.kenneth.gunawan@gmail.com"
            >
              jonathan.kenneth.gunawan@gmail.com
            </a>
          </RevealSection>
        </section>
      </main>
      <footer className="landscape-footer">
        <div className="wide-container">
          <a className="footer-name" href="#home">
            Jonathan Kenneth<span>AI developer. Always learning.</span>
          </a>
          <div className="footer-socials">
            <a
              href="https://github.com/JKennethG283/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/jonathan-kenneth-gunawan-8149782a3/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a href="#home">Back to top ↑</a>
          </div>
          <p>© {new Date().getFullYear()} Jonathan Kenneth Gunawan</p>
          <span className="footer-note">BUILT WITH INTENTION, IN SYDNEY.</span>
        </div>
      </footer>
    </>
  );
}
