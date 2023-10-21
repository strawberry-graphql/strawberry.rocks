import { Tag } from "./tag";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: "Tag",
  },
};
