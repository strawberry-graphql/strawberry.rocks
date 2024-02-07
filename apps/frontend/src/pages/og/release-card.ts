import { html } from "satori-html";
import { promises as fs } from "fs";

export const getReleaseCard = async (version: string) => {
  const path = process.cwd() + "/src/social-cards/version-background.png";

  const bgImage = await fs.readFile(path, {
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
        v${version}
      </div>
    </div>
  `;
};
