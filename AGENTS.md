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

- Tailwind CSS v4 uses `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives). Theme tokens are configured with `@theme inline` blocks.
- ESLint config is in `eslint.config.mjs` (flat config format, ESLint v9).
- The project uses the Next.js App Router with the `src/` directory layout. Pages live under `src/app/`.
- No database or external services are required — the site is fully static.
