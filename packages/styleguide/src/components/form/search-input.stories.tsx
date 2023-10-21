import { SearchInput } from "./search-input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SearchInput> = {
  title: "Form/Search Input",
  component: SearchInput,

  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: "Placeholder",
  },
};
