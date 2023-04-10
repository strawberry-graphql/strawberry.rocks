import {
  GlowEffect,
  Hero,
  Spacer,
  FeaturesSection,
  SponsorsSection,
} from "@strawberry-graphql/styleguide";

import { fetchSponsorsForHomepage } from "~/lib/api";

const sponsors = [
  {
    name: "Python Software Foundation",
    href: "https://www.python.org/psf/",
    logo: "https://www.python.org/static/opengraph-icon-200x200.png",
  },
];

export default async function HomePage() {
  const sponsors = await fetchSponsorsForHomepage();

  return (
    <>
      <GlowEffect />
      <Spacer size={80} />

      <Hero />

      <Spacer size={128} />

      <FeaturesSection />

      <Spacer size={128} />

      <SponsorsSection sponsors={sponsors} />
    </>
  );
}
