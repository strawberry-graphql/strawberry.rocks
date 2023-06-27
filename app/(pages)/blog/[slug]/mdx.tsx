import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

import { compileMDX } from "next-mdx-remote/rsc";

import { components } from "~/components/mdx";
import { getHighlighter } from "~/lib/shiki";
import { RehypeCodeNotes } from "~/rehype-plugins/rehype-code-notes";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeMermaid } from "~/rehype-plugins/rehype-mermaid";

export const compile = async ({ source }: { source: string }) => {
  const highlighter = await getHighlighter();

  const rehypePlugins: any = [
    RehypeMermaid(),
    RehypeHighlightCode({ highlighter }),
    RehypeCodeNotes(),
  ];

  const mdxOptions = {
    rehypePlugins,
    remarkPlugins: [remarkComment, remarkGfm, remarkMdxDisableExplicitJsx],
  };

  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions,
    },
  });

  return content;
};
