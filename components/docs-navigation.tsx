import { SidebarNav } from "@strawberry-graphql/styleguide";
import type { Section } from "@strawberry-graphql/styleguide/dist/components/sidebar-nav/sidebar-nav";

import { usePathname } from "next/navigation";

("use client");

export const DocsNavigation = ({ sections }: { sections: Section[] }) => {
  const pathname = usePathname();

  sections.forEach((section) => {
    section.links.forEach((link) => {
      link.active = pathname == link.href;
    });
  });

  return <SidebarNav sections={sections} />;
};
