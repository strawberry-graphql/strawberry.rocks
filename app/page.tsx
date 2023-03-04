import {
  Header,
  GlowEffect,
  Hero,
  Spacer,
  FeaturesSection,
  SponsorsSection,
  Footer,
} from "@strawberry-graphql/styleguide";

const sponsors = [
  {
    name: "Python Software Foundation",
    href: "https://www.python.org/psf/",
    logo: "https://www.python.org/static/opengraph-icon-200x200.png",
  },
];

export default async function HomePage() {
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
