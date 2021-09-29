import { toHtml } from "hast-util-to-html";
import { Node } from "hast-util-to-html/lib/types";
import { Root, toString } from "hast-util-to-string";
import rangeParser from "parse-numeric-range";
import { refractor } from "refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";
import parse from "rehype-parse";
import { Plugin, unified } from "unified";
import { Parent, visit } from "unist-util-visit";

refractor.register(python);
refractor.register(graphql);
refractor.register(markdown);
refractor.register(json);

const highlightLines = (root: Root, lines: number[]) => {
  let currentGroup: typeof root.children = [];
  const lineGroups: typeof currentGroup[] = [];

  root.children.forEach((node) => {
    if (node.type === "text") {
      if (node.value.startsWith("\n")) {
        while (node.value.startsWith("\n")) {
          lineGroups.push(currentGroup);
          currentGroup = [];
          node.value = node.value.slice(1);
        }

        currentGroup.push(node);
      } else if (node.value.endsWith("\n")) {
        currentGroup.push(node);

        while (node.value.endsWith("\n")) {
          lineGroups.push(currentGroup);
          currentGroup = [];
          node.value = node.value.slice(0, -1);
        }
      } else {
        currentGroup.push(node);
      }
    } else {
      currentGroup.push(node);
    }
  });

  root.children = lineGroups.map((children, index) => {
    const lineNumber = index + 1;

    if (children.length === 0) {
      children = [{ type: "text", value: "\n" }];
    }

    let className = "";

    if (lines.length > 0) {
      if (lines.includes(lineNumber)) {
        className += "code-highlighted-line";
      } else {
        className += "code-dimmed-line";
      }
    }

    return {
      type: "element",
      tagName: "div",
      properties: {
        dataLine: lineNumber,
        className: className,
      },
      children,
    };
  }) as typeof root.children;

  return root;
};

const highlightWords = (root: Root, words: string[]) => {
  if (words.length === 0) {
    return root;
  }

  // @ts-ignore
  root.children = root.children.flatMap((node) => {
    if (node.type === "text") {
      const initial = node.value;

      const start: string[] = [];
      const end: string[] = [];

      while (node.value.match(/^[ \"]/)) {
        const char = node.value[0];
        node.value = node.value.slice(1);
        start.push(char);
      }

      while (node.value.match(/[ \"]$/)) {
        const char = node.value[node.value.length - 1];
        node.value = node.value.slice(0, -1);
        // we are adding things from the end so we always need
        // to add each char at the beginning of the array
        end.unshift(char);
      }

      const middle = (node.value as string)
        .split(" ")
        .flatMap((word) => {
          if (words.includes(word.replace(/"/g, ""))) {
            return [
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: "code-highlighted-word",
                },
                children: [
                  {
                    type: "text",
                    value: word,
                  },
                ],
              },
              { type: "text", value: " " },
            ];
          }

          return [
            { type: "text", value: word },
            { type: "text", value: " " },
          ];
        })
        .slice(0, -1);

      return [
        ...start.map((text) => ({
          type: "text",
          value: text,
        })),
        ...middle,
        ...end.map((text) => ({
          type: "text",
          value: text,
        })),
      ];
    }

    if (node.children) {
      // @ts-ignore
      return highlightWords(node, words);
    }

    return node;
  });

  return root;
};

export const RehypeHighlightCode: Plugin = (options = {}) => {
  return (tree) => {
    visit(tree, "element", visitor);
  };

  function visitor(node: Node, index: Number, parentNode: Node) {
    if (parentNode.tagName === "pre" && node.tagName === "code") {
      const properties = node.properties as any;

      // syntax highlight
      const lang = properties.className
        ? properties.className[0].split("-")[1]
        : "md";

      if (lang == "python+schema") {
        return;
      }

      let root = refractor.highlight(toString(node), lang);

      const linesToHighlight = properties.line
        ? rangeParser(properties.line)
        : [];

      const wordsToHighlight = properties.highlight
        ? (properties.highlight as string).split(",")
        : [];

      // @ts-ignore
      const html = toHtml(root);
      const hast = unified()
        .use(parse, { emitParseErrors: true, fragment: true })
        .parse(html);

      let result = highlightLines(hast, linesToHighlight);
      result = highlightWords(result, wordsToHighlight);
      // TODO: highlight word somehow

      node.children = result.children;
    }
  }
};
