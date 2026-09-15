export type ProjectCaseStudy = {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  role: string;
  status: string;
  tags: string[];
  sections: { title: string; text: string }[];
  gallery?: {
    src: string;
    alt: string;
    caption: string;
    mobile?: boolean;
    width?: number;
    height?: number;
  }[];
  links?: { label: string; href: string }[];
};

export const caseStudies: ProjectCaseStudy[] = [
  {
    slug: "flowstudio",
    name: "Flowstudio",
    category: "AI WORKFLOWS / DEVELOPER TOOLS",
    headline: "Make AI workflows easier to build—and understand.",
    summary:
      "A visual workspace for composing agents, connecting tools, and following a workflow from its first input to its final output.",
    role: "Product design & full-stack development",
    status: "Working local platform · Private source",
    tags: ["Next.js", "TypeScript", "Python", "PostgreSQL"],
    sections: [
      {
        title: "The problem",
        text: "An AI workflow is more than a prompt. It has inputs, dependencies, intermediate decisions, and outputs that someone needs to trust. As the number of agents and tools grows, it becomes harder to see how those parts fit together or explain why a run behaved a particular way. Flowstudio brings that work into a visual environment, with the goal of making authoring approachable while keeping execution inspectable.",
      },
      {
        title: "What I built",
        text: "I worked across the product experience and full-stack implementation: project organisation, a visual workflow editor, reusable agents and tools, and a runtime for executing the resulting steps. The editor supports connections, configuration, and validation alongside a view of the workflow. A dependency map provides another way to explore related resources. These interfaces share a consistent project structure so the author can move between the big picture and an individual step.",
      },
      {
        title: "The product journey",
        text: "An author creates a project, starts a workflow, and connects the steps needed for a task. They configure the inputs and outputs, save the definition, and run it. The inspection experience then exposes step activity, results, and artifacts. Runs have durable state and history, supporting cancellation and revisiting a previous execution. Review steps make proposed changes visible before they are applied, so the person remains part of the workflow.",
      },
      {
        title: "Scope and what it taught me",
        text: "Flowstudio is a working local platform under active development. It is presented here through product captures rather than a hosted service or source release. The important engineering lesson is that execution and explanation need to be designed together: a visual editor is only useful when its steps correspond to behaviour a person can inspect. My focus is on that relationship between the authoring experience, runtime state, and clear feedback when something needs attention.",
      },
    ],
    gallery: [
      {
        src: "/images/projects/flowstudio-overview.webp",
        width: 1440,
        height: 1473,
        alt: "Flowstudio overview with a map of the example research workflow and its dependencies",
        caption:
          "The product overview connects projects, workflows, agents, and tools. Example workspace.",
      },
    ],
  },
  {
    slug: "market-cerdas",
    name: "Market Cerdas",
    category: "FINANCIAL AI / RESEARCH TOOLS",
    headline: "Bring a research question closer to its evidence.",
    summary:
      "A stock research prototype combining market news, technical charts, fundamentals, and AI-assisted exploration in one workspace.",
    role: "Full-stack AI development",
    status: "Public ASX research prototype · Private source",
    tags: ["React", "TypeScript", "Express", "Python", "Gemini"],
    sections: [
      {
        title: "The problem",
        text: "Stock research draws on information that is usually scattered across news, price charts, and company fundamentals. An answer without that context is difficult to evaluate. Market Cerdas explores how a single research workspace can connect those views and make the evidence behind an AI response easier to follow. The focus is on helping a person investigate a question, with the surrounding context available for their own judgement.",
      },
      {
        title: "What I built",
        text: "My work spans the React interface, Express APIs, AI retrieval, and Python data pipelines. The product includes a chat-first research experience, News Impact sentiment views, technical chart tooling, fundamentals grading, and watchlists. Retrieved context connects the assistant to available market snapshots rather than relying only on general model knowledge. The interfaces make it possible to move between a question, a market view, and the details relevant to that research.",
      },
      {
        title: "The research journey",
        text: "A visitor can start with a stock or a question, review news sentiment, inspect a technical chart, and compare company fundamentals. The AI assistant helps connect those sources within the research workspace. Different views serve different questions: a chart makes price history visible, while a fundamentals dashboard provides another perspective on a company. The product is a research and software demonstration; its scores and generated responses should be evaluated in that context.",
      },
      {
        title: "Current scope",
        text: "The public prototype supports ASX research. Indonesian stock prediction is an active development direction, rather than a capability claimed as finished here. The application source remains private; the public documentation repository explains the product and its broad architecture. This project has reinforced the importance of separating implemented behaviour from research plans, and keeping data freshness, available evidence, and the limits of a generated answer visible to the person using the system.",
      },
    ],
    gallery: [
      {
        src: "/images/projects/market-cerdas-fundamentals.webp",
        alt: "Market Cerdas fundamentals dashboard showing company grades and recent changes",
        caption:
          "Fundamentals dashboard captured from the public prototype. Values are a product snapshot, not a current market assessment.",
      },
    ],
    links: [
      {
        label: "Open live product",
        href: "https://stock-website-sigma.vercel.app/",
      },
      {
        label: "Public documentation",
        href: "https://github.com/JKennethG283/market-cerdas",
      },
    ],
  },
  {
    slug: "haven-ai",
    name: "Haven AI",
    category: "VOICE / MOBILE AI",
    headline: "Keep the convenience of voice. Keep control of the journal.",
    summary:
      "A voice-first journaling experience with editable transcripts, deliberate AI assistance, and a device-local journal vault.",
    role: "Mobile & API development · Team contribution",
    status: "In development · Private source",
    tags: ["React Native", "Expo", "TypeScript", "SQLite"],
    sections: [
      {
        title: "The product idea",
        text: "Speaking can be an easier starting point than a blank page. Turning a spoken thought into a useful journal entry still calls for care: transcription can be imperfect, generated wording may not sound like the person, and saving should be their decision. Haven AI puts review at the centre of that experience. It treats a recording, a transcript, an AI-generated draft, and a saved journal as distinct steps.",
      },
      {
        title: "My contribution",
        text: "Haven is a team project. My contribution spans the Expo mobile implementation, transcription integration, journal review and local storage, the supporting generation API, and development-build workflows. I worked on connecting the mobile experience to those capabilities while preserving clear boundaries between capturing a thought, asking for assistance, and saving an entry. The work also included Android transcription integration and build configuration for testing the native experience.",
      },
      {
        title: "A deliberate voice-to-journal flow",
        text: "A person starts a recording and reviews the resulting transcript. They can then choose a format such as a journal entry, notes, or a transcript-only record. AI assistance is a separate choice, and generated text remains editable before it is saved. Guided reflection provides another bounded way to work through a thought. The journal vault is device-local, keeping the saved writing within an experience the person can review and manage.",
      },
      {
        title: "Status and learning",
        text: "The product is in development; this showcase does not imply an app-store release. The images use a clean web preview without personal journal entries. Native recording and on-device transcription depend on a supported device and development build, so a web preview cannot demonstrate those capabilities on its own. The central lesson for me is that useful AI requires careful interaction design as well as model integration: the person needs to understand what happened and retain the ability to edit the result.",
      },
    ],
    gallery: [
      {
        src: "/images/projects/haven-reflection.webp",
        alt: "Haven guided-reflection setup in a clean web preview",
        caption:
          "Guided-reflection setup in the web preview. No personal journal data is shown; native voice behaviour requires a supported device.",
        mobile: true,
      },
    ],
  },
  {
    slug: "serendip-tg",
    name: "Serendip-TG",
    category: "TEAM CONTRIBUTION / AI EXPERIENCES",
    headline: "Build the AI feature—and the workflow around it.",
    summary:
      "Contributions to AI-generated story quizzes and profile-driven themes in an existing Telegram Bot and Mini App platform.",
    role: "AI feature & full-stack contributor",
    status: "Team project · Contribution overview",
    tags: ["FastAPI", "Celery", "React", "TypeScript"],
    sections: [
      {
        title: "The team context",
        text: "Serendip-TG is a Telegram Bot and Mini App platform centred on human connection. I contributed specific AI features within an existing team codebase. The platform’s wider matching and social experience is team work; this overview focuses on the generation workflows, editing tools, and interface integration I worked on. That distinction matters because the value of a contribution is in the behaviour it adds and the problems it resolves.",
      },
      {
        title: "Story generation and review",
        text: "My work included an AI-generated story quiz flow and the surrounding generation pipeline. Generated content needs a path from a request to a draft, review, and publication. I contributed admin draft editing, generation-status listing, and status polling so an operator can understand where a request stands and work with its output. The result is a more complete feature than a single call that returns generated text.",
      },
      {
        title: "Keeping background work reliable",
        text: "Generation can take longer than an ordinary request and may complete while other work is happening. My contributions included releasing database transactions during external generation, handling concurrent completion, and improving the background workflow’s status handling. I also worked on CI test fixes around the feature. These changes focus on reliable coordination between the API, worker tasks, persistence, and the interface that needs to report progress to a person.",
      },
      {
        title: "Profile-driven interfaces",
        text: "I also contributed to UI theme generation through an asynchronous pipeline and corrected theme-cache invalidation. This work connects structured profile information to a personalised interface while keeping generation separate from ordinary page interactions. The portfolio presents these as contributions to the existing product, with no private source or user profiles exposed. Working in a shared codebase reinforced the importance of explicit feature boundaries, reviewable changes, and fitting new AI behaviour into established product flows.",
      },
    ],
  },
];
