/**
 * Build-time: chunk markdown, embed via Hugging Face Inference API, write rag-index.json.
 * Without HF_API_KEY / HUGGING_FACE_HUB_TOKEN, writes a lexical-only index (no embeddings).
 *
 * Usage: npm run rag:build
 */
import { config as loadEnv } from "dotenv";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { chunkMarkdown } from "../src/server/rag/chunk-markdown";
import {
  EMBEDDING_MODEL,
  HF_INFERENCE_URL,
} from "../src/server/rag/constants";
import type { RagIndexFile } from "../src/server/rag/types";

/** Same env files Next.js uses; `.env.local` overrides `.env`. */
const ROOT = process.cwd();
loadEnv({ path: path.join(ROOT, ".env") });
loadEnv({ path: path.join(ROOT, ".env.local"), override: true });

const SOURCE = path.join(ROOT, "content", "knowledge", "rag.md");
const OUT_DIR = path.join(ROOT, "src", "data");
const OUT_FILE = path.join(OUT_DIR, "rag-index.json");

const BATCH = 8;

function normalizeInferenceEmbeddings(data: unknown): number[][] {
  if (!Array.isArray(data)) {
    throw new Error("HF inference: expected array response");
  }
  if (data.length === 0) return [];
  if (typeof (data as number[])[0] === "number") {
    return [data as number[]];
  }
  return data as number[][];
}

async function embedBatch(
  inputs: string[],
  token: string | undefined,
): Promise<number[][]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let attempt = 0;
  const maxAttempts = 5;
  while (attempt < maxAttempts) {
    const res = await fetch(HF_INFERENCE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ inputs }),
    });

    if (res.status === 503 && attempt < maxAttempts - 1) {
      const wait = 2000 * (attempt + 1);
      console.warn(`HF model loading (503), retrying in ${wait}ms…`);
      await new Promise((r) => setTimeout(r, wait));
      attempt += 1;
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `HF inference ${res.status}: ${errText.slice(0, 500)}`,
      );
    }

    const json: unknown = await res.json();
    return normalizeInferenceEmbeddings(json);
  }

  throw new Error("HF inference: exhausted retries");
}

async function main() {
  const md = await readFile(SOURCE, "utf8");
  const texts = chunkMarkdown(md).map((t) => t.trim()).filter(Boolean);

  const token =
    process.env.HF_API_KEY ??
    process.env.HUGGING_FACE_HUB_TOKEN ??
    process.env.HF_TOKEN;

  let lexicalOnly = false;
  const chunks: RagIndexFile["chunks"] = [];

  if (!token) {
    console.warn(
      "[rag:build] No HF_API_KEY / HUGGING_FACE_HUB_TOKEN — writing lexical-only index.",
    );
    lexicalOnly = true;
    texts.forEach((text, i) => {
      chunks.push({ id: `jk-${i}`, text, embedding: null });
    });
  } else {
    for (let i = 0; i < texts.length; i += BATCH) {
      const batch = texts.slice(i, i + BATCH);
      const embeddings = await embedBatch(batch, token);
      if (embeddings.length !== batch.length) {
        throw new Error(
          `Embedding batch size mismatch: got ${embeddings.length}, expected ${batch.length}`,
        );
      }
      batch.forEach((text, j) => {
        chunks.push({
          id: `jk-${i + j}`,
          text,
          embedding: embeddings[j] ?? null,
        });
      });
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const index: RagIndexFile = {
    embeddingModel: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    lexicalOnly,
    chunks,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(
    `[rag:build] Wrote ${chunks.length} chunks to ${path.relative(ROOT, OUT_FILE)} (${lexicalOnly ? "lexical-only" : "with embeddings"})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
