import { promises as fs } from "fs";

import { getDocTree } from "./doc-tree";

export const fetchTableOfContentsLocal = async ({
  prefix,
}: {
  prefix: string;
}) => {
  const readmePath = process.env.LOCAL_REPO_PATH + "/docs/README.md";

  const readmeText = await fs.readFile(readmePath, "utf8");

  return getDocTree(readmeText, prefix);
};

export const fetchDocPageLocal = async ({
  prefix,
  filename,
}: {
  prefix: string;
  filename: string;
  owner?: string;
  repo?: string;
  ref?: string;
}) => {
  const path = process.env.LOCAL_REPO_PATH + "/" + filename;

  const pageText = await fs.readFile(path, "utf8");

  return {
    page: pageText,
    tableContent: null,
  };
};
