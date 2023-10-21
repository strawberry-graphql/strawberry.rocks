import { SponsorsSection } from "./sponsors-section";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SponsorsSection> = {
  title: "Sections/Sponsors",
  component: SponsorsSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SponsorsSection>;

export const Default: Story = {
  args: {
    downloads: { lastMonth: 639284, lastWeek: 144952 },
    sponsors: [
      {
        name: "Moving Content AG",
        logo: "https://avatars.githubusercontent.com/u/1352964?v=4",
        href: "https://github.com/moving-content",
      },
      {
        id: "exoflare",
        name: "ExoFlare",
        logo: "https://avatars.githubusercontent.com/u/74335107?v=4",
        href: "https://www.exoflare.com/",
      },
      {
        name: "Wedgworth's, Inc",
        logo: "https://avatars.githubusercontent.com/u/120101163?v=4",
        href: "https://wedgworth.com/",
      },
      {
        name: "Cinder",
        logo: "https://images.opencollective.com/cinder/c477685/logo.png",
        href: "https://cinder.co",
      },
    ],
    logoOverrides: {
      exoflare: {
        darkMode: "/sponsor-overrides/exoflare-white.png",
        lightMode: "/sponsor-overrides/exoflare-black.png",
      },
    },
  },
};
