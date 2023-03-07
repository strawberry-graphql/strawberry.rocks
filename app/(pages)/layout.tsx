import { Header, Footer } from "@strawberry-graphql/styleguide";
import "@strawberry-graphql/styleguide/dist/index.css";

import { fetchLatestRelease } from "~/lib/api";

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
