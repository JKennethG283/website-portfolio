/** Must match offline embed script and runtime query embedding. */
export const EMBEDDING_MODEL =
  "sentence-transformers/all-MiniLM-L6-v2" as const;

export const HF_INFERENCE_URL = `https://api-inference.huggingface.co/models/${encodeURIComponent(
  EMBEDDING_MODEL,
)}`;

export const RAG_TOP_K = 5;
