import Image from "next/image";

import { SiteHeader } from "@/ui/site/SiteHeader";
import { ProjectCarousel } from "@/ui/site/ProjectCarousel";
import { RevealSection } from "@/ui/site/RevealSection";

const year = new Date().getFullYear();

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="hero section" id="home">
          <div className="container">
            <div className="hero-simple">
              <p className="eyebrow">Bachelor of Artificial Intelligence · UTS</p>
              <h1>
                Hi, I am <span>Jonathan Kenneth Gunawan</span>. I build AI systems for
                finance and language.
              </h1>
              <p className="hero-description">
                I work across machine learning, time-series forecasting, sentiment
                analysis, and LLM/RAG—turning messy data into models and pipelines
                you can evaluate and ship.
              </p>
              <ul className="hero-meta" aria-label="Focus areas">
                <li>UTS · BSc AI</li>
                <li>Forecasting &amp; markets</li>
                <li>LLM / RAG</li>
              </ul>
              <div className="hero-actions">
                <a className="button primary" href="#projects">
                  View projects
                </a>
                <a className="button secondary" href="#contact">
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </section>

        <RevealSection className="section" id="about">
          <div className="container split-section about-split">
            <div className="about-photo-column">
              <Image
                src="/images/profile.jpg"
                alt="Jonathan Kenneth Gunawan"
                width={360}
                height={480}
                className="about-photo"
                sizes="(max-width: 860px) min(280px, 88vw), 320px"
              />
            </div>
            <div className="about-copy">
              <p className="section-label">About</p>
              <h2>Rigorous models, clear evaluation, deployment-minded workflows.</h2>
              <div className="section-copy">
              <p>
                I am a Bachelor of Artificial Intelligence student at the
                University of Technology Sydney, focused on financial AI, time-series
                forecasting, sentiment intelligence, and practical LLM/RAG systems.
              </p>
              <p>
                I enjoy full-stack AI work: data collection, feature engineering,
                classical and deep models, evaluation frameworks, and paths toward
                production—without losing sight of ethics and responsible use of
                generative AI.
              </p>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section muted" id="skills">
          <div className="container">
            <div className="section-heading">
              <p className="section-label">Skills</p>
              <h2>Tools and strengths</h2>
            </div>
            <div className="skills-grid">
              <article className="skill-card">
                <h3>Programming &amp; stack</h3>
                <p>
                  Python, SQL, Java, C++, JavaScript, React, Node.js, Django, Git
                  and GitHub.
                </p>
              </article>
              <article className="skill-card">
                <h3>Machine learning &amp; AI</h3>
                <p>
                  Deep learning, time-series forecasting, feature engineering,
                  sentiment analysis, LLM engineering, prompt engineering, RAG,
                  vector databases, human-in-the-loop systems.
                </p>
              </article>
              <article className="skill-card">
                <h3>Models &amp; data</h3>
                <p>
                  XGBoost, Random Forest, AutoGluon, Chronos, TFT, LSTM, ARIMAX,
                  VAR; data viz, web scraping, blockchain data, MLOps basics, Docker
                  and MLflow (learning).
                </p>
              </article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section" id="playground">
          <div className="container">
            <div className="section-heading">
              <p className="section-label">Playground</p>
              <h2>Interactive AI demos</h2>
            </div>
            <div className="skills-grid">
              <article className="skill-card skill-card-link">
                <h3>Object detection demo</h3>
                <p>
                  Click through to a live hand object detection page that counts
                  how many fingers you raise using an existing model.
                </p>
                <a href="/object-detection" aria-label="Open object detection demo">
                  Open demo
                </a>
              </article>
              <article className="skill-card skill-card-link">
                <h3>Adaptive RPS AI (Markov)</h3>
                <p>
                  Play rock-paper-scissors against an AI that learns from your move
                  patterns and updates its predictions each round.
                </p>
                <a href="/rps-markov" aria-label="Open Markov RPS demo">
                  Open demo
                </a>
              </article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section" id="projects">
          <div className="container">
            <div className="section-heading">
              <p className="section-label">Projects</p>
              <h2>Featured work</h2>
            </div>
            <ProjectCarousel>
              <article className="project-card">
                <div className="project-preview gradient-one" />
                <div className="project-content">
                  <p className="project-meta">Forecasting · Crypto</p>
                  <h3>Cryptocurrency forecasting</h3>
                  <p>
                    Multivariate forecasting for BTC, ETH, and SOL with OHLCV,
                    Dune metrics, and FRED—statistical, ML, and transformer baselines
                    with MAE, RMSE, MAPE, MASE, and R².
                  </p>
                  <a
                    href="https://github.com/JKennethG283/cryptocurrency-time-series-modelling"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View cryptocurrency forecasting repository on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
              <article className="project-card">
                <div className="project-preview gradient-two" />
                <div className="project-content">
                  <p className="project-meta">NLP · Indonesia markets · WIP</p>
                  <h3>Stock sentiment pipeline</h3>
                  <p>
                    Indonesian financial news mapped to stocks: scraping, hybrid
                    search and clustering, sentiment scoring, LLM classification, and
                    RAG-style knowledge use. Work in progress.
                  </p>
                  <a
                    href="https://github.com/JKennethG283/news-sentiment-analysis-indonesian-market"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View stock sentiment pipeline repository on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
              <article className="project-card">
                <div className="project-preview gradient-three" />
                <div className="project-content">
                  <p className="project-meta">Markets · Flow analysis · WIP</p>
                  <h3>Broker &amp; flow analysis</h3>
                  <p>
                    Broker activity, foreign flows, order books, and retail vs
                    institutional behaviour in Indonesian equities—with attention
                    to market microstructure and psychology. Work in progress.
                  </p>
                  <a
                    href="https://github.com/JKennethG283/indonesian-broker-flow"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View broker and flow analysis work on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
              <article className="project-card">
                <div className="project-preview gradient-one" />
                <div className="project-content">
                  <p className="project-meta">Tabular ML · Forecasting</p>
                  <h3>Weather prediction</h3>
                  <p>
                    Leakage-safe RainTomorrow classification with Pipeline and
                    ColumnTransformer, benchmarking multiple models and reaching
                    0.86 test accuracy with a Random Forest baseline.
                  </p>
                  <a
                    href="https://github.com/JKennethG283/weather-prediction"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View weather prediction repository on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
              <article className="project-card">
                <div className="project-preview gradient-two" />
                <div className="project-content">
                  <p className="project-meta">Computer Vision · MRI</p>
                  <h3>Brain tumor classification</h3>
                  <p>
                    Multi-class MRI tumor classification using handcrafted image
                    features (LBP + HOG) with SVM, achieving 81.36% baseline test
                    accuracy in a reproducible training and inference workflow.
                  </p>
                  <a
                    href="https://github.com/JKennethG283/brain-tumor-image-classification"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View brain tumor classification repository on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
              <article className="project-card">
                <div className="project-preview gradient-three" />
                <div className="project-content">
                  <p className="project-meta">Object Detection · Dermatology</p>
                  <h3>Skin disease object detection</h3>
                  <p>
                    Ultralytics YOLO pipeline for skin lesion detection with
                    config-driven training, evaluation, and inference; baseline run
                    reached mAP@50 of 0.696 and mAP@50-95 of 0.418.
                  </p>
                  <a
                    href="https://github.com/JKennethG283/skin-disease-object-detection"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View skin disease object detection repository on GitHub"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
            </ProjectCarousel>
          </div>
        </RevealSection>

        <RevealSection className="section muted" id="experience">
          <div className="container">
            <div className="section-heading">
              <p className="section-label">Experience</p>
              <h2>Path &amp; focus</h2>
            </div>
            <div className="timeline">
              <article className="timeline-item">
                <div>
                  <p className="timeline-date">Present</p>
                  <h3>Bachelor of Artificial Intelligence, UTS</h3>
                </div>
                <p>
                  Coursework and projects spanning ML engineering, financial AI,
                  forecasting, NLP, ethics, Indigenous Data Sovereignty, CARE
                  principles, and responsible governance of generative AI.
                </p>
              </article>
              <article className="timeline-item">
                <div>
                  <p className="timeline-date">Ongoing</p>
                  <h3>Research &amp; build interests</h3>
                </div>
                <p>
                  LangChain / LangGraph, vector databases, fine-tuning, MLOps, and
                  cloud AI (AWS/GCP interest)—always with reproducible repos and
                  clear documentation.
                </p>
              </article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section contact" id="contact">
          <div className="container contact-card">
            <div>
              <p className="section-label">Contact</p>
              <h2>Let&apos;s build something thoughtful.</h2>
              <p>
                Add your public email, LinkedIn, and GitHub below. This site also
                includes a portfolio assistant you can open from the chat button.
              </p>
            </div>
            <div className="contact-links">
              <a href="mailto:jonathan.kenneth.gunawan@gmail.com">
                jonathan.kenneth.gunawan@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/jonathan-kenneth-gunawan-8149782a3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/JKennethG283/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </RevealSection>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>
            &copy; {year} Jonathan Kenneth. All rights reserved.
          </p>
          <a href="#home">Back to top</a>
        </div>
      </footer>
    </>
  );
}
