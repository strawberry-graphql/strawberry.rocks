import { promises as fs } from "fs";

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
