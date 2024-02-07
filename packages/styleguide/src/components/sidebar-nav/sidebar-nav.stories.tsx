import { SidebarNav } from "./sidebar-nav";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SidebarNav> = {
  title: "Components/Sidebar Navigation",
  component: SidebarNav,
};

export default meta;
type Story = StoryObj<typeof SidebarNav>;

const sections = [
  {
    name: "Docs",
    links: [
      {
        href: "/docs",
        name: "Getting started",
        active: true,
      },
    ],
  },
  {
    name: "General",
    links: [
      {
        href: "/abc",
        name: "Schema basics",
      },
      {
        href: "/abc",
        name: "Schema basics",
      },
      {
        href: "/abc",
        name: "Schema basics",
      },
      {
        href: "/abc",
        name: "Schema basics",
      },
    ],
  },
  {
    name: "A section without links",
    href: "/abc",
  },
  {
    name: "Another section without links",
    href: "/abc",
  },
  {
    name: "A section",
    links: [
      {
        href: "/abc",
        name: "Schema basics",
      },
    ],
  },
];

export const Default: Story = {
  args: { sections },
};
