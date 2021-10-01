import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";
import remarkToc from "remark-toc";

import { serialize } from "next-mdx-remote/serialize";

import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";

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

  const source = await serialize(content, {
    scope: data,
    mdxOptions: {
      rehypePlugins: [RehypeHighlightCode],
      remarkPlugins: [
        fixImagePathsPlugin({ path: filename, ref }),
        anchorLinks,
        remarkToc,
      ],
    },
  });

  return { source, data };
};
