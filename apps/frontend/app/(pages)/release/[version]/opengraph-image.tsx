import { ImageResponse } from "next/og";

import { ReleaseCard } from "@strawberry-graphql/styleguide";

export const runtime = "edge";

export const alt = "Strawberry GraphQL";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: {
    version: string;
  };
}) {
  // TODO: Fonts are duplicate
  const font = await fetch(
    new URL("../../../../fonts/JetBrainsMono-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(<ReleaseCard version={params.version} />, {
    ...size,
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
}
