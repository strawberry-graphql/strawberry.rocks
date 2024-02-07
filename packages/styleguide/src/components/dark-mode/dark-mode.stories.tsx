import { DarkModeToggle } from "./dark-mode";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DarkModeToggle> = {
  title: "Components/DarkModeToggle",
  component: DarkModeToggle,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DarkModeToggle>;

export const Default: Story = {
  args: {},
};
