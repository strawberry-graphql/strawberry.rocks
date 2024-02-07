import { FeaturesSection } from "./features-section";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FeaturesSection> = {
  title: "Sections/Features",
  component: FeaturesSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FeaturesSection>;

export const Default: Story = {
  args: {
    features: [
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
    ],
  },
};
