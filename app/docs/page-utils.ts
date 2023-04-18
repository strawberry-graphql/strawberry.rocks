import matter from "gray-matter";
import path from "path";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";
import shiki from "shiki";

import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REPO, REF } from "~/lib/api";
import { FaqPlugin } from "~/rehype-plugins/faq-plugin";
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

  const { data: pageData, content: pageContent } = matter({ content: page });
  const items: TocItem[] = [];

  const rehypePlugins: any = [
    RehypeHighlightCode({ highlighter }),
    RehypeTOC({ items }),
  ];

  if (pageData.faq) {
    rehypePlugins.push(FaqPlugin);
  }

  const mdxOptions = {
    rehypePlugins,
    remarkPlugins: [
      remarkComment,
      remarkGfm,
      remarkMdxDisableExplicitJsx,
      fixImagePathsPlugin({
        path: filename,
        owner: OWNER,
        repo: REPO,
        ref: REF,
      }),
    ],
  };

  const { content } = await compileMDX<{ title: string }>({
    source: pageContent,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions,
    },
  });

  return { content, frontmatter: pageData, items };
};
