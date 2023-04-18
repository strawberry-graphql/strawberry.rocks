import {
  GlowEffect,
  Hero,
  Spacer,
  FeaturesSection,
  SponsorsSection,
} from "@strawberry-graphql/styleguide";

import { fetchSponsorsForHomepage } from "~/lib/api";
import { fetchDownloads } from "~/lib/api/pypi";

export const metadata = {
  description:
    "Strawberry GraphQL is a powerful and modern GraphQL framework for Python that allows developers to easily create robust and scalable APIs. With its intuitive and developer-friendly API, Strawberry makes it easy to define and query GraphQL schemas, while also providing advanced features such as type safety, code generation, and more.",
};

export default async function HomePage() {
  const sponsors = await fetchSponsorsForHomepage();
  const downloads = await fetchDownloads();

  return (
    <>
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
    </>
  );
}
