import { Logo } from "./logo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Primary: Story = {
  args: {},
};
