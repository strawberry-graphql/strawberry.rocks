import { dirname, join } from "path";
import { Node } from "unist";
import { visit } from "unist-util-visit";

import { OWNER, REF, REPO } from "~/lib/api/github";

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

        if (process.env.LOCAL_REPO_PATH) {
          return `/dev/image-proxy/${updatedPath}`;
        }

        return `https://github.com/${owner}/${repo}/raw/${ref}/${updatedPath}`;
      }

      return url;
    };

    visit(tree, "mdxJsxFlowElement", (node: any) => {
      if (node.name === "img") {
        node.attributes = node.attributes.map((attr: any) => {
          if (attr.name === "src") {
            attr.value = getUrl(attr.value as string);
          }

          return attr;
        });
      }
    });

    visit(tree, "jsx", (node: any) => {
      if (node.value.includes("<img")) {
        const [, src] = node.value.split("src=");
        const [, url] = src.split('"');

        node.value = node.value.replace(url, getUrl(url));
      }
    });

    visit(tree, "image", (node: Node) => {
      // @ts-ignore
      const url = isString(node.url) ? node.url : "";
      // @ts-ignore
      node.url = getUrl(url);
    });
  };
