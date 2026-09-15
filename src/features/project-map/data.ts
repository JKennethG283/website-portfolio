import {
  earlierProjects,
  featuredProjects,
  supportingProjects,
} from "@/data/portfolio";

export const mapGroups = {
  agents: { name: "AI systems", color: "#bbb1ff" },
  finance: { name: "Financial AI", color: "#6ddacb" },
  vision: { name: "ML & vision", color: "#eab98c" },
  products: { name: "Product experiences", color: "#8fbcff" },
} as const;
export type MapGroup = keyof typeof mapGroups;
export type MapProject = {
  id: string;
  name: string;
  label: string;
  group: MapGroup;
  topics: string[];
  description: string;
  href: string;
  external: boolean;
  cta: string;
};

const featuredMeta: Record<string, { group: MapGroup; topics: string[] }> = {
  flowstudio: {
    group: "agents",
    topics: ["AI workflows", "Human review", "Web applications"],
  },
  "market-cerdas": {
    group: "finance",
    topics: ["Financial research", "Retrieval", "Web applications"],
  },
  "haven-ai": {
    group: "products",
    topics: ["Human review", "Language & text", "Personalisation"],
  },
};
const supportingMeta: {
  id: string;
  label: string;
  group: MapGroup;
  topics: string[];
}[] = [
  {
    id: "serendip-tg",
    label: "Serendip-TG",
    group: "agents",
    topics: ["AI workflows", "Personalisation", "Human review"],
  },
  {
    id: "server-driven-ui",
    label: "Server-driven UI",
    group: "products",
    topics: ["Personalisation", "AI workflows", "Web applications"],
  },
  {
    id: "crypto-forecasting",
    label: "Crypto forecasting",
    group: "finance",
    topics: ["Financial research", "Prediction", "Model evaluation"],
  },
];
const earlierMeta: { label: string; group: MapGroup; topics: string[] }[] = [
  {
    label: "News sentiment",
    group: "finance",
    topics: ["Financial research", "Language & text", "Retrieval"],
  },
  {
    label: "Weather prediction",
    group: "vision",
    topics: ["Prediction", "Model evaluation"],
  },
  {
    label: "Brain tumor ML",
    group: "vision",
    topics: ["Computer vision", "Model evaluation"],
  },
  {
    label: "Skin disease ML",
    group: "vision",
    topics: ["Computer vision", "Model evaluation"],
  },
];

// Only work already approved for the public portfolio. Connections mean shared
// themes, not data exchange, source dependencies, or employer relationships.
export const mapProjects: MapProject[] = [
  ...featuredProjects.map((p) => ({
    id: p.id,
    name: p.name,
    label: p.name,
    ...featuredMeta[p.id],
    description: p.description,
    href: `/work/${p.id}`,
    external: false,
    cta: "Explore the project",
  })),
  ...supportingProjects.map((p, i) => ({
    ...supportingMeta[i],
    name: p.name,
    description: p.description,
    href: p.href,
    external: p.external,
    cta: p.cta,
  })),
  ...earlierProjects.map((p, i) => ({
    id: p.repo,
    name: p.name,
    ...earlierMeta[i],
    description: p.description,
    href: `https://github.com/JKennethG283/${p.repo}`,
    external: true,
    cta: "View research repository",
  })),
  {
    id: "gradstack",
    name: "Gradstack",
    label: "Gradstack",
    group: "products",
    topics: ["Web applications", "Human review", "Personalisation"],
    description:
      "My software engineering contributions to the team's assessment and learning platform: candidate results, downloadable summaries, searchable learning catalogues, and progress tracking.",
    href: "#experience",
    external: false,
    cta: "See my experience",
  },
  {
    id: "portfolio",
    name: "Portfolio & AI assistant",
    label: "Portfolio assistant",
    group: "agents",
    topics: ["Retrieval", "Language & text", "Web applications"],
    description:
      "This portfolio combines interactive experiments, project stories, and an AI assistant that retrieves answers from my published profile.",
    href: "#home",
    external: false,
    cta: "Back to the introduction",
  },
  {
    id: "hand-tracking",
    name: "Hand landmark tracking",
    label: "Hand tracking",
    group: "vision",
    topics: ["Computer vision", "Web applications"],
    description:
      "An interactive browser experiment that detects hand landmarks and counts raised fingers using your camera.",
    href: "/object-detection",
    external: false,
    cta: "Try hand tracking",
  },
  {
    id: "rps",
    name: "Adaptive rock–paper–scissors",
    label: "Adaptive RPS",
    group: "vision",
    topics: ["Prediction", "Web applications"],
    description:
      "A playable experiment with an adaptive opponent that uses your recent moves to predict what you might play next.",
    href: "/rps-markov",
    external: false,
    cta: "Play the experiment",
  },
];

export function sharedTopics(a: MapProject, b: MapProject) {
  return a.topics.filter((topic) => b.topics.includes(topic));
}
