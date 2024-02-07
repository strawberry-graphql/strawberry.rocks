import { Display } from "../typography/display";
import { Box } from "./box";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    children: <Display>Some text here</Display>,
  },
};
