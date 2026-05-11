import { createGroq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { PORTFOLIO_SYSTEM_PROMPT } from "@/server/assistant/system-prompt";
import { retrieveForQuery } from "@/server/rag/retrieve";

export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
});

function getLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user" || !m.parts?.length) continue;
    const fromParts = m.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n");
    if (fromParts.trim()) return fromParts.trim();
  }
  return "";
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY?.trim()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[api/chat] GROQ_API_KEY is missing or empty. Add it to .env.local and restart `npm run dev`.",
      );
    }
    return Response.json(
      {
        error:
          "Chat is not configured. Add GROQ_API_KEY to the server environment.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid message payload." }, { status: 400 });
  }

  const { messages } = parsed.data;
  if (messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const lastUser = getLastUserText(messages);
  const { contextBlock, mode } = await retrieveForQuery(lastUser);

  const system = [
    PORTFOLIO_SYSTEM_PROMPT,
    "",
    `Retrieval mode: ${mode}.`,
    "",
    "CONTEXT (portfolio excerpts — may be partial):",
    contextBlock.trim() ? contextBlock : "(no excerpts retrieved)",
  ].join("\n");

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system,
    messages: convertToModelMessages(messages),
    temperature: 0.35,
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse();
}
