import { HF_INFERENCE_URL } from "./constants";

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

export async function hfEmbedQuery(text: string): Promise<number[] | null> {
  const token =
    process.env.HF_API_KEY ??
    process.env.HUGGING_FACE_HUB_TOKEN ??
    process.env.HF_TOKEN;
  if (!token) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(HF_INFERENCE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ inputs: text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[rag] HF embed query failed:", res.status, body.slice(0, 300));
    return null;
  }

  const json: unknown = await res.json();
  const rows = normalizeInferenceEmbeddings(json);
  return rows[0] ?? null;
}
