import { UserIcon } from "../icons/user";
import { Input } from "./input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,

  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Placeholder",
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "Placeholder",
    value: "Value",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Placeholder",
    icon: <UserIcon />,
  },
};

export const WithSuccess: Story = {
  args: {
    placeholder: "Placeholder",
    success: "Success",
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Placeholder",
    error: "Error",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Placeholder",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: "Placeholder",
    required: true,
  },
};
