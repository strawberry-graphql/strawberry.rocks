import { html } from "satori-html";
import { promises as fs } from "fs";
import path from "path";

export const getDefaultCard = async () => {
  const bgPath = path.join(
    process.cwd(),
    "social-cards/version-background.png",
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
    </div>
  `;
};
