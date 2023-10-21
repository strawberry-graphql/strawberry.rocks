import { ExtensionsGrid } from "./extensions-grid";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ExtensionsGrid> = {
  title: "Components/Extensions Grid",
  component: ExtensionsGrid,
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof ExtensionsGrid>;

export const Default: Story = {
  args: {
    extensions: new Array(10).fill({
      name: "An extension",
      href: "#",
      description: "This is an extension that does something cool and useful.",
      tags: ["tag1", "tag2", "tag3"],
    }),
  },
};
