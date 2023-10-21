import type { Metadata } from "next";

import { fetchLatestRelease } from "~/lib/api";

import { Header, Footer } from "@strawberry-graphql/styleguide";
import "@strawberry-graphql/styleguide/dist/index.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 🍓 Strawberry GraphQL",
    default: "A Python library for GraphQL | 🍓 Strawberry GraphQL",
  },
};

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const version = await fetchLatestRelease();

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Header version={version} activeSection="blog" />

        {children}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
