import { slug } from "github-slugger";
import { toHtml } from "hast-util-to-html";
import { Node } from "hast-util-to-html/lib/types";
import { Element, Root, toString } from "hast-util-to-string";
import { Plugin, unified } from "unified";
import { visit } from "unist-util-visit";

type TocItem = {
  title?: string;
  id?: string;
  level: number;
  children: TocItem[];
};

const getTableOfContentsList = (
  root: TocItem,
  { level = 0, title }: { level: number; title: Element }
): Element => {
  return {
    type: "element",
    tagName: "ul",
    properties: {
      dataLevel: `${level}`,
      dataToc: "true",
    },
    children: root.children
      .filter((item) => item.id != title.properties?.id)
      .map((item) => {
        const children: Element[] = [
          {
            type: "element",
            tagName: "a",
            properties: {
              href: `#${item.id}`,
              className: "toc-link",
            },
            children: [{ type: "text", value: item.title! }],
          },
        ];

        if (item.children.length > 0) {
          children.push(
            getTableOfContentsList(item, { level: level + 1, title })
          );
        }

        return {
          type: "element",
          tagName: "li",
          children,
        };
      }),
  };
};

export const RehypeTOC =
  (options: { onlyLinks?: boolean } = {}) =>
  (): Plugin => {
    return (tree) => {
      const root: TocItem = {
        level: 0,
        children: [],
        title: "Root",
      };
      const stack = [root];

      function collectAndAddLinksToHeaders(node: Element) {
        if (!["h1", "h2", "h3", "h4"].includes(node.tagName as string)) {
          return;
        }

        const text = toString(node);

        if (!node.properties?.id) {
          node.properties = {
            ...node.properties,
            id: slug(text),
          };

          node.children = [
            {
              type: "element",
              tagName: "a",
              properties: {
                href: `#${node.properties.id}`,
                name: node.properties.id,
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

      // find the first h1 and add the toc after it
      let didAddToc = false;

      visit(tree, "element", (node, index, parent) => {
        if (didAddToc) {
          return;
        }

        if (node.tagName === "h1" && index !== null) {
          parent.children.splice(
            index + 1,
            0,
            getTableOfContentsList(root, { level: 0, title: node })
          );

          didAddToc = true;
        }
      });
    };
  };
