import { html } from "satori-html";
import { promises as fs } from "fs";
import path from "path";

export const getReleaseCard = async (version: string) => {
  const bgPath = path.join(
    process.cwd(),
    "apps/frontend/social-cards/version-background.png",
  );

  const bgImage = await fs.readFile(bgPath, {
    encoding: "base64",
  });

  return html`
    <div tw="w-[1200px] h-[630px] relative flex">
      <img
        src="data:image/png;base64,${bgImage}"
        tw="inset-0 absolute object-cover"
      />

      <div
        tw="flex relative absolute bottom-[27px] right-[45px] text-[43px] font-mono text-white text-right z-10"
        style="font-family: 'JetBrains Mono'"
      >
        ${version ? `v${version}` : ""}
      </div>
    </div>
  `;
};
