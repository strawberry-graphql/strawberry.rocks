import { NewsletterForm } from "./newsletter-form";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NewsletterForm> = {
  title: "Components/Newsletter Form",
  component: NewsletterForm,
};

export default meta;
type Story = StoryObj<typeof NewsletterForm>;

export const Default: Story = {};
