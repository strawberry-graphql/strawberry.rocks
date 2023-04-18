import { DocsContent, PageTOC } from "@strawberry-graphql/styleguide";
import path from "path";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import shiki from "shiki";

import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { components } from "~/components/mdx";
import { NotSafeToPreview } from "~/components/not-safe-to-preview";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REF, REPO } from "~/lib/api";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeTOC, TocItem } from "~/rehype-plugins/rehype-toc";

import { getFetchDocsParams } from "../path-utils";

export default async function DocsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  let data: Awaited<ReturnType<typeof getFetchDocsParams>>;

  try {
    data = await getFetchDocsParams(params);
  } catch (e: any) {
    if (e.message === "not safe to preview") {
      return (
        <DocsContent>
          <NotSafeToPreview />
        </DocsContent>
      );
    }

    throw e;
  }

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

  const { content } = await compileMDX<{ title: string }>({
    source: page,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions,
    },
  });

  return (
    <>
      <DocsContent>{content}</DocsContent>
      {/* TODO: support for nested? */}
      <PageTOC
        // @ts-ignore
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
      />
    </>
  );
}
