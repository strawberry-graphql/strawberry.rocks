import * as fs from "fs/promises";
import path from "path";
import shiki from "shiki";

// https://github.com/thien-do/memos.pub/blob/a3babb1f149f05c43012278331f885d81f5fcfac/lib/mdx/plugins/code.ts
// Shiki loads languages and themes using "fs" instead of "import", so Next.js
// doesn't bundle them into production build. To work around, we manually copy
// them over to our source code (lib/shiki/*) and update the "paths".
//
// Note that they are only referenced on server side
// See: https://github.com/shikijs/shiki/issues/138
const getShikiPath = (): string => {
  return path.join(process.cwd(), "lib/shiki");
};

const touched = { current: false };

// "Touch" the shiki assets so that Vercel will include them in the production
// bundle. This is required because shiki itself dynamically access these files,
// so Vercel doesn't know about them by default
const touchShikiPath = (): void => {
  if (touched.current) return; // only need to do once
  fs.readdir(getShikiPath()); // fire and forget
  touched.current = true;
};

const themePath = path.join(process.cwd(), "shiki-theme.json");

export const getHighlighter = async () => {
  touchShikiPath();

  const theme = await shiki.loadTheme(themePath);

  return await shiki.getHighlighter({
    theme,
    langs: ["javascript", "python", "graphql", "typescript", "bash", "json"],
    paths: {
      languages: `${getShikiPath()}/languages/`,
    },
  });
};
