import {
  MobileNav,
  Spacer,
  DocsWrapper,
  Header,
  Footer,
} from "@strawberry-graphql/styleguide";

import { fetchLatestRelease, fetchTableOfContents } from "~/lib/api";

import { getFetchDocsParams } from "../path-utils";

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
  const { pullNumber } = await getFetchDocsParams(params);

  const sections = Object.entries(tableOfContents).map(([name, section]) => ({
    name,
    links:
      (section as any).links?.map((link: any) => ({
        href: link.href,
        name: link.text,
      })) || [],
  }));

  const version = pullNumber
    ? {
        href: `https://github.com/strawberry-graphql/strawberry/pull/${pullNumber}`,
        name: `PR #${pullNumber}`,
      }
    : await fetchLatestRelease();

  return (
    <>
      <Header version={version} />

      <Spacer size={80} />

      <div className="md:hidden">
        <MobileNav sections={sections} />
      </div>

      <DocsWrapper sections={sections}>{children}</DocsWrapper>

      <Spacer size={80} />

      <Footer />
    </>
  );
}
