import { SearchBox } from "./search-box";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SearchBox> = {
  title: "Components/Search box",
  component: SearchBox,
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {
  args: {
    onActiveOptionChange: (url) => {
      console.log("active option changed", url);
    },

    onChange: (url) => {
      console.log("changed", url);
    },
  },
};
