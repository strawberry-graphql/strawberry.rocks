import type { Metadata } from "next";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";

import { compileMDX } from "next-mdx-remote/rsc";

import { components } from "~/components/mdx";
import { fetchCodeOfConduct } from "~/lib/api/github";

import { Spacer, Box } from "@strawberry-graphql/styleguide";

export const metadata: Metadata = {
  title: "Code of Conduct",
};

export default async function CodeOfConductPage() {
  const response = await fetchCodeOfConduct();

  const body = response?.codeOfConduct?.body as string;

  const mdxOptions = {
    remarkPlugins: [remarkComment, remarkGfm],
  };

  const { content } = await compileMDX<{ title: string }>({
    source: body,
    components,
    options: {
      parseFrontmatter: true,
      // @ts-expect-error
      mdxOptions,
    },
  });

  return (
    <>
      <Spacer size={80} />

      <Box px={16} maxWidth="screen-lg">
        <div className="page-content">{content}</div>
      </Box>

      <Spacer size={80} />
    </>
  );
}
