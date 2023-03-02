import {
  Footer,
  Header,
  MobileNav,
  SearchInput,
  SidebarNav,
  Spacer,
} from "@strawberry-graphql/styleguide";

import { fetchLatestRelease, fetchTableOfContents } from "~/lib/api";

const sections = [
  {
    name: "Docs",
    links: [
      {
        href: "/docs",
        name: "Getting started",
      },
    ],
  },
  {
    name: "General",
    links: [
      {
        href: "/abc",
        name: "Schema basics",
      },
      {
        href: "/abc2",
        name: "Schema basics",
      },
      {
        href: "/abc3",
        name: "Schema basics",
      },
      {
        href: "/abc4",
        name: "Schema basics",
      },
    ],
  },
];

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const version = await fetchLatestRelease();

  const tableOfContents = await fetchTableOfContents({
    prefix: "",
  });

  const sections = Object.entries(tableOfContents).map(([name, section]) => ({
    name,
    x: console.log(section),
    links:
      section.links?.map((link) => ({
        href: link.href,
        name: link.text,
      })) || [],
    // links: links.map((link) => ({
    //   href: link.href,
    //   name: link.name,
    // })),
  }));

  return (
    <>
      <Header
        version={{
          href: "/",
          name: version,
        }}
      />

      <Spacer size={80} />

      <div className="md:hidden">
        <MobileNav sections={sections} />
      </div>

      <div className="md:grid grid-cols-[320px_1fr]">
        <div className="w-[320px] hidden md:block px-40">
          <Spacer size={16} />
          <SearchInput placeholder="Search" />
          <Spacer size={40} />
          <SidebarNav sections={sections} />
        </div>

        <div className="max-w-[1600px] 2xl:mx-auto 2xl:relative 2xl:-left-[160px] 2lx:bg-pink md:grid grid-cols-[1fr_200px]">
          <div className="px-16 sm:px-40 space-y-8">{children}</div>

          {/* <PageNav /> */}
        </div>
      </div>

      <Spacer size={80} />

      <Footer />
    </>
  );
}
