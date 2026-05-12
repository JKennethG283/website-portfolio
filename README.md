# Portfolio website

Personal portfolio site for **Jonathan Kenneth Gunawan** — Bachelor of Artificial Intelligence (UTS). Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and the **App Router** (`src/app/`).

Live styling combines Tailwind with `src/styles/portfolio.css` (layout, sections, demos).

## Features

- **One-page portfolio:** hero, about (with profile photo), skills, playground, featured projects (carousel with GitHub links), experience, contact.
- **Playground:** hand **object detection** demo (`/object-detection`) and **Rock–Paper–Scissors** vs a Markov-style opponent (`/rps-markov`).
- **Portfolio assistant:** floating chat panel with **RAG** over `content/knowledge/rag.md` and streaming replies via **Groq**.
- **Animations:** section scroll-reveal, hero stagger, chat bubble motion (respects `prefers-reduced-motion`).

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

## Project layout (high level)

```
src/app/           App Router pages & API routes (`api/chat`, demos)
src/ui/            Site shell, carousel, reveal sections, assistant UI
src/server/        RAG retrieval, assistant system prompt
src/data/          rag-index.json (generated)
content/knowledge/ rag.md (source of truth for RAG text)
public/images/     Static assets (e.g. profile photo)
```

## Deployment (e.g. Vercel)

1. Connect the GitHub repository and enable automatic deployments for `main`.
2. Add **`GROQ_API_KEY`** (and optional HF token) under **Project → Settings → Environment Variables**.
3. Ensure `rag-index.json` is up to date for the knowledge you want in production, or run `rag:build` / `rag:index` in CI if you automate it.

## Repository

**https://github.com/JKennethG283/website-portfolio**

---

Next.js in this repo may differ from older major versions; see `node_modules/next/dist/docs/` when upgrading or debugging framework behavior.
