import { djangoSource } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs/django">) {
  return (
    <DocsLayout
      tree={djangoSource.pageTree}
      nav={{ enabled: false }}
      sidebar={{
        tabs: [
          {
            title: "Strawberry GraphQL",
            description: "Core Strawberry GraphQL documentation",
            url: "/docs",
            icon: <span>🍓</span>,
          },
          {
            title: "Strawberry Django",
            description: "Django integration for Strawberry GraphQL",
            url: "/docs/django",
            icon: <span>🦄</span>,
          },
        ],
        footer: null,
      }}
    >
      {children}
    </DocsLayout>
  );
}
