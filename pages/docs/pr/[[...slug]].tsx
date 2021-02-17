/** @jsx jsx */
import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";

import { GetStaticPaths, GetStaticProps } from "next";
import renderToString from "next-mdx-remote/render-to-string";

import DocsPage, { DocsPageProps } from "~/components/doc";
import components from "~/components/theme-ui";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { provider } from "~/helpers/next-mdx-remote";
import { fetchFile, fetchPullRequest, fetchTableOfContents } from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * We want to render PR pages on demand and not at build time.
   * So paths is an empty array.
   */
  return { paths: [], fallback: true };
};

const getPullRequestNumber = (slug: string[]): number | null => {
  if (slug.length) {
    const pr = parseInt(slug[0], 10);
    return !isNaN(pr) ? pr : null;
  }
  return null;
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  const { slug } = params;

  if (slug == null || !Array.isArray(slug) || !slug.length) {
    /**
     * Redirect if no pull request number.
     */
    // TODO: Could show message to users to submit a pull request instead?
    return { redirect: { destination: "/docs", permanent: true } };
  }
  const slugs: string[] = slug.length > 1 ? slug : [...slug, "index"];

  const pullNumber = getPullRequestNumber(slugs);

  if (pullNumber == null) {
    /**
     * 404 if provided pull request number is not valid. Saves a query.
     */
    return { notFound: true };
  }
  try {
    const {
      branch,
      owner,
      repo,
      pull_number,
      html_url,
    } = await fetchPullRequest({ pull_number: pullNumber });

    const docsToc = await fetchTableOfContents({
      prefix: `/docs/pr/${pull_number}/`,
      ref: branch,
      owner,
      repo,
    });

    /**
     * Shift slugs as we dont need the PR number for the filename.
     */
    const filename: string = slugs.shift() && slugs.join("/") + ".md";

    const text = await fetchFile({
      filename: `docs/${filename}`,
      owner,
      repo,
      ref: branch,
    });

    const { data, content } = matter(text);
    const source = await renderToString(content, {
      components,
      scope: data,
      provider,
      mdxOptions: {
        remarkPlugins: [
          fixImagePathsPlugin(filename, branch, owner, repo),
          anchorLinks,
        ],
      },
    });

    const editPath = `https://github.com/${owner}/${repo}/edit/${branch}/docs/${filename}`;

    return {
      props: {
        docsToc,
        source,
        data,
        editPath,
        version: `PR ${pull_number}`,
        versionHref: html_url,
      },
      revalidate: 5,
    };
  } catch {
    return { notFound: true, revalidate: 5 };
  }
};

export default DocsPage;
