import { ArticleGrid } from "./article-grid";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ArticleGrid> = {
  title: "Components/Article Grid",
  component: ArticleGrid,
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof ArticleGrid>;

export const Default: Story = {
  args: {
    articles: new Array(10).fill({
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
    }),
  },
};
