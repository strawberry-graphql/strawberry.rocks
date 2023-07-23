import { Text } from "hast-util-to-html/lib/types";
import { dirname, join } from "path";
// @ts-ignore
import { Node } from "unist";
import { visit } from "unist-util-visit";

import { OWNER, REF, REPO } from "~/lib/api";

import { isString } from "./type-guards";

export const fixImagePathsPlugin =
  ({
    path,
    ref = REF,
    owner = OWNER,
    repo = REPO,
  }: {
    path: string;
    ref?: string;
    owner?: string;
    repo?: string;
  }) =>
  () =>
  (tree: Node) => {
    const getUrl = (url: string) => {
      if (url.startsWith(".")) {
        const updatedPath = join("docs", dirname(path), url as string);

        return `https://github.com/${owner}/${repo}/raw/${ref}/${updatedPath}`;
      }

      return url;
    };

    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name === "img") {
        node.attributes = node.attributes.map((attr: any) => {
          if (attr.name === "src") {
            attr.value = getUrl(attr.value as string);
          }

          return attr;
        });
      }
    });

    visit(tree, { type: "element", tagName: "img" }, (node) => {
      if (node.properties.src) {
        node.properties.src = getUrl(node.properties.src as string);
      }
    });

    visit(tree, "jsx", (node: Text) => {
      if (node.value.includes("<img")) {
        const [, src] = node.value.split("src=");
        const [, url] = src.split('"');

        node.value = node.value.replace(url, getUrl(url));
      }
    });

    visit(tree, "image", (node: Node) => {
      const url = isString(node.url) ? node.url : "";
      node.url = getUrl(url);
    });
  };
