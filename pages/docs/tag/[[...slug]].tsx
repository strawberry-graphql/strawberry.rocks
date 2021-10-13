/** @jsx jsx */
import { GetStaticPaths, GetStaticProps } from "next";

import DocsPage, { DocsPageProps } from "~/components/doc";
import { serializePage } from "~/helpers/mdx";
import { fetchDocPage, OWNER, REPO } from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * We want to render tag pages on demand and not at build time.
   * So paths is an empty array.
   */
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  const slug = params?.slug;

  if (slug == null || !Array.isArray(slug) || !slug.length) {
    /**
     * Redirect if no tag string.
     */
    return { redirect: { destination: "/docs", permanent: true } };
  }
  const slugs: string[] = slug.length > 1 ? slug : [...slug, "index"];

  const tag: string = slug[0];

  const owner = OWNER;
  const repo = REPO;

  try {
    /**
     * Shift slugs as we dont need the tag string for the filename.
     */
    const filename = slugs.shift() && slugs.join("/") + ".md";

    if (filename == null) {
      throw new Error("no filename");
    }

    const { page, tableContent: docsToc } = await fetchDocPage({
      prefix: `/docs/tag/${tag}/`,
      filename: `docs/${filename}`,
      owner,
      repo,
      ref: tag,
    });

    const { source, data } = await serializePage({
      page,
      filename,
      ref: tag,
      owner,
      repo,
    });

    return {
      props: {
        docsToc,
        source,
        data,
        version: `${tag}`,
      },
      revalidate: false,
    };
  } catch {
    return { notFound: true, revalidate: false };
  }
};

export default DocsPage;
