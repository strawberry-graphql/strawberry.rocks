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
  fetchLatestRelease,
  OWNER,
  REPO,
  REF,
} from "~/lib/api";
import { getDocTree } from "~/lib/doc-tree";
import { extensionDataIsComplete } from "~/helpers/type-guards";
import { createExtensionSearchString } from "~/helpers/extensions";

export const getStaticProps: GetStaticProps<ExtensionsPageProps> = async ({
  params,
}) => {
  /**
   * Get table of contents navigation data.
   */
  const ref = REF;
  const owner = OWNER;
  const repo = REPO;

  const version = await fetchLatestRelease();

  try {
    /**
     * Get extensions
     */
    const { extensions, tableContent: docsToc } = await fetchExtensions({
      prefix: `/docs/`,
      owner,
      repo,
      ref,
    });

    const extensionData = [];

    for (const extensionPage of extensions) {
      if (
        !extensionPage ||
        !extensionPage.object ||
        !extensionPage.object.text
      ) {
        continue;
      }

      if (extensionPage.name.startsWith("_")) {
        continue;
      }

      const { data, content } = matter(extensionPage.object.text);

      if (!extensionDataIsComplete(data)) {
        continue;
      }

      extensionData.push({
        href: `extensions/${urlToSlugs(extensionPage.name)}`,
        searchString: createExtensionSearchString(data),
        data,
      });
    }

    return {
      props: {
        docsToc,
        extensions: extensionData,
        version,
      },
      revalidate: 60,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: 60 };
  }
};

export default ExtensionsPage;
