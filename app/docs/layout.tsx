import {
  Footer,
  Header,
  MobileNav,
  SearchInput,
  SidebarNav,
  DocsWrapper,
  Spacer,
} from "@strawberry-graphql/styleguide";

import { DocsNavigation } from "~/components/docs-navigation";
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

      <div className="md:grid grid-cols-[320px_1fr]">
        <div className="w-[320px] hidden md:block px-40">
          <Spacer size={16} />
          <SearchInput placeholder="Search" />
          <Spacer size={40} />
          <DocsNavigation sections={sections} />
        </div>

        <DocsWrapper>{children}</DocsWrapper>
      </div>

      <Spacer size={80} />
    </>
  );
}
