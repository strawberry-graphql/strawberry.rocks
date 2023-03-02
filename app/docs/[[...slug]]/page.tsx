import matter from "gray-matter";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import shiki from "shiki";

import { MDXRemote } from "next-mdx-remote/rsc";

import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { fetchDocPage, OWNER, REF, REPO } from "~/lib/api";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";

export default async function DocsPage({
  params,
  ...rest
}: {
  params: { slug?: string[] };
}) {
  const slugs = params.slug || ["index"];
  const filename = slugs.join("/") + ".md";

  const { page, tableContent: docsToc } = await fetchDocPage({
    prefix: "/docs/",
    filename: `docs/${filename}`,
    owner: OWNER,
    repo: REPO,
    ref: REF,
  });

  const { data, content } = matter(page);

  const highlighter = await shiki.getHighlighter({
    theme: "css-variables",
  });

  return (
    // @ts-expect-error
    <MDXRemote
      source={content}
      components={components}
      options={{
        scope: {
          ab: 123,
        },
        mdxOptions: {
          rehypePlugins: [RehypeHighlightCode({ highlighter })],
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
        },
      }}
    />
  );
}
