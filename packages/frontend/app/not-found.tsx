import { fetchLatestRelease } from "~/lib/api";

import { Header, NotFoundHero } from "@strawberry-graphql/styleguide";

export default async function NotFound() {
  const version = await fetchLatestRelease();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <div>
        <Header version={version} />
      </div>

      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <NotFoundHero />
      </div>
    </div>
  );
}
