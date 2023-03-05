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
        <div className="mx-auto w-full max-w-7xl p-8 pb-12">{content}</div>
      </Box>
    </>
  );
}

// export const getStaticProps: GetStaticProps<Props> = async () => {
//   try {

//     if (body == null) {
//       throw Error("no code of conduct body to show");
//     }
//     const { content } = matter(body);

//     const source = await serialize(content, {
//       mdxOptions: {
//         remarkPlugins: [
//           RehypeTOC({ onlyLinks: true }),
//           remarkComment,
//           remarkGfm,
//         ],
//       },
//     });

//     return {
//       props: {
//         source,
//         version,
//       },
//       revalidate: 60 * 60,
//     };
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error("code-of-conduct", error);
//     return { notFound: true };
//   }
// };

// export default CodeOfConductPage;
