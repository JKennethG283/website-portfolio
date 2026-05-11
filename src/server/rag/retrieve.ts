import ragIndexJson from "@/data/rag-index.json";

import { RAG_TOP_K } from "./constants";
import { hfEmbedQuery } from "./hf-embed";
import type { RagChunk, RagIndexFile } from "./types";

const ragIndex = ragIndexJson as RagIndexFile;

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

function lexicalScores(query: string, chunks: RagChunk[]): Map<string, number> {
  const qTerms = new Set(tokenize(query));
  const scores = new Map<string, number>();
  for (const ch of chunks) {
    const doc = tokenize(ch.text);
    let hits = 0;
    for (const t of doc) {
      if (qTerms.has(t)) hits += 1;
    }
    const norm = Math.sqrt(doc.length + 1);
    scores.set(ch.id, hits / norm);
  }
  return scores;
}

function indexHasEmbeddings(chunks: RagChunk[]): boolean {
  return chunks.some((c) => Array.isArray(c.embedding) && c.embedding.length > 0);
}

export type RetrieveResult = {
  contextBlock: string;
  mode: "semantic" | "lexical";
};

export async function retrieveForQuery(query: string): Promise<RetrieveResult> {
  const q = query.trim();
  if (!q) {
    return { contextBlock: "", mode: "lexical" };
  }

  const chunks = ragIndex.chunks;
  const useSemantic = indexHasEmbeddings(chunks);

  if (useSemantic) {
    const qVec = await hfEmbedQuery(q);
    if (qVec && qVec.length > 0) {
      const scored = chunks
        .filter((c) => c.embedding && c.embedding!.length > 0)
        .map((c) => ({
          chunk: c,
          score: cosineSimilarity(qVec, c.embedding!),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, RAG_TOP_K);

      const text = scored.map((s) => s.chunk.text).join("\n\n---\n\n");
      return {
        contextBlock: text,
        mode: "semantic",
      };
    }
  }

  const scores = lexicalScores(q, chunks);
  const ranked = [...chunks].sort(
    (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
  );
  const top = ranked.slice(0, RAG_TOP_K);
  return {
    contextBlock: top.map((c) => c.text).join("\n\n---\n\n"),
    mode: "lexical",
  };
}
