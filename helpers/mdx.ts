import matter from "gray-matter";

import { serialize } from "next-mdx-remote/serialize";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import { FaqPlugin } from "~/rehype-plugins/faq-plugin";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeTOC } from "~/rehype-plugins/rehype-toc";

import { fixImagePathsPlugin } from "./image-paths";

export const serializePage = async ({
  page,
  filename,
  owner,
  repo,
  ref,
}: {
  page: string;
  filename: string;
  ref?: string;
  owner?: string;
  repo?: string;
}) => {
  const { data, content } = matter(page);

  const plugins = [
    RehypeHighlightCode,
    RehypeTOC({ onlyLinks: !data.toc }),
    fixImagePathsPlugin({ path: filename, ref, owner, repo }),
  ];

  if (data.faq) {
    plugins.push(FaqPlugin);
  }

  const source = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [remarkComment, remarkGfm],
      rehypePlugins: plugins,
    },
  });

  return { source, data };
};
