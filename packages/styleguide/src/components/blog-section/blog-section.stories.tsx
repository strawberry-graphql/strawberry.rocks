import { BlogSection } from "./blog-section";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BlogSection> = {
  title: "Sections/Blog",
  component: BlogSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BlogSection>;

export const Default: Story = {};
