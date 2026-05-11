/**
 * Generates lexical-only rag-index.json without TS tooling (same chunk rules as src/server/rag/chunk-markdown.ts).
 * Run: node scripts/gen-rag-json.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_CHUNK_CHARS = 2000;
const OVERLAP_CHARS = 160;

function sliceWithOverlap(text) {
  const t = text.trim();
  if (t.length <= MAX_CHUNK_CHARS) return [t];
  const parts = [];
  let start = 0;
  while (start < t.length) {
    const end = Math.min(start + MAX_CHUNK_CHARS, t.length);
    let slice = t.slice(start, end);
    if (end < t.length) {
      const lastBreak = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(". "));
      if (lastBreak > MAX_CHUNK_CHARS * 0.4) {
        slice = slice.slice(0, lastBreak + 1);
      }
    }
    parts.push(slice.trim());
    const nextStart = start + slice.length - OVERLAP_CHARS;
    start = nextStart > start ? nextStart : start + slice.length;
  }
  return parts.filter(Boolean);
}

function chunkMarkdown(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const lines = normalized.split("\n");
  const sections = [];
  let buffer = [];
  const flushBuffer = () => {
    if (buffer.length) {
      sections.push(buffer.join("\n").trim());
      buffer = [];
    }
  };
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      flushBuffer();
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();
  const chunks = [];
  for (const section of sections) {
    if (!section) continue;
    chunks.push(...sliceWithOverlap(section));
  }
  return chunks;
}

const ROOT = process.cwd();
const md = await readFile(
  path.join(ROOT, "content", "knowledge", "rag.md"),
  "utf8",
);
const texts = chunkMarkdown(md).map((t) => t.trim()).filter(Boolean);
const index = {
  embeddingModel: "sentence-transformers/all-MiniLM-L6-v2",
  generatedAt: new Date().toISOString(),
  lexicalOnly: true,
  chunks: texts.map((text, i) => ({
    id: `jk-${i}`,
    text,
    embedding: null,
  })),
};
const outDir = path.join(ROOT, "src", "data");
const outFile = path.join(outDir, "rag-index.json");
await mkdir(outDir, { recursive: true });
await writeFile(outFile, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`Wrote ${texts.length} chunks to ${outFile}`);
