"use client";

import { SidebarNav } from "@strawberry-graphql/styleguide";

import { usePathname } from "next/navigation";

export const DocsNavigation = ({ sections }) => {
  const pathname = usePathname();

  sections.forEach((section) => {
    section.links.forEach((link) => {
      link.active = pathname == link.href;
    });
  });

  return <SidebarNav sections={sections} />;
};
