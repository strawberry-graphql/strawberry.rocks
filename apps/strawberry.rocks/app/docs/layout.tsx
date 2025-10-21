import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.pageTree}
      sidebar={{
        tabs: [
          {
            icon: "🍓 ",
            title: "Strawberry",
            url: "/docs",
          },
          {
            icon: "🦄 ",
            title: "Strawberry Django",
            url: "/docs/django",
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}
