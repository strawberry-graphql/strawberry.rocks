import { dirname, join } from "path";
import { Node } from "unist";
import visit from "unist-util-visit";

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
    visit(tree, "image", (node) => {
      const url = isString(node.url) ? node.url : "";

      if (url.startsWith(".")) {
        const updatedPath = join("docs", dirname(path), node.url as string);

        node.url = `https://github.com/${owner}/${repo}/raw/${ref}/${updatedPath}`;
      }
    });
  };
