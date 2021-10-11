/** @jsx jsx */
import { GetStaticPaths, GetStaticProps } from "next";

import DocsPage, { DocsPageProps } from "~/components/doc";
import { serializePage } from "~/helpers/mdx";
import {
  fetchDocPage,
  fetchLatestRelease,
  fetchTableOfContentsPaths,
  OWNER,
  REF,
  REPO,
} from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  const ref = REF;
  const paths = await fetchTableOfContentsPaths({ ref });

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  const slugs: string[] =
    params != null && Array.isArray(params.slug) && params.slug.length > 0
      ? params.slug
      : ["index"];

  /**
   * Get table of contents navigation data.
   */
  const ref = REF;
  const owner = OWNER;
  const repo = REPO;

  const version = await fetchLatestRelease();

  try {
    /**
     * Get doc content from markdown file.
     */
    const filename: string = slugs.join("/") + ".md";

    const { page, tableContent: docsToc } = await fetchDocPage({
      prefix: "/docs/",
      filename: `docs/${filename}`,
      owner,
      repo,
      ref,
    });

    const { source, data } = await serializePage({
      page,
      filename,
      ref,
      repo,
      owner,
    });

    const editPath = `https://github.com/${owner}/${repo}/edit/${REF}/docs/${filename}`;
    return {
      props: { source, data, editPath, docsToc, version },
      revalidate: 60,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: 60 };
  }
};

export default DocsPage;
