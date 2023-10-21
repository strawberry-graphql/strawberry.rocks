import { Header } from "./header";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    version: {
      name: "v1.0",
      href: "/",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Primary: Story = {
  args: {
    activeSection: "docs",
  },
};

export const ActiveBlog: Story = {
  args: {
    activeSection: "blog",
  },
};

export const PR: Story = {
  args: {
    version: {
      name: "PR 2400",
      href: "/",
    },
  },
};
