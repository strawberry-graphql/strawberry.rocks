import matter from "gray-matter";

import { GetStaticPaths, GetStaticProps } from "next";

import ExtensionsPage, { ExtensionsPageProps } from "~/components/extensions";
import { createExtensionSearchString } from "~/helpers/extensions";
import { urlToSlugs } from "~/helpers/params";
import { extensionDataIsComplete } from "~/helpers/type-guards";
import { fetchExtensions, OWNER, REPO } from "~/lib/api";
import { getBlobText } from "~/lib/doc-tree";

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
  const tag = params?.tag;

  if (tag == null || Array.isArray(tag) || !tag.length) {
    /**
     * Redirect if no tag string.
     */
    return { redirect: { destination: "/docs", permanent: true } };
  }

  const owner = OWNER;
  const repo = REPO;

  try {
    /**
     * Get extensions
     */
    const { extensions, tableContent: docsToc } = await fetchExtensions({
      prefix: `/docs/tag/${tag}/`,
      owner,
      repo,
      ref: tag,
    });

    const extensionData = [];

    for (const extensionPage of extensions) {
      const text = getBlobText(extensionPage.object);
      if (text == null) {
        continue;
      }

      if (extensionPage.name.startsWith("_")) {
        continue;
      }

      const { data } = matter(text);

      if (!extensionDataIsComplete(data)) {
        continue;
      }

      extensionData.push({
        href: `/docs/tag/${tag}/extensions/${urlToSlugs(extensionPage.name)}`,
        searchString: createExtensionSearchString(data),
        data,
      });
    }

    return {
      props: {
        docsToc,
        extensions: extensionData,
        version: `${tag}`,
      },
      revalidate: false,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: false };
  }
};

export default ExtensionsPage;
