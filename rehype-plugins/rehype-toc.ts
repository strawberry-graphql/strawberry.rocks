import GithubSlugger from "github-slugger";
import { toString } from "hast-util-to-string";
import { Element, Root } from "hastscript/lib/create-h";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = {
  title?: string;
  id?: string;
  level: number;
  children: TocItem[];
};

const HEADINGS = ["h1", "h2"];

export const RehypeTOC =
  (options: { onlyLinks?: boolean; items: TocItem[] }) => (): Plugin => {
    // @ts-expect-error
    return (tree: Root) => {
      const slugger = new GithubSlugger();

      const root: TocItem = {
        level: 0,
        children: [],
        title: "Root",
      };
      const stack = [root];

      function collectAndAddLinksToHeaders(node: Element) {
        if (!HEADINGS.includes(node.tagName as string)) {
          return;
        }

        const text = toString(node);

        if (!node.properties?.id) {
          node.properties = {
            ...node.properties,
            id: slugger.slug(text),
          };

          node.children = [
            {
              type: "element",
              tagName: "a",
              properties: {
                href: `#${node.properties.id}`,
                name: node.properties.id,
                insideHeading: true,
              },
              children: node.children,
            },
          ];
        }

        const item: TocItem = {
          title: text,
          id: node.properties.id as string,
          level: parseInt(node.tagName.substr(1), 10),
          children: [],
        };

        options.items.push(item);

        let current = stack[stack.length - 1];

        while (item.level <= current.level) {
          stack.pop();
          current = stack[stack.length - 1];
        }

        if (item.level > current.level) {
          current.children.push(item);
          stack.push(item);
          return;
        }
      }

      visit(tree, "element", collectAndAddLinksToHeaders);
    };
  };
