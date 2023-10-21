import { Callout } from "./callout";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Note: Story = {
  args: {
    type: "note",
    children:
      "Lorem ipsum dolor sit amet consectetur. Sit sagittis pellentesque nibh ipsum ut. Et orci fames eget sit lectus ultrices elit molestie purus. Libero dictum ipsum arcu egestas cursus sit faucibus. At mauris at scelerisque sit. Odio aliquam eget.",
  },
};

export const Tip: Story = {
  args: {
    type: "tip",
    children:
      "Lorem ipsum dolor sit amet consectetur. Sit sagittis pellentesque nibh ipsum ut. Et orci fames eget sit lectus ultrices elit molestie purus. Libero dictum ipsum arcu egestas cursus sit faucibus. At mauris at scelerisque sit. Odio aliquam eget.",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    children:
      "Lorem ipsum dolor sit amet consectetur. Sit sagittis pellentesque nibh ipsum ut. Et orci fames eget sit lectus ultrices elit molestie purus. Libero dictum ipsum arcu egestas cursus sit faucibus. At mauris at scelerisque sit. Odio aliquam eget.",
  },
};
