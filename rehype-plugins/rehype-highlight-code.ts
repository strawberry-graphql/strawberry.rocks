import { fromHtml } from "hast-util-from-html";
import { refractor } from "refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";
import { visit } from "unist-util-visit";

refractor.register(python);
refractor.register(graphql);
refractor.register(markdown);
refractor.register(json);

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

    parentNode.children[index] = tree.children[0];

    // node.children = tree.children;

    //   // @ts-expect-error

    // }
  };

  return () => {
    return (tree: any) => {
      // @ts-ignore
      visit(tree, "element", visitor);
    };
  };
};
