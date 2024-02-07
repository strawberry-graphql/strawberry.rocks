import { ContributorsGrid } from "./contributors-grid";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ContributorsGrid> = {
  title: "Components/Contributors Grid",
  component: ContributorsGrid,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContributorsGrid>;

export const Default: Story = {
  args: {
    contributors: new Array(10).fill({
      name: "Patrick Arminio",
      avatarUrl: "https://avatars.githubusercontent.com/u/667029?v=4",
      url: "https://github.com/patrick91",
      title: "Core Team",
    }),
  },
};
