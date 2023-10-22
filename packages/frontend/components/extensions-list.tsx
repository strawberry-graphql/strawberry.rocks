import matter from "gray-matter";

import { urlToSlugs } from "~/helpers/params";
import { extensionDataIsComplete } from "~/helpers/type-guards";
import { fetchExtensions } from "~/lib/api/github";
import { getBlobText } from "~/lib/doc-tree";

import { ExtensionsGrid } from "@strawberry-graphql/styleguide";

export const ExtensionsList = async ({
  prefix,
  owner,
  repo,
  repoRef,
}: {
  prefix: string;
  owner: string;
  repo: string;
  repoRef: string;
}) => {
  const { extensions } = await fetchExtensions({
    prefix,
    owner,
    repo,
    ref: repoRef,
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
      href: `docs/extensions/${urlToSlugs(extensionPage.name)}`,
      data,
    });
  }

  const formattedExtensions = extensionData.map((extension) => {
    const { href, data } = extension;

    return {
      name: data.title,
      description: data.summary,
      tags: data.tags.split(","),
      href,
    };
  });

  return <ExtensionsGrid extensions={formattedExtensions} />;
};
