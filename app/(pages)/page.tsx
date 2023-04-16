import {
  GlowEffect,
  Hero,
  Spacer,
  FeaturesSection,
  SponsorsSection,
} from "@strawberry-graphql/styleguide";

import { fetchSponsorsForHomepage } from "~/lib/api";

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
