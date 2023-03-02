import { DocsContent, PageTOC } from "@strawberry-graphql/styleguide";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import shiki from "shiki";

import { compileMDX } from "next-mdx-remote/rsc";

import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REF, REPO } from "~/lib/api";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeTOC, TocItem } from "~/rehype-plugins/rehype-toc";

export default async function DocsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slugs = params.slug || ["index"];
  const filename = slugs.join("/") + ".md";

  const { page } = await fetchDocPage({
    prefix: "/docs/",
    filename: `docs/${filename}`,
    owner: OWNER,
    repo: REPO,
    ref: REF,
  });

  const highlighter = await shiki.getHighlighter({
    theme: "css-variables",
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

  const { content, frontmatter, ...rest } = await compileMDX<{ title: string }>(
    {
      source: page,
      components,
      options: {
        parseFrontmatter: true,
        mdxOptions,
      },
    }
  );

  return (
    <>
      <DocsContent>{content}</DocsContent>
      {/* TODO: support for nested? */}
      <PageTOC
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
      />
    </>
  );
}
