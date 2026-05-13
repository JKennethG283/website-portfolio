# Jonathan Kenneth — Portfolio profile (public)

## Overview

Jonathan Kenneth is a Bachelor of Artificial Intelligence student at the University of Technology Sydney (UTS). His interests center on machine learning, financial AI systems, time-series forecasting, sentiment analysis, and applications of large language models and RAG. He focuses on building end-to-end AI systems for real-world financial and analytical problems, including cryptocurrency forecasting, Indonesian stock-market analysis, blockchain data integration, and AI-driven sentiment pipelines.

## Elevator pitch

Jonathan Kenneth Gunawan is a production-minded Bachelor of Artificial Intelligence student at UTS in Sydney, nearing graduation. He builds reproducible forecasting, NLP, broker-flow, and computer vision systems—with clear evaluation, containers/pipelines in mind, and public GitHub portfolios. Indonesian, age 22, fluent in English and Indonesian and moderate in Chinese; actively seeking internships, graduate programs, or full-time roles worldwide.

## How he builds systems

He enjoys end-to-end systems that cover: data collection pipelines, feature engineering, machine learning and deep learning models, LLM and RAG systems, evaluation frameworks, and deployment-ready workflows.

## Technical skills — programming

Python, SQL, Java, C++, JavaScript, React, Node.js, Django, Git and GitHub.

## Technical skills — machine learning and AI

Machine learning, deep learning, time-series forecasting, feature engineering, sentiment analysis, LLM engineering, prompt engineering, RAG systems, vector databases, and human-in-the-loop AI systems.

## Models and frameworks

XGBoost, Random Forest, AutoGluon, Chronos, Temporal Fusion Transformer, LSTM, ARIMAX, VAR, KNIME.

## Data and infrastructure

Data analysis, data visualization, web scraping, blockchain data processing, MLOps concepts, Docker (learning), MLflow (learning), and cloud AI systems with interest in AWS and GCP.

## Libraries and tooling (hands-on)

Common Python stack: pandas, NumPy, scikit-learn; Jupyter notebooks for exploration alongside packaged `src/` layouts and CLIs where repos allow. Classical stats/time series where relevant (e.g. statsmodels-style workflows). Deep learning and CV: PyTorch-oriented workflows and Ultralytics YOLO for detection projects. Web portfolio: Next.js, React, TypeScript, Tailwind CSS v4. Assistant on this site: Groq LLM plus optional Hugging Face embeddings; RAG retrieval over `content/knowledge/rag.md`. Interests: LangChain / LangGraph, vector databases, CI (e.g. GitHub Actions) as used in repositories.

## Quantified results snapshot (from published repos)

Figures below come from README-style summaries in his GitHub projects and may reflect a specific baseline run; always refer to the repository for full context.

- **Weather prediction (`weather-prediction`):** RainTomorrow classification; best baseline **Random Forest**; reported **test accuracy ~0.86**; positive-class **F1 ~0.60** with documented recall trade-offs.
- **Brain tumor MRI (`brain-tumor-image-classification`):** Handcrafted features (LBP + HOG) + SVM; baseline **test accuracy ~81.36%**; strong **F1 on Pituitary (~0.96)** and **No Tumor (~0.90)**; **Meningioma recall ~0.50** noted as a key improvement area.
- **Skin disease detection (`skin-disease-object-detection`):** YOLO workflow; baseline snapshot **Box mAP@50 ~0.696**, **mAP@50-95 ~0.418**; precision/recall snapshot **~0.663 / 0.666** (epoch/experiment-specific).
- **Cryptocurrency forecasting (`cryptocurrency-time-series-modelling`):** Multiple models and metrics (**MAE, RMSE, MAPE, MASE, R²**) as described in the major project section below.

## Major project — cryptocurrency forecasting

**Title:** Multivariate Forecasting and Predictability Analysis of Cryptocurrency Market Dynamics.

**Focus:** Predicting cryptocurrency returns, volatility, and trading volume for BTC, ETH, and SOL across hourly and daily horizons.

**Data sources:** Binance OHLCV market data; blockchain metrics from Dune; macroeconomic indicators from FRED.

**Techniques:** Statistical forecasting, machine learning, deep learning, transformer-based forecasting.

**Models used:** ARIMAX, VAR, Random Forest, XGBoost, LSTM, TimeGPT, TimesFM, Chronos, Temporal Fusion Transformer.

**Evaluation metrics:** MAE, RMSE, MAPE, MASE, R².

**Themes explored:** Rolling forecasts, regime detection, feature engineering, combining blockchain metrics with OHLCV, multi-timeframe modelling.

## Major project — Indonesian stock sentiment

**Goal:** Build an AI pipeline mapping Indonesian financial news sentiment to individual stocks.

**System features:** News scraping; hybrid search and clustering; similar-news grouping; sentiment scoring; category classification; stakeholder or entity mapping; daily stock sentiment aggregation.

**Research areas:** LLM classification systems, FinBERT-style sentiment scoring, RAG-based knowledge systems, cached inference pipelines, event-to-sector impact analysis.

## Broker flow and Indonesian market analysis

Focus on how broker activity and foreign flows relate to Indonesian stock movements. Areas explored include broker transaction analysis, foreign buy and sell tracking, order-book behaviour, retail versus institutional behaviour, “bandar” flow analysis, Indonesian stock market psychology.

## AI and computer vision

Experience with image detection and object detection, AI model deployment concepts, portfolio-ready GitHub structures. Professional practices include clean repositories, reproducibility, README documentation, and separating notebooks from production-oriented code.

## GitHub profile snapshot

GitHub username: `JKennethG283`.

Public profile summary: 7 public repositories, account created in 2024, active updates through 2026.

Repository themes include:
- Time-series and tabular ML (`cryptocurrency-time-series-modelling`, `weather-prediction`)
- NLP for financial sentiment (`news-sentiment-analysis-indonesian-market`)
- Computer vision (`brain-tumor-image-classification`, `skin-disease-object-detection`)
- Market microstructure analysis (`indonesian-broker-flow`)
- Portfolio website engineering (`website-portfolio`)

Project documentation style on GitHub emphasizes practical, production-oriented structure with reproducibility, clear README guidance, and script/CLI workflows.

## Personal Q&A (assistant context)

These answers are for the portfolio assistant when users ask about motivations, process, values, or fit.

### What AI problems are you most excited to solve?

He is especially motivated by how equity and cryptocurrency markets behave and how far prediction can go with multimodal signals: LLMs and NLP for news and sentiment, engineered features from price and on-chain data, broker-flow and microstructure analysis, and combining those modalities with classical time series, deep learning, machine learning, and reinforcement learning to forecast returns, volatility, and volume.

### Why AI, finance, and Indonesia?

He has been curious about technology since childhood. From around age sixteen he became deeply interested in stocks and whether their movement could be predicted systematically. AI looked like the right toolkit for that problem. Beyond markets, he sees broad ways AI can improve everyday life; he cares particularly about Indonesia, where adoption lags many peer countries and local impact can be large.

### What project most shaped how you build professionally?

His university capstone on cryptocurrency time-series forecasting was a turning point. It pushed him toward professional practice: complete documentation, reproducible results, a clear executive summary, easy setup for others (environments, scripts, configs), honest limitation and error analysis, versioned data and code, and evaluation that holds up outside a single notebook.

### How do you start and run a new project?

He begins with research: what to learn, what to implement, and what success looks like. He lays down building blocks in order, validates each step against the goal, then continues. When blockers appear, he researches again, experiments, and iterates until the path is sound.

### What are your non-negotiables for model and system quality?

Reliability (behaviour you can trust under drift and edge cases), alignment with business or research goals, rigorous evaluation (not just leaderboard metrics), and safety and governance (data use, bias, and deployment risk).

### What should recruiters and clients remember about you?

He wants to be known as a production-first engineer. A project is not “done” when accuracy is high on a laptop; it is done when the work is containerized (e.g. Docker), trackable (e.g. MLflow or equivalent), and runnable reliably in a pipeline. He bridges exploratory data science and stable software engineering so code stays maintainable, reproducible, and scalable.

### What are you focusing on learning now?

He is deepening NLP, LLMs, generative AI, and reinforcement learning as one arc: NLP for the text and signal foundation, LLMs and GenAI for production systems, advanced RAG, and agents that perform real tasks, plus reinforcement learning for decision-making, reasoning-oriented models, and alignment patterns such as RLHF—so systems are not only capable but safer and more dependable in production.

### What team environment helps you do your best work?

He does best in an egoless, production-minded culture that pairs clear process with real autonomy. Technically, he values documentation, containerization, and code review as defaults. Interpersonally, he values radical candor and psychological safety: room to dissect model failures, learn from data, and pivot quickly without blame.

### Background, location, and job search

He is 22, Indonesian, and is completing his studies in Sydney, Australia (Bachelor of Artificial Intelligence at UTS), with graduation imminent. He is open to any suitable opportunity—internships, graduate programs, full-time roles, or other arrangements—and wants to start work as soon as possible. If an employer needs him to stay in Australia, he can pursue a post-study work visa (the common graduate pathway, e.g. Subclass 485) as required. He is flexible about location and is willing to relocate within Australia or internationally.

### Languages

He is fluent in English and Indonesian, and has moderate proficiency in Chinese.

### Identity

He is male and straight.

## Contact and preferred channels

- **Email:** jonathan.kenneth.gunawan@gmail.com  
- **LinkedIn:** https://www.linkedin.com/in/jonathan-kenneth-gunawan-8149782a3/  
- **GitHub:** https://github.com/JKennethG283/  

For roles, collaborations, or clarifications on projects, email or LinkedIn are preferred.

## Assistant behaviour boundaries

When answering as the portfolio assistant:

- Do **not** give immigration or legal advice; for Australian visas (including post-study pathways), point users to official **Department of Home Affairs** information or a registered migration agent. Jonathan may pursue pathways such as a post-study work visa where eligible—details are individual.
- Do **not** negotiate salary or give binding financial/legal commitments on his behalf.
- Do **not** fabricate employers, offers, grades, or metrics; for anything sensitive or time-sensitive, ask the user to contact Jonathan directly.
- Investment outputs are **not financial advice**; market and model outputs are educational and technical unless explicitly stated otherwise.

## Work authorization (factual, non-legal)

He is **Indonesian**, studying in **Sydney, Australia** at UTS. Work rights and post-study options depend on visa subclass and individual circumstances; official sources should be consulted. He has indicated openness to applying for post-study work pathways (e.g. Subclass **485**-style graduate streams where eligible) if needed for roles in Australia.

## Repository status (portfolio-ready vs work in progress)

- **Documented / portfolio showcases:** `weather-prediction`, `brain-tumor-image-classification`, `skin-disease-object-detection`, `cryptocurrency-time-series-modelling`, `website-portfolio` (and this live portfolio deployment).
- **Active or evolving (WIP):** `news-sentiment-analysis-indonesian-market`, `indonesian-broker-flow`—features and evaluation may be incomplete; treat claims as directional unless the README states otherwise.

## Collaboration and leadership context

Most **public GitHub** work is **individual** portfolio and coursework-driven; university projects may include **team components**. He values peer review, clear handoffs, and psychological safety in professional settings and is **actively improving** communication and teamwork through group coursework, presenting results, and soliciting feedback on repositories.

## Interests outside technical work / Hobbies

**Hobbies and personal interests:** He follows **financial markets**, **technology news**, and connections between Indonesia and global AI adoption—keeping informal interests aligned with his professional direction. Outside work and study he enjoys **hiking**, **badminton**, **playing stocks**, **watching movies**, and **playing video games**. These activities help him recharge and stay curious; his market interest in particular feeds directly into his professional work on financial AI.

## This website — FAQ for visitors

- **What is this site?** A personal portfolio for Jonathan Kenneth Gunawan: About, Skills, **Playground** (interactive demos), **Featured work** (project carousel with GitHub links), Experience, and Contact.
- **Playground demos:** **Object detection** finger-counting demo at `/object-detection`; **Rock–Paper–Scissors** vs an adaptive Markov-style opponent at `/rps-markov`.
- **Portfolio assistant chat:** Uses retrieval-augmented generation over **`content/knowledge/rag.md`** plus an LLM; answers should reflect this published profile. **Time-sensitive** facts (visa rules, job status, grades) may change—visitors should confirm with Jonathan directly.

## Research and ethics interests

Interests include AI ethics, Indigenous Data Sovereignty, CARE principles, human–AI collaboration, responsible AI governance, and ethical use of generative AI. Academic habits include APA 7th referencing, synthesis, critical evaluation frameworks, and the Gibbs Reflective Framework.

## Working style

**Strengths:** Analytical thinking, data analysis, structured problem solving, curiosity-driven learning, building practical AI systems, strong technical exploration.

**Growth areas:** Communication, teamwork, adaptability, reducing overthinking and perfectionism, improving creative ideation.

**How growth ties to strengths:** He seeks **production-minded teams** with candor and psychological safety (see Personal Q&A). He is deliberately strengthening **communication and teamwork** in parallel with technical depth—through collaborative coursework, writing for teammates and reviewers, and practicing clear explanations of limitations, metrics, and deployment constraints so collaboration scales beyond solo repos.

## Future vision / Where he sees himself in the coming years

In the coming years Jonathan sees himself becoming a **well-rounded AI expert** with deep command across the full spectrum of artificial intelligence—machine learning, deep learning, NLP, computer vision, reinforcement learning, generative AI, and production MLOps. He plans to have built and shipped a **large portfolio of projects** spanning financial forecasting, sentiment intelligence, trading systems, and LLM-powered products, establishing a strong professional track record.

He envisions building a **successful career in AI**—whether as a Machine Learning Engineer, Financial AI Engineer, or AI Research Engineer at a leading company—gaining real-world experience designing, deploying, and scaling AI systems in production environments.

Longer-term, he aspires to **build his own AI-driven projects and ventures**—products and tools that solve meaningful problems in finance, analytics, or everyday life. The goal is to create something **fruitful and lasting**: projects that grow into a business of his own, combining his technical expertise with entrepreneurial ambition. He wants to move from being an engineer who builds for others to someone who **creates, owns, and scales** AI products that make a real impact.

## Career direction

**Primary target roles:** Machine Learning Engineer; Financial AI Engineer; Time-Series Forecasting Specialist.

**Secondary interests:** Quantitative Data Science; AI Research Engineering; LLM Engineering.

**Industry direction:** Finance and AI systems; crypto analytics; trading intelligence; large-scale AI infrastructure.
