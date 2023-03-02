import { GetStaticPaths, GetStaticProps } from "next";

import DocsPage, { DocsPageProps } from "~/components/doc";
import { serializePage } from "~/helpers/mdx";
import { fetchDocPage, fetchPullRequest } from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * We want to render PR pages on demand and not at build time.
   * So paths is an empty array.
   */
  return { paths: [], fallback: "blocking" };
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
  const slug = params?.slug;

  if (slug == null || !Array.isArray(slug) || !slug.length) {
    /**
     * Redirect if no pull request number.
     */
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

  const { branch, owner, repo, pull_number, html_url } = await fetchPullRequest(
    { pull_number: pullNumber }
  );

  /**
   * Shift slugs as we dont need the PR number for the filename.
   */
  const filename = slugs.shift() && `${slugs.join("/")}.md`;

  if (filename == null) {
    throw new Error("no filename");
  }

  const { page, tableContent: docsToc } = await fetchDocPage({
    prefix: `/docs/pr/${pull_number}/`,
    filename: `docs/${filename}`,
    owner,
    repo,
    ref: branch,
  });

  const { data, source } = await serializePage({
    page,
    ref: branch,
    owner,
    repo,
    filename,
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
};

export default DocsPage;
