import { ArticleCard } from "./article-card";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ArticleCard> = {
  title: "Components/Article Card",
  component: ArticleCard,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    title: "How to use Strawberry",
    excerpt: "A guide to using Strawberry",
    author: {
      name: "Patrick Arminio",
      login: "patrick91",
      avatar_url: "https://avatars.githubusercontent.com/u/10683440?v=4",
    },
    date: new Date(),
    href: "/",
    readingTime: "5 min read",
  },
};
