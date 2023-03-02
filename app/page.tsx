import {
  Header,
  GlowEffect,
  Hero,
  Spacer,
  FeaturesSection,
  SponsorsSection,
  Footer,
} from "@strawberry-graphql/styleguide";

import { fetchLatestRelease } from "~/lib/api";

const sponsors = [
  {
    name: "Python Software Foundation",
    href: "https://www.python.org/psf/",
    logo: "https://www.python.org/static/opengraph-icon-200x200.png",
  },
];

export default async function HomePage() {
  const version = await fetchLatestRelease();

  return (
    <>
      <GlowEffect />
      <Header
        version={{
          href: "/",
          name: version,
        }}
      />

      <Spacer size={80} />

      <Hero />

      <Spacer size={128} />

      <FeaturesSection />

      <Spacer size={128} />

      <SponsorsSection sponsors={sponsors} />

      <Footer />
    </>
  );
}
