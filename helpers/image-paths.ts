import { dirname, join } from "path";
import visit from "unist-util-visit";

import { OWNER, REF, REPO } from "~/lib/api";

export const fixImagePathsPlugin = (
  path: string,
  ref = REF,
  owner = OWNER,
  repo = REPO
) => () => (tree) => {
  visit(tree, "image", (node) => {
    const url = node.url as string;

    if (url.startsWith(".")) {
      const updatedPath = join("docs", dirname(path), node.url as string);

      node.url = `https://github.com/${owner}/${repo}/raw/${ref}/${updatedPath}`;
    }
  });
};
