import { MobileNav, Spacer, DocsWrapper } from "@strawberry-graphql/styleguide";

import { fetchTableOfContents } from "~/lib/api";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tableOfContents = await fetchTableOfContents({
    prefix: "/docs/",
  });

  const sections = Object.entries(tableOfContents).map(([name, section]) => ({
    name,
    links:
      section.links?.map((link) => ({
        href: link.href,
        name: link.text,
      })) || [],
  }));

  return (
    <>
      <Spacer size={80} />

      <div className="md:hidden">
        <MobileNav sections={sections} />
      </div>

      <DocsWrapper sections={sections}>{children}</DocsWrapper>

      <Spacer size={80} />
    </>
  );
}
