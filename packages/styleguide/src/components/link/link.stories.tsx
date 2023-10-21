import { Link } from "./link";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: "The brown fox jumps over the lazy dog",
    href: "https://google.com",
  },
};

export const WithBreaks: Story = {
  args: {
    children: (
      <>
        The brown fox jumps over the
        <br /> lazy dog
      </>
    ),
    href: "https://google.com",
  },
};
