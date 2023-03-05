import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";

import { compileMDX } from "next-mdx-remote/rsc";

import { components } from "~/components/mdx";
import { fetchCodeOfConduct } from "~/lib/api";

import { Box, Spacer } from ".yalc/@strawberry-graphql/styleguide/dist";

export default async function CodeOfConductPage() {
  const response = await fetchCodeOfConduct();

  const body = response?.codeOfConduct?.body;

  const mdxOptions = {
    remarkPlugins: [remarkComment, remarkGfm],
  };

  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: body,
    components,
    options: {
      parseFrontmatter: true,
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
