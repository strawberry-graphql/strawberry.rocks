import { GlowEffect } from "./glow-effect";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GlowEffect> = {
  title: "Components/Glow",
  component: GlowEffect,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GlowEffect>;

export const Default: Story = {
  render() {
    return (
      <div className="min-h-screen min-w-screen">
        <GlowEffect />
      </div>
    );
  },
};
