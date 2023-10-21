import type { Metadata } from "next";

import { SearchBoxTrigger } from "~/components/searchbox-trigger";
import { fetchLatestRelease, fetchTableOfContents } from "~/lib/api";

import { getFetchDocsParams } from "../path-utils";

import {
  MobileNav,
  Spacer,
  DocsWrapper,
  Header,
  Footer,
} from "@strawberry-graphql/styleguide";

export const metadata: Metadata = {
  title: {
    template: "%s | Docs | 🍓 Strawberry GraphQL",
    default: "Documentation | 🍓 Strawberry GraphQL",
  },
};

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug?: string[] };
}) {
  const tableOfContents = await fetchTableOfContents({
    prefix: "/docs/",
  });

  if (tableOfContents === null) {
    throw new Error(
      "Something went wrong while fetching the table of contents"
    );
  }

  let pullNumber = null;

  try {
    pullNumber = (await getFetchDocsParams(params)).pullNumber;
  } catch (e) {
    console.error(e);
  }

  const sections = Object.entries(tableOfContents).map(([name, section]) => ({
    name,
    href: (section as any).href,
    links:
      (section as any).links?.map((link: any) => ({
        href: link.href,
        name: link.text,
      })) || undefined,
  }));

  const version = pullNumber
    ? {
        href: `https://github.com/strawberry-graphql/strawberry/pull/${pullNumber}`,
        name: `PR #${pullNumber}`,
      }
    : await fetchLatestRelease();

  return (
    <>
      <Header version={version} activeSection="docs" />

      <Spacer size={80} />

      <div className="md:hidden">
        <MobileNav sections={sections} />
      </div>

      <DocsWrapper sections={sections} searchBoxTrigger={<SearchBoxTrigger />}>
        {children}
      </DocsWrapper>

      <Spacer size={80} />

      <Footer />
    </>
  );
}
