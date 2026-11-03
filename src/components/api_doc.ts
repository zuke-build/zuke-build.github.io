// A tiny, safe markdown-lite pass: escapes HTML first, then re-introduces a
// handful of jsDoc constructs as tags — code fences, inline `code`,
// **bold**, {@link X} — so a symbol's doc reads like prose without pulling
// in a markdown dependency for text that's already close to plain text.
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderInline = (escaped: string) =>
  escaped
    .replace(
      /\{@link\s+([^\s}|]+)(?:\s*\|\s*([^}]+))?\}/g,
      (_, ref: string, label?: string) => `<code>${(label ?? ref).trim()}</code>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

export const renderParagraph = (text: string) =>
  renderInline(escapeHtml(text.replace(/\n+/g, " ").trim()));

export function renderDoc(doc: string): string {
  if (!doc) return "";
  const parts: string[] = [];
  const fence = /```[a-zA-Z0-9]*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let lead = true;
  let match: RegExpExecArray | null;
  const flushText = (text: string) => {
    for (const para of text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)) {
      parts.push(`<p${lead ? ' class="doc-lead"' : ""}>${renderParagraph(para)}</p>`);
      lead = false;
    }
  };
  while ((match = fence.exec(doc))) {
    flushText(doc.slice(lastIndex, match.index));
    parts.push(`<pre class="doc-pre"><code>${escapeHtml(match[1].replace(/\n$/, ""))}</code></pre>`);
    lastIndex = fence.lastIndex;
  }
  flushText(doc.slice(lastIndex));
  return parts.join("\n");
}

