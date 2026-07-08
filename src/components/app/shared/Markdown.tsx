import { Fragment } from "react";

/**
 * Minimal, safe inline markdown renderer for assistant replies.
 *
 * Supports a deliberately small subset — bold (`**text**`), inline code
 * (`` `code` ``), bullet lists, and paragraphs. It never uses
 * `dangerouslySetInnerHTML`: input is tokenized and rendered as React elements,
 * so model output cannot inject markup. Anything unrecognized renders as plain
 * text.
 */
export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\s*[-*]\s+/.test(l)) && lines.length > 0;

        if (isList) {
          return (
            <ul key={i} className="my-2 ml-4 list-disc space-y-1">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="my-2 first:mt-0 last:mb-0">
            {lines.map((line, j) => (
              <Fragment key={j}>
                {renderInline(line)}
                {j < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Render bold and inline-code spans within a single line of text. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold** or `code`, keeping the delimiters via capture groups.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  parts.forEach((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      nodes.push(
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>,
      );
    } else if (/^`[^`]+`$/.test(part)) {
      nodes.push(
        <code
          key={i}
          className="rounded bg-surface-3 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part) {
      nodes.push(<Fragment key={i}>{part}</Fragment>);
    }
  });

  return nodes;
}
