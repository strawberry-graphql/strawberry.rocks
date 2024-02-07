import { ExtensionCard } from "./extension-card";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ExtensionCard> = {
  title: "Components/Extension Card",
  component: ExtensionCard,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExtensionCard>;

export const Default: Story = {
  args: {
    name: "An extension",
    href: "#",
    description: "This is an extension that does something cool and useful.",
    tags: ["tag1", "tag2", "tag3"],
  },
};
