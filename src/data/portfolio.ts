export type FeaturedProject = {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  role: string;
  tags: string[];
  detail: string;
  image: string;
  imageAlt: string;
  imageFormat: "desktop" | "mobile";
  backdrop: string;
  caption: string;
  status: string;
};

// Public portfolio descriptions only. Private implementation details stay in their own repositories.
export const featuredProjects: FeaturedProject[] = [
  {
    id: "flowstudio",
    name: "Flowstudio",
    category: "AI workflows · Developer tools",
    title: "From an idea to a workflow you can inspect.",
    description:
      "A local AI workflow platform for composing agents, tools, and reusable context in a visual editor. My work brings authoring and execution together: connect steps, run a workflow, inspect its outputs, and revisit what happened. The product includes a dependency map, durable runs, and review steps for proposed changes. It’s a working local platform, with a product walkthrough here and its source kept private.",
    role: "Product design & full-stack development",
    tags: ["Next.js", "TypeScript", "Python", "PostgreSQL"],
    detail: "Visual authoring · Reusable agents · Run inspection",
    image: "/images/projects/flowstudio-editor.webp",
    imageAlt:
      "Flowstudio’s visual workflow editor showing a research workflow and step settings",
    imageFormat: "desktop",
    backdrop: "/images/landscapes/alpine-night.jpg",
    caption: "Build, run, understand.",
    status: "Local platform · Private source",
  },
  {
    id: "market-cerdas",
    name: "Market Cerdas",
    category: "Full-stack AI · Financial intelligence",
    title: "A clearer view of the market.",
    description:
      "An AI-assisted stock research prototype bringing market news, technical charts, and company fundamentals into one workspace. I built across the interface, APIs, retrieval, and data pipelines so a research question can lead to the context behind an answer. The public application supports ASX research; Indonesian stock prediction remains a development direction. Explore the product and its public documentation while the application source stays private.",
    role: "Full-stack AI development",
    tags: ["React", "Express", "Gemini", "Python"],
    detail: "Market research · Grounded answers · News sentiment",
    image: "/images/projects/market-cerdas.webp",
    imageAlt:
      "Market Cerdas public research workspace with AI chat and market research navigation",
    imageFormat: "desktop",
    backdrop: "/images/landscapes/city-signals.jpg",
    caption: "Put information in context.",
    status: "Public research prototype · Private source",
  },
  {
    id: "haven-ai",
    name: "Haven AI",
    category: "Mobile AI · Voice & journaling",
    title: "A spoken thought. A journal you control.",
    description:
      "A voice-first journaling product built around deliberate review and device-local storage. My contribution to the team project spans the Expo mobile app, transcription integration, editable journal drafts, and supporting API and build workflows. The experience moves from recording to a reviewed transcript and a saved entry, with AI assistance as an explicit choice. This is an in-development product showcase, with source and personal journal content kept private.",
    role: "Mobile & API development · Team contribution",
    tags: ["React Native", "Expo", "TypeScript", "SQLite"],
    detail: "Voice capture · Review before saving · Local journal vault",
    image: "/images/projects/haven-home.webp",
    imageAlt:
      "Haven AI home screen in a clean web preview with no personal journal entries",
    imageFormat: "mobile",
    backdrop: "/images/landscapes/mountain-sky.jpg",
    caption: "Keep your own voice.",
    status: "In development · Team project",
  },
];

export const supportingProjects = [
  {
    name: "Serendip-TG",
    category: "Team contribution",
    description:
      "AI-generated story quizzes and profile-driven themes for a Telegram Mini App. My contributions include background generation, admin draft editing, and generation-status handling.",
    tags: ["FastAPI", "Celery", "React"],
    href: "/work/serendip-tg",
    cta: "Read my contribution",
    external: false,
  },
  {
    name: "Server-driven UI",
    category: "Interactive prototype",
    description:
      "A profile-driven interface that changes its palette, typography, and avatar from structured data. Explore the Astrana demo to see the visual side of AI personalisation.",
    tags: ["React", "TypeScript", "LangGraph"],
    href: "https://server-driven-ui-fawn.vercel.app/",
    cta: "Explore the demo",
    external: true,
  },
  {
    name: "Cryptocurrency forecasting",
    category: "ML research · University capstone",
    description:
      "Forecasting research across BTC, ETH, and SOL using price, on-chain, and macroeconomic signals. Comparing statistical, machine learning, and transformer baselines with explicit evaluation metrics.",
    tags: ["Python", "Time series", "Model evaluation"],
    href: "https://github.com/JKennethG283/cryptocurrency-time-series-modelling",
    cta: "View research repository",
    external: true,
  },
];

export const earlierProjects = [
  {
    name: "Indonesian news sentiment",
    field: "Financial NLP",
    description:
      "Financial news collection, event clustering, and sentiment classification. Supporting research into Indonesian markets.",
    repo: "news-sentiment-analysis-indonesian-market",
  },
  {
    name: "Weather prediction",
    field: "Tabular ML",
    description:
      "Leakage-safe rainfall classification. Random Forest baseline: 0.86 test accuracy.",
    repo: "weather-prediction",
  },
  {
    name: "Brain tumor classification",
    field: "Computer vision",
    description:
      "MRI classification using LBP + HOG features and SVM. Baseline test accuracy: 81.36%.",
    repo: "brain-tumor-image-classification",
  },
  {
    name: "Skin disease detection",
    field: "Object detection",
    description:
      "A reproducible YOLO training and inference workflow. Baseline mAP@50: 0.696.",
    repo: "skin-disease-object-detection",
  },
];
