import { SearchBoxTrigger } from "./search-box-trigger";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SearchBoxTrigger> = {
  title: "Form/Searchbox trigger",
  component: SearchBoxTrigger,
};

export default meta;
type Story = StoryObj<typeof SearchBoxTrigger>;

export const Default: Story = {
  args: {},
};

export const TriggerOnly: Story = {
  args: {
    triggerOnly: true,
  },
};
