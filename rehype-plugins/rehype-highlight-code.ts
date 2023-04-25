import { fromHtml } from "hast-util-from-html";
import { toString } from "hast-util-to-string";
import rangeParser from "parse-numeric-range";
import { refractor } from "refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";
import { visit } from "unist-util-visit";
import { inspect } from "util";

refractor.register(python);
refractor.register(graphql);
refractor.register(markdown);
refractor.register(json);

const highlightWords = (children: any, words: string[]) => {
  const newChildren: any = [];

  children.forEach((child: any) => {
    if (child.type === "text") {
      const wordsToHighlight = words.map((word) => word.toLowerCase());

      const text = child.value;

      // split on whitespace
      const wordsInText = text.split(/(\s+)/);

      wordsInText.forEach((word: string) => {
        if (wordsToHighlight.includes(word.toLowerCase())) {
          newChildren.push({
            type: "element",
            tagName: "mark",
            children: [
              {
                type: "text",
                value: word,
              },
            ],
          });
        } else {
          newChildren.push({
            type: "text",
            value: word,
          });
        }
      });
    } else if (child.type === "element") {
      child.children = highlightWords(child.children, words);
      newChildren.push(child);
    } else {
      newChildren.push(child);
    }
  });

  return newChildren;
};

const processCode = (
  tree: any,
  metadata: {
    highlight?: string[];
    lines?: number[];
  }
) => {
  if (metadata.highlight) {
    // highlight each word
    tree.children = highlightWords(tree.children, metadata.highlight);
  }

  if (metadata.lines) {
    tree.children[0].children
      .filter((child: any) => child.properties?.className.includes("line"))
      .forEach((child: any, index: number) => {
        if (metadata.lines!.includes(index + 1)) {
          child.properties.className.push("highlight");
        }
      });
  }

  // skip all lines that start with `# fmt:` and the line after
  let previousWasFmt = false;
  tree.children[0].children = tree.children[0].children.filter((child: any) => {
    const text = toString(child);

    const isFmt = text.startsWith("# fmt:");

    if (isFmt) {
      previousWasFmt = true;

      return false;
    }

    if (previousWasFmt) {
      previousWasFmt = false;

      return false;
    }

    return true;
  });

  return tree;
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

export const RehypeHighlightCode = ({ highlighter }: { highlighter: any }) => {
  const visitor = (node: any, index: number, parentNode: any) => {
    if (node.tagName === "code" && parentNode.tagName !== "pre") {
      node.properties.inline = true;
    }

    if (node.tagName !== "pre") {
      return;
    }

    const codeNode = node.children[0];

    const language = codeNode.properties.className
      ?.find((className: string) => className.startsWith("language-"))
      ?.replace("language-", "");

    if (!language) {
      console.warn("No language found for code block");
      // eslint-disable-next-line no-console
      console.debug(codeNode.properties);

      return;
    }

    const data = node.children[0].data;

    const metadata = data?.meta
      ? Object.fromEntries(
          data.meta.split(" ").map((x: string) => x.split("="))
        )
      : {};

    if (metadata.highlight) {
      metadata.highlight = metadata.highlight.split(",");
    }

    if (metadata.lines) {
      metadata.lines = rangeParser(metadata.lines);
    }

    const code = codeNode.children[0].value;

    if (language.includes("+")) {
      const [firstLanguage, secondLanguage] = language
        .split("+")
        .map(normalizeLanguage);
      // const [firstHeader, secondHeader] = language.split("+").map(getHeader);
      const [firstCode, secondCode] = code
        .split(/^---$/m)
        .map((x: string) => x.trim());

      const firstCodeHtml = highlighter.codeToHtml(firstCode, firstLanguage);
      const secondCodeHtml = highlighter.codeToHtml(secondCode, secondLanguage);

      const firstTree = fromHtml(firstCodeHtml, { fragment: true });
      const secondTree = fromHtml(secondCodeHtml, { fragment: true });

      parentNode.children[index] = {
        type: "element",
        tagName: "SideBySide",
        children: [firstTree.children[0], secondTree.children[0]],
      };

      return;
    }

    const codeHtml = highlighter.codeToHtml(code, language);

    const tree = fromHtml(codeHtml, { fragment: true });

    parentNode.children[index] = processCode(tree.children[0], metadata);
  };

  return () => {
    return (tree: any) => {
      // @ts-ignore
      visit(tree, "element", visitor);
    };
  };
};
