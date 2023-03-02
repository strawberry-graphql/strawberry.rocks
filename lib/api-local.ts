import { promises as fs } from "fs";

import { getDocTree } from "./doc-tree";

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
  const readmePath = process.env.LOCAL_REPO_PATH + "/docs/README.md";

  const pageText = await fs.readFile(path, "utf8");
  const readmeText = await fs.readFile(readmePath, "utf8");

  return {
    page: pageText,
    tableContent: await getDocTree(readmeText, prefix),
  };
};
