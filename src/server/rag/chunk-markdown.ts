/**
 * Split portfolio markdown into RAG chunks: primary split on ## headings,
 * then length-based slices with overlap for long sections.
 */
/** Large enough for longest portfolio sections; avoids mid-word overlap splits. */
const MAX_CHUNK_CHARS = 2000;
const OVERLAP_CHARS = 160;

function sliceWithOverlap(text: string): string[] {
  const t = text.trim();
  if (t.length <= MAX_CHUNK_CHARS) return [t];

  const parts: string[] = [];
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

export function chunkMarkdown(markdown: string): string[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const sections: string[] = [];
  const lines = normalized.split("\n");
  let buffer: string[] = [];

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

  const chunks: string[] = [];
  for (const section of sections) {
    if (!section) continue;
    chunks.push(...sliceWithOverlap(section));
  }

  return chunks;
}
