import { Modal } from "./modal";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    children: "Hello world",
    open: true,
  },
};

export const WithTitle: Story = {
  args: {
    children: "Hello world",
    open: true,
    title: "Hello world",
    label: "Example label",
  },
};
