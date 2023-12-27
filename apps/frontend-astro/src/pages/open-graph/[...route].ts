import satori from "satori";
import { html } from "satori-html";
import { promises as fs } from "fs";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext } from "astro";
import { fetchAllPages } from "../../utils/fetch-all-pages";
import { fetchDocPage } from "../../utils/fetch-doc-page";
import matter from "gray-matter";

const dimensions = {
  width: 1200,
  height: 630,
};

export async function GET(context: APIContext) {
  let path: string = (
    context.props as {
      source: string;
    }
  ).source;

  const content = await fetchDocPage({ filename: path });
  const { data } = matter(content);

  const title = data.title;

  const bgImage = await fs.readFile("./src/social-card-background.png", {
    encoding: "base64",
  });
  const logo = await fs.readFile("./src/logo.png", { encoding: "base64" });

  const markup = html`<div tw="flex w-full h-full">
    <img
      src="data:image/png;base64,${bgImage}"
      tw="inset-0 absolute object-cover"
    />
    <div tw="flex flex-col w-full h-full p-[40px] pb-[60px]">
      <img src="data:image/png;base64,${logo}" tw="w-[150px] h-[170px]" />

      <div tw="flex flex-col items-start mt-auto font-bold">
        <h1 tw="text-[100px] text-white mb-[-15px] ml-[-5px]" style="font-family: Ranade">
          ${title}
        </h1>
        <h1 tw="text-[40px] text-white">Strawberry GraphQL</h1>
      </div>
    </div>
  </div>`;

  const Satoshi = await fs.readFile("./public/fonts/Satoshi-Bold.otf");
  const Ranade = await fs.readFile("./public/fonts/Ranade-Bold.otf");

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
  const allPages = await fetchAllPages();

  return allPages.map((page) => {
    let path: string | undefined = page.replace("docs/", "");

    path = path.replace("README.md", "");
    path = path.replace(".md", "");

    if (path === "") {
      path = undefined;
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
}
