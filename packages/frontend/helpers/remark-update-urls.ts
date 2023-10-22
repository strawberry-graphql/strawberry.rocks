import path from "path";
import { visit } from "unist-util-visit";

import { OWNER, REF, REPO } from "~/lib/api/github";

export const updateURLsPlugin =
  ({
    path: basePath,
    ref = REF,
    owner = OWNER,
    repo = REPO,
  }: {
    path: string;
    ref?: string;
    owner?: string;
    repo?: string;
  }) =>
  () => {
    function visitor(node: { url?: string }) {
      if (!node.url) return;

      if (node.url.startsWith("http")) {
        return;
      }

      if (node.url.startsWith("/")) {
        return;
      }

      if (node.url.startsWith("#")) {
        return;
      }

      if (node.url.startsWith(".")) {
        const baseFolder = path.dirname(basePath);
        let newPath = path.join(baseFolder, node.url);
        newPath = newPath.replace(".md", "");

        node.url = `/docs/${newPath}`;
      }
    }

    function transform(tree: any) {
      visit(tree, ["link", "linkReference"], visitor);
    }

    return transform;
  };
