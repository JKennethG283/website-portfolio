<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a Next.js 16 portfolio website using TypeScript, Tailwind CSS v4, and the App Router (`src/app/`).

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Build | `npm run build` |

### Notes

- Tailwind CSS v4 uses `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives). Page styling also uses `src/styles/portfolio.css`.
- ESLint config is in `eslint.config.mjs` (flat config format, ESLint v9).
- The project uses the Next.js App Router with the `src/` directory layout. Routes and API handlers live under `src/app/`.
- **Layout:** `src/app/` (route entry points and page composition), `src/components/site/` (shared site UI), `src/features/` (assistant, object-detection, and RPS UI with feature-local helpers/styles), `src/server/` (RAG + assistant prompts used by API routes), `src/data/` (generated `rag-index.json`), `content/knowledge/` (RAG source markdown). Chat uses Groq + optional HF embeddings (env vars).
- Keep feature-specific logic beside its UI; use relative imports within a feature and `@/` imports across folders. Import modules directly without barrel files. Browser components must not import `src/server/` modules.
