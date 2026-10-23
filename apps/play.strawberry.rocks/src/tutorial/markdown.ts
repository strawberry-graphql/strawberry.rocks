import { Marked } from "marked";

// Code blocks work like in the Svelte tutorial: a first line like
// `/// file: schema.py` shows the file's name above the code, and code
// between +++ is highlighted as added, and between --- as removed

export type CodeMark = { start: number; end: number; kind: "add" | "remove" };

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// lucide's file icon
const FILE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';

/** The code without the markers, and where the marked code is in it */
const parseMarks = (code: string) => {
  const marks: CodeMark[] = [];
  let text = "";
  let last = 0;

  for (const match of code.matchAll(/(\+\+\+|---)([\s\S]*?)\1/g)) {
    text += code.slice(last, match.index);
    marks.push({
      start: text.length,
      end: text.length + match[2].length,
      kind: match[1] === "+++" ? "add" : "remove",
    });
    text += match[2];
    last = match.index + match[0].length;
  }

  text += code.slice(last);

  // One mark per line, without the indentation, so only the code stands out
  const lineMarks = marks.flatMap((mark) => {
    const parts: CodeMark[] = [];
    let start = mark.start;

    for (const line of text.slice(mark.start, mark.end).split("\n")) {
      const indent = line.length - line.trimStart().length;

      if (line.trim()) {
        parts.push({
          start: start + indent,
          end: start + line.trimEnd().length,
          kind: mark.kind,
        });
      }

      start += line.length + 1;
    }

    return parts;
  });

  return { text, marks: lineMarks };
};

const markdown = new Marked({
  renderer: {
    code({ text, lang }) {
      const file = text.match(/^\/\/\/ file: (.+)\n/);
      const { text: code, marks } = parseMarks(
        file ? text.slice(file[0].length) : text
      );
      const header = file
        ? `<div class="code-file">${FILE_ICON}${escapeHtml(file[1])}</div>`
        : "";

      return `<div class="code-block">${header}<pre><code class="language-${escapeHtml(
        lang ?? "text"
      )}" data-marks="${escapeHtml(JSON.stringify(marks))}">${escapeHtml(
        code
      )}</code></pre></div>`;
    },
  },
});

export const renderMarkdown = (text: string) =>
  markdown.parse(text, { async: false });

/**
 * Wraps the marked code in <mark>s, once the code has been highlighted. The
 * highlighted code has a <br> at the end of every line instead of newlines
 */
export const applyMarks = (element: HTMLElement, marks: CodeMark[]) => {
  if (!marks.length) {
    return;
  }

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );
  const nodes: { node: Text; start: number }[] = [];
  let offset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node instanceof Text) {
      nodes.push({ node, start: offset });
      offset += node.length;
    } else if (node.nodeName === "BR") {
      offset += 1;
    }
  }

  for (const { node, start } of nodes) {
    let current = node;
    let currentStart = start;

    for (const mark of marks) {
      const from = Math.max(mark.start, currentStart);
      const to = Math.min(mark.end, currentStart + current.length);

      if (from >= to) {
        continue;
      }

      // Split off the text before and after the mark
      const marked = current.splitText(from - currentStart);
      const rest = marked.splitText(to - from);
      const wrapper = document.createElement("mark");

      wrapper.className = `code-${mark.kind}`;
      marked.replaceWith(wrapper);
      wrapper.append(marked);
      current = rest;
      currentStart = to;
    }
  }
};
