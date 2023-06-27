import { Header, Footer } from "@strawberry-graphql/styleguide";
import "@strawberry-graphql/styleguide/dist/index.css";
import type { Metadata } from "next";

import { fetchLatestRelease } from "~/lib/api";

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
    <>
      <Header version={version} />

      {children}

      <Footer />
    </>
  );
}
