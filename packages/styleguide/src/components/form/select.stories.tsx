import { UserIcon } from "../icons/user";
import { Select } from "./select";
import type { Meta, StoryObj } from "@storybook/react";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2", disabled: true },
  { value: "3", label: "Option 3" },
];

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    placeholder: "Placeholder",
    options,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "Placeholder",
    value: "Val2ue",
    options,
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Placeholder",
    icon: <UserIcon />,
    options,
  },
};

export const WithSuccess: Story = {
  args: {
    placeholder: "Placeholder",
    success: "Success",
    options,
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Placeholder",
    error: "Error",
    options,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Placeholder",
    disabled: true,
    options,
  },
};

export const Required: Story = {
  args: {
    placeholder: "Placeholder",
    required: true,
    options,
  },
};
