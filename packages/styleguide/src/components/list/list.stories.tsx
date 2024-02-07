import { List, ListItem } from "./list";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof List> = {
  title: "Components/List",
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  args: {
    children: (
      <>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </>
    ),
    variant: "unordered",
  },
};

export const Ordered: Story = {
  args: {
    children: (
      <>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </>
    ),
    variant: "ordered",
  },
};
