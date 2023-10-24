import type { Metadata } from "next";

import { fetchLatestRelease } from "~/lib/api/github";

import { Footer, Header, Spacer } from "@strawberry-graphql/styleguide";

export const metadata: Metadata = {
  title: {
    template: "%s | API Reference | 🍓 Strawberry GraphQL",
    default: "API Reference | 🍓 Strawberry GraphQL",
  },
};

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug?: string[] };
}) {
  const version = await fetchLatestRelease();

  return (
    <>
      <Header version={version} activeSection="docs" />

      <Spacer size={80} />

      <div className="md:hidden">Left nav</div>

      <div className="max-w-[1600px] mx-auto">{children}</div>

      <Spacer size={80} />

      <Footer />
    </>
  );
}
