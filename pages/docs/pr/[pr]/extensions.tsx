/** @jsx jsx */
import path from "path";
import fs from "fs";
import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";

import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";

import ExtensionsPage, { ExtensionsPageProps } from "~/components/extensions";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { urlToSlugs } from "~/helpers/params";
import {
  fetchExtensions,
  fetchPullRequest,
  OWNER,
  REPO,
} from "~/lib/api";
import { getDocTree } from "~/lib/doc-tree";
import { extensionDataIsComplete } from "~/helpers/type-guards";
import { createExtensionSearchString } from "~/helpers/extensions";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * We want to render tag pages on demand and not at build time.
   * So paths is an empty array.
   */
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ExtensionsPageProps> = async ({
  params,
}) => {
  const pr = params?.pr;

  if (pr == null || Array.isArray(pr) || !pr.length) {
    /**
     * Redirect if no tag string.
     */
    return { redirect: { destination: "/docs", permanent: true } };
  }

  const pullNumber = parseInt(pr, 10);
  if (isNaN(pullNumber)) {
    /**
     * 404 if provided pull request number is not valid. Saves a query.
     */
    return { notFound: true };
  }

  try {
    const { branch, owner, repo, pull_number, html_url } =
      await fetchPullRequest({ pull_number: pullNumber });

    /**
     * Get extensions
     */
    const { extensions, tableContent: docsToc } = await fetchExtensions({
      prefix: `/docs/pr/${pull_number}/`,
      owner,
      repo,
      ref: branch,
    });

    const extensionData = []

    for (const extensionPage of extensions) {
      if (extensionPage.name.startsWith("_")) {
        continue;
      }

      const { data, content } = matter(extensionPage.object.text);

      if (!extensionDataIsComplete(data)) {
        continue;
      }

      extensionData.push({
        href: `/docs/pr/${pull_number}/extensions/${urlToSlugs(extensionPage.name)}`,
        searchString: createExtensionSearchString(data),
        data,
      });
    }

    return {
      props: {
        docsToc,
        extensions: extensionData,
        version: `PR ${pull_number}`,
        versionHref: html_url,
      },
      revalidate: 5,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: 5 };
  }
};

export default ExtensionsPage;
