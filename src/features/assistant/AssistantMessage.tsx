import { Fragment } from "react";

function inline(text: string) {
  // Render common model formatting as React text nodes, never as raw HTML.
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : part.startsWith("`") && part.endsWith("`") ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

export function AssistantMessage({ text }: { text: string }) {
  return text.split(/\n\s*\n/).map((block, index) => {
    const lines = block.trim().split("\n");
    if (lines.every((line) => /^[-*] /.test(line))) {
      return (
        <ul key={index}>
          {lines.map((line, i) => (
            <li key={i}>{inline(line.slice(2))}</li>
          ))}
        </ul>
      );
    }
    if (lines.every((line) => /^\d+\. /.test(line))) {
      return (
        <ol key={index}>
          {lines.map((line, i) => (
            <li key={i}>{inline(line.replace(/^\d+\. /, ""))}</li>
          ))}
        </ol>
      );
    }
    return <p key={index}>{inline(block.replace(/^#{1,6} /, ""))}</p>;
  });
}
