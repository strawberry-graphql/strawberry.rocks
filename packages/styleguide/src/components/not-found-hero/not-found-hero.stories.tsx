import { NotFoundHero } from "./not-found-hero";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NotFoundHero> = {
  title: "Components/Not Found Hero",
  component: NotFoundHero,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundHero>;

export const Default: Story = {
  render: () => (
    <div className="bg-strawberry min-h-screen flex justify-center flex-col">
      <NotFoundHero />
    </div>
  ),
};
