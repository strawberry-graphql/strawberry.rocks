import satori from "satori";
import { promises as fs } from "fs";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext } from "astro";
import { fetchAllPages } from "../../utils/fetch-all-pages";

import { getDocsCard } from "./docs-card";
import { getReleaseCard } from "./release-card";
import { fetchReleases } from "../../utils/fetch-releases";
import { getDefaultCard } from "./default-card";

const dimensions = {
  width: 1200,
  height: 630,
};

export async function GET(context: APIContext) {
  let { source, type, version } = context.props as {
    source: string;
    type: string;
    version: string;
  };

  let markup;

  if (type === "default") {
    markup = await getDefaultCard();
  } else if (type === "docs") {
    markup = await getDocsCard(source);
  } else {
    markup = await getReleaseCard(version);
  }

  const Satoshi = await fs.readFile("./public/fonts/Satoshi-Bold.otf");
  const Ranade = await fs.readFile("./public/fonts/Ranade-Bold.otf");
  const JetBrains = await fs.readFile(
    "./public/fonts/JetBrainsMono-Regular.ttf",
  );

  // @ts-ignore
  const svg = await satori(markup, {
    fonts: [
      {
        name: "Satoshi",
        data: Buffer.from(Satoshi),
        weight: 700,
      },
      {
        name: "Ranade",
        data: Buffer.from(Ranade),
        weight: 700,
      },
      {
        name: "JetBrains Mono",
        data: Buffer.from(JetBrains),
        weight: 400,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const image = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: dimensions.width,
    },
  }).render();

  return new Response(image.asPng(), {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const docsPages = (await fetchAllPages()).map((page) => {
    let path: string | undefined = page.replace("docs/", "");

    path = path.replace("README.md", "");
    path = path.replace(".md", "");

    if (path === "") {
      return {
        params: {
          route: `docs`,
        },
        props: {
          type: "default",
          source: page,
        },
      };
    }

    return {
      params: {
        route: `docs/` + path,
      },
      props: {
        type: "docs",
        source: page,
      },
    };
  });

  const releasePages = (await fetchReleases()).map((release) => {
    return {
      params: {
        route: `release/${release}`,
      },
      props: {
        type: "release",
        version: release,
      },
    };
  });

  const additionalPages = [
    "default",
    "acknowledgements",
    "code-of-conduct",
  ].map((page) => {
    return {
      params: {
        route: page,
      },
      props: {
        type: "default",
      },
    };
  });

  return [...releasePages, ...docsPages, ...additionalPages];
}
