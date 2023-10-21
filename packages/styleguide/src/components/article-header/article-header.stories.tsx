import { ArticleHeader } from "./article-header";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ArticleHeader> = {
  title: "Components/Article Header",
  component: ArticleHeader,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticleHeader>;

export const Default: Story = {
  args: {
    title: "This is a title",
    duration: "5 min read",
    date: new Date(),
    author: {
      name: "John Doe",
      login: "johndoe",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  },
};
