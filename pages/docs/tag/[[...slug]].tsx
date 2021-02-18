/** @jsx jsx */
import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";

import { GetStaticPaths, GetStaticProps } from "next";
import renderToString from "next-mdx-remote/render-to-string";

import DocsPage, { DocsPageProps } from "~/components/doc";
import components from "~/components/theme-ui";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { provider } from "~/helpers/next-mdx-remote";
import { fetchFile, fetchTableOfContents, OWNER, REPO } from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * We want to render tag pages on demand and not at build time.
   * So paths is an empty array.
   */
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  const { slug } = params;

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
    const docsToc = await fetchTableOfContents({
      prefix: `/docs/tag/${tag}/`,
      ref: tag,
      owner,
      repo,
    });

    /**
     * Shift slugs as we dont need the tag string for the filename.
     */
    const filename: string = slugs.shift() && slugs.join("/") + ".md";

    const text = await fetchFile({
      filename: `docs/${filename}`,
      owner,
      repo,
      ref: tag,
    });

    const { data, content } = matter(text);
    const source = await renderToString(content, {
      components,
      scope: data,
      provider,
      mdxOptions: {
        remarkPlugins: [
          fixImagePathsPlugin({ path: filename, ref: tag, owner, repo }),
          anchorLinks,
        ],
      },
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
