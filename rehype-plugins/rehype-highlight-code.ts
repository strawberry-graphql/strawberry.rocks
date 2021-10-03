import { toHtml } from "hast-util-to-html";
import { Node, Text, Element, Comment } from "hast-util-to-html/lib/types";
import { Root, toString } from "hast-util-to-string";
import rangeParser from "parse-numeric-range";
import { refractor } from "refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";
import parse from "rehype-parse";
import { Plugin, unified } from "unified";
import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

refractor.register(python);
refractor.register(graphql);
refractor.register(markdown);
refractor.register(json);

const highlightLines = (root: Root, lines: number[]) => {
  let currentGroup: typeof root.children = [];
  const lineGroups: typeof currentGroup[] = [];

  const addToGroups = (node: Text) => {
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
      if (node.value.includes("\n")) {
        const parts = node.value.split(/(\n)/g);

        parts.forEach((part) => {
          addToGroups({ value: part, type: "text" });
        });
      } else {
        currentGroup.push(node);
      }
    }
  };

  root.children.forEach((node) => {
    if (node.type === "text") {
      addToGroups(node);
    } else {
      currentGroup.push(node);
    }
  });

  if (currentGroup.length > 0) {
    lineGroups.push(currentGroup);
  }

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

const findNotes = (root: Root) => {
  // iterate through the lines of the root node

  visitParents(root, "text", (node, ancestors) => {
    if (node.value === "^") {
      let parent = ancestors[ancestors.length - 1];

      let i = 0;
      let index = -1;

      while (parent.children.length === 1) {
        let previous = parent;
        parent = ancestors[ancestors.length - 1 - i];
        i += 1;

        // @ts-ignore
        index = parent.children.indexOf(previous);
      }

      if (index === -1) {
        return;
      }

      const startIndex = index;

      if (toString(parent.children[++index]) !== "[") {
        return;
      }

      const noteId = toString(parent.children[++index]);

      if (toString(parent.children[++index]) !== "]") {
        return;
      }

      if (toString(parent.children[++index]) !== "(") {
        return;
      }

      while (
        parent.children.length > index &&
        toString(parent.children[index]) !== ")"
      ) {
        index += 1;
      }

      if (index === parent.children.length) {
        return;
      }

      const wrapper: Element = {
        type: "element",
        tagName: "span",
        properties: {
          className: "code-note",
          dataNoteId: noteId,
        },
        children: [],
      };

      parent.children.splice(startIndex, 5);

      const endIndex = index - 5;

      // @ts-ignore
      wrapper.children = parent.children.splice(startIndex, endIndex);
      wrapper.children.pop();

      parent.children.splice(startIndex, endIndex, wrapper);
    }
  });

  return root;
};

const highlight = (
  text: string,
  language: string,
  options: {
    linesToHighlight: number[];
    wordsToHighlight: string[];
  }
) => {
  const root = refractor.highlight(text, language);

  // @ts-ignore
  const html = toHtml(root);
  const hast = unified()
    .use(parse, { emitParseErrors: true, fragment: true })
    .parse(html);

  let result = highlightLines(hast, options.linesToHighlight);
  result = findNotes(result);
  result = highlightWords(result, options.wordsToHighlight);

  return result;
};

const normalizeLanguage = (language: string) => {
  if (language === "response") {
    return "json";
  }

  if (language === "schema") {
    return "graphql";
  }

  return language;
};

const getHeader = (language: string) => {
  if (language === "response") {
    return "Response";
  }

  if (language === "schema") {
    return "Schema";
  }

  if (language === "graphql") {
    return "Query";
  }

  return language.charAt(0).toUpperCase() + language.slice(1);
};

const createPre = ({
  language,
  text,
  linesToHighlight,
  wordsToHighlight,
}: {
  language: string;
  text: string;
  linesToHighlight: number[];
  wordsToHighlight: string[];
  classNames?: string;
}): Element => {
  return {
    type: "element",
    tagName: "pre",
    properties: {
      className: "language-" + language,
    },
    children: [
      {
        type: "element",
        tagName: "code",
        properties: {
          className: "language-" + language,
          generatedBy: "rehype-highlight-code",
        },
        children: highlight(text, language, {
          linesToHighlight,
          wordsToHighlight,
        }).children,
      } as Element,
    ],
  };
};

const createSplitCodeView = ({
  children,
  leftHeader,
  rightHeader,
}: {
  children: (Element | Text | Comment)[];
  leftHeader: string;
  rightHeader: string;
}) => {
  return {
    type: "element",
    tagName: "SplitCodeView",
    properties: {
      leftHeader,
      rightHeader,
    },
    children,
  };
};

export const RehypeHighlightCode: Plugin = (options = {}) => {
  return (tree) => {
    visit(tree, "element", visitor);
  };

  function visitor(node: Node, index: Number, parentNode: Node) {
    if (parentNode.tagName === "pre" && node.tagName === "code") {
      const properties = node.properties as any;

      if (properties.generatedBy === "rehype-highlight-code") {
        return;
      }

      // syntax highlight
      const lang = properties.className
        ? (properties.className[0] as string).split("-")[1]
        : "md";

      const linesToHighlight = properties.line
        ? rangeParser(properties.line)
        : [];

      const wordsToHighlight = properties.highlight
        ? (properties.highlight as string).split(",")
        : [];

      const text = toString(node);

      if (lang.includes("+")) {
        const [firstLanguage, secondLanguage] = lang
          .split("+")
          .map(normalizeLanguage);
        const [firstHeader, secondHeader] = lang.split("+").map(getHeader);
        const [firstText, secondText] = text
          .split(/^---$/m)
          .map((x) => x.trim());

        parentNode.tagName = "div";
        parentNode.children = [
          createSplitCodeView({
            leftHeader: firstHeader,
            rightHeader: secondHeader,
            children: [
              createPre({
                language: firstLanguage,
                text: firstText,
                linesToHighlight,
                wordsToHighlight,
              }),
              createPre({
                language: secondLanguage,
                text: secondText,
                linesToHighlight,
                wordsToHighlight,
              }),
            ],
          }),
        ];
      } else {
        const result = highlight(text, lang, {
          linesToHighlight,
          wordsToHighlight,
        });

        node.children = result.children;
      }
    }
  }
};
