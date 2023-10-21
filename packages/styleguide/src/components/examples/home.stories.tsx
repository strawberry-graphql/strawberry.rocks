import { FeaturesSection } from "../features-section/features-section";
import { Footer } from "../footer/footer";
import { GlowEffect } from "../glow-effect/glow-effect";
import { Header } from "../header/header";
import { Hero } from "../hero/hero";
import { Spacer } from "../spacer/spacer";
import { SponsorsSection } from "../sponsors-section/sponsors-section";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Examples/Home",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

const sponsors = [
  {
    name: "Moving Content AG",
    logo: "https://avatars.githubusercontent.com/u/1352964?v=4",
    href: "https://github.com/moving-content",
  },
  {
    id: "exoflare",
    name: "ExoFlare",
    logo: "https://avatars.githubusercontent.com/u/74335107?v=4",
    href: "https://www.exoflare.com/",
  },
  {
    name: "Wedgworth's, Inc",
    logo: "https://avatars.githubusercontent.com/u/120101163?v=4",
    href: "https://wedgworth.com/",
  },
  {
    name: "Cinder",
    logo: "https://images.opencollective.com/cinder/c477685/logo.png",
    href: "https://cinder.co",
  },
];

const version = {
  name: "v1.0",
  href: "/",
};
const downloads = { lastMonth: 639284, lastWeek: 144952 };

export const Default: Story = {
  render: () => (
    <>
      <Header version={version} />

      <GlowEffect />
      <Spacer size={80} />

      <Hero />

      <Spacer size={128} />

      <FeaturesSection
        features={[
          {
            title: "Type hints",
            description:
              "Strawberry leverages Python type hints to provide a great developer experience while creating GraphQL Libraries.",
            icon: "edit",
          },
          {
            title: "Async Support",
            description:
              "Strawberry supports async/await out of the box, allowing you to write your resolvers in a non-blocking way.",
            icon: "zap",
          },
          {
            title: "Extensible",
            description:
              "Strawberry has support for schema and field extensions, allowing you to extend the schema with custom logic.",
            icon: "move",
          },
          {
            title: "Community",
            description:
              "Strawberry is backed by a great community, with a lot of people willing to help you out.",
            icon: "heart",
          },
          {
            title: "Generics",
            description:
              "Strawberry supports generics, allowing you to create reusable types that can be used in multiple places.",
            icon: "layers",
          },
          {
            title: "Apollo Federation",
            description:
              "Strawberry supports Apollo Federation, allowing you to create a federated GraphQL schema.",
            icon: "link",
          },
          {
            title: "Dataloaders",
            description:
              "Strawberry comes with support for dataloaders, allowing you to batch multiple queries into a single one.",
            icon: "loader",
          },
          {
            title: "Integrations",
            description:
              "Strawberry has support for multiple integrations, allowing you to use it with your favorite web framework.",
            icon: "radio",
          },
        ]}
      />

      <Spacer size={128} />

      <SponsorsSection
        sponsors={sponsors}
        downloads={downloads}
        logoOverrides={{
          xoflare: {
            darkMode: "/images/sponsor-overrides/exoflare-white.png",
            lightMode: "/images/sponsor-overrides/exoflare-black.png",
          },
          "moving-content": {
            darkMode: "/images/sponsor-overrides/moving-content.png",
            lightMode: "/images/sponsor-overrides/moving-content.png",
          },
          cinder: {
            darkMode: "/images/sponsor-overrides/cinder-white.png",
            lightMode: "/images/sponsor-overrides/cinder-black.png",
          },
        }}
      />

      <Spacer size={128} />

      <Footer />
    </>
  ),
};
