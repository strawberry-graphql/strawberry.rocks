import { ReleaseCard } from "./release-card";
import type { Meta, StoryObj } from "@storybook/react";
import satori from "satori";

const meta: Meta<typeof ReleaseCard> = {
  title: "Social Cards/Release",
  component: ReleaseCard,
};

export default meta;
type Story = StoryObj<typeof ReleaseCard>;

export const Default: Story = {
  args: {
    version: "1.0.0",
  },
};

export const Satori: Story = {
  render(_, context) {
    return <div dangerouslySetInnerHTML={{ __html: context.loaded.svg }}></div>;
  },
};

Satori.loaders = [
  async () => {
    const font = await fetch("/fonts/JetBrainsMono-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );

    const svg = await satori(<ReleaseCard version="1.0.0" />, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "JetBrains Mono",
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    });

    return {
      svg,
    };
  },
];
