import matter from "gray-matter";

import { GetStaticProps } from "next";

import ExtensionsPage, { ExtensionsPageProps } from "~/components/extensions";
import { createExtensionSearchString } from "~/helpers/extensions";
import { urlToSlugs } from "~/helpers/params";
import { extensionDataIsComplete } from "~/helpers/type-guards";
import {
  fetchExtensions,
  fetchLatestRelease,
  OWNER,
  REF,
  REPO,
} from "~/lib/api";

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
    if (!extensionPage || !extensionPage.object || !extensionPage.object.text) {
      continue;
    }

    if (extensionPage.name.startsWith("_")) {
      continue;
    }

    const { data } = matter(extensionPage.object.text);

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
    revalidate: 5 * 60,
  };
};

export default ExtensionsPage;
