import path from "path";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import shiki from "shiki";

import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REPO, REF } from "~/lib/api";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { TocItem, RehypeTOC } from "~/rehype-plugins/rehype-toc";

import { getFetchDocsParams } from "./path-utils";

export const fetchAndParsePage = async (
  data: Awaited<ReturnType<typeof getFetchDocsParams>>
) => {
  const { filename, owner, repo, forceRemote, ref } = data;

  let page;

  try {
    page = (
      await fetchDocPage({
        prefix: "/docs/",
        filename: `docs/${filename}`,
        owner,
        repo,
        ref,
        forceRemote,
      })
    ).page;
  } catch (e) {
    console.error(e);

    throw notFound();
  }

  const themePath = path.join(process.cwd(), "shiki-theme.json");

  const theme = await shiki.loadTheme(themePath);

  const highlighter = await shiki.getHighlighter({
    theme,
  });

  const items: TocItem[] = [];

  const mdxOptions = {
    rehypePlugins: [RehypeHighlightCode({ highlighter }), RehypeTOC({ items })],
    remarkPlugins: [
      remarkComment,
      remarkGfm,
      fixImagePathsPlugin({
        path: filename,
        owner: OWNER,
        repo: REPO,
        ref: REF,
      }),
    ],
  };

  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: page,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions,
    },
  });

  return { content, frontmatter, items };
};
