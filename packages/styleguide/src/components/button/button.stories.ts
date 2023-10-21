import { Button } from "./button";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    // @ts-ignore
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};

export const ButtonLink: Story = {
  args: {
    children: "Button",
    href: "https://www.google.com",
    as: "a",
  },
};
