# Portfolio website

Personal portfolio site for **Jonathan Kenneth Gunawan** — Bachelor of Artificial Intelligence (UTS). Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and the **App Router** (`src/app/`).

Styling combines Tailwind with `src/styles/portfolio.css` (shared foundations and demos) and `src/styles/landscape.css` (the Signal & Landscape visual theme).

## Features

- **One-page portfolio:** photographic hero, Gradstack internship (July 2026–present), scroll-driven featured products, supporting contributions, expandable earlier ML work, about, toolkit, playground, and contact.
- **Project stories:** `/work/flowstudio`, `/work/market-cerdas`, `/work/haven-ai`, and `/work/serendip-tg` provide public product and contribution overviews. Team roles and development status are explicit; private source links are omitted.
- **Project constellation:** `/#project-map` connects the 14 public projects, demos, and contributions by shared themes. A rotating 3D projection supports dragging, selection, theme filters, related projects, and a linked directory. Rotation pauses on node hover/focus, when offscreen, and in background tabs; reduced-motion preferences disable automatic rotation. Rendering uses a local canvas and accessible HTML controls without a 3D library or external service. Inspired by the interconnected knowledge approach in [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); connections describe shared themes, not runtime dependencies.
- **Playground:** hand **object detection** demo (`/object-detection`) and **Rock–Paper–Scissors** vs a Markov-style opponent (`/rps-markov`).
- **Portfolio assistant:** floating chat panel with **RAG** over `content/knowledge/rag.md` and streaming replies via **Groq**.
- **Animations:** native-scroll hero parallax, a sticky project gallery with scroll-linked image crossfades, section reveals, and hover transitions. Mobile and reduced-motion layouts show individual project images; reduced motion also disables smooth scrolling and animations.
- **Accessibility:** skip link, keyboard focus indicators, Escape-to-close menus and assistant, focus return, and content visible before JavaScript loads.

### Visual theme

The homepage pairs midnight blue and icy lavender with atmospheric photography, Space Grotesk headings, and Manrope body text. Images are hosted locally and served through Next.js image optimization. Photography sources are recorded in `public/images/landscapes/CREDITS.md`; inspected product captures and their scope are recorded in `public/images/projects/CREDITS.md`. The Haven images are clean web previews, not demonstrations of native voice capabilities.

`src/data/portfolio.ts` owns the public featured, supporting, and earlier project lists. `src/data/project-case-studies.ts` contains the longer project narratives. `ProjectStory.tsx` handles image transitions; `ProjectVisual.tsx` presents product captures. `ScrollAtmosphere.tsx` handles hero parallax and reading progress with animation-frame updates. Neither motion component replaces native scrolling or requires an animation library.

## Quick start

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Development server | `npm run dev` → [http://localhost:3000](http://localhost:3000) |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |
| Production build | `npm run build` |

## Environment variables

Create **`.env.local`** in the project root (not committed). The chat API requires:

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | **Required** for `/api/chat` (Groq LLM). Without it, the assistant returns HTTP 503 in production and warns in dev. |

Optional (RAG):

| Variable | Purpose |
|----------|---------|
| `HF_API_KEY` or `HUGGING_FACE_HUB_TOKEN` or `HF_TOKEN` | Hugging Face Inference API for **query embeddings** at runtime. If missing, retrieval falls back to **lexical** matching using `src/data/rag-index.json`. |

For **building** the RAG index with embeddings locally, use `npm run rag:build` with one of the HF token variables set (see below).

## RAG knowledge base

- **Source:** `content/knowledge/rag.md` — edit this to change what the assistant can cite.
- **Generated index:** `src/data/rag-index.json` — produced by scripts; commit updates when you change the markdown.

| Script | Description |
|--------|---------------|
| `npm run rag:index` | Lexical-only index (no API calls). Fast; no embeddings. |
| `npm run rag:build` | Chunk markdown, optional HF embeddings, writes `rag-index.json`. Needs HF token for semantic mode. |

After editing `rag.md`, run `npm run rag:index` (or `rag:build` if you use embeddings) before deploying.

## Project layout

```
src/
  app/                      App Router pages, layouts, global CSS entry, API routes
  components/site/          Shared site UI: header, project story, scroll effects, reveal
  features/
    assistant/              Chat UI, speech helpers, and chat styles
    object-detection/       Camera and hand landmark demo
    project-map/            Public graph data, 3D projection, interactive map, styles
    rps/                    RPS game UI and its Markov model
  server/
    assistant/              Assistant system prompt
    rag/                    Retrieval, embeddings, chunking, and types
  data/                     Generated rag-index.json
  styles/                   Shared portfolio styles
content/knowledge/          Markdown source of truth for RAG
scripts/                   RAG index generation and embedding commands
public/images/             Portfolio photos and demo images
public/mediapipe/           Browser-served model and WASM runtime assets
```

### Where new files belong

- Keep route entry points and page composition in `src/app/`.
- Keep a feature's components, helpers, types, and styles together in `src/features/<feature>/`. Use relative imports within a feature, such as `./markov`.
- Put shared presentation components in `src/components/`. Promote feature code here when it is needed across features.
- Keep API credentials, retrieval, and other backend code in `src/server/`; browser components must not import these modules. Build scripts may import the pure RAG chunking utilities and types.
- Use the `@/` alias for imports across folders and import modules directly rather than adding barrel files.
- Edit knowledge in `content/knowledge/` and regenerate `src/data/rag-index.json` with the existing RAG commands. Do not edit the generated index by hand.
- Keep framework configuration at the repository root and URL-addressable assets in `public/`.

## Deployment (e.g. Vercel)

1. Connect the GitHub repository and enable automatic deployments for `main`.
2. Add **`GROQ_API_KEY`** (and optional HF token) under **Project → Settings → Environment Variables**.
3. Ensure `rag-index.json` is up to date for the knowledge you want in production, or run `rag:build` / `rag:index` in CI if you automate it.

## Repository

**https://github.com/JKennethG283/website-portfolio**

---

Next.js in this repo may differ from older major versions; see `node_modules/next/dist/docs/` when upgrading or debugging framework behavior.
