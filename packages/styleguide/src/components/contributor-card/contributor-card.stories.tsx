import { ContributorCard } from "./contributor-card";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ContributorCard> = {
  title: "Components/Contributor Card",
  component: ContributorCard,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContributorCard>;

export const Default: Story = {
  args: {
    name: "Patrick Arminio",
    avatarUrl: "https://avatars.githubusercontent.com/u/667029?v=4",
    url: "https://github.com/patrick91",
    title: "Core Team",
  },
};
