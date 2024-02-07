"use client";

import mermaid from "mermaid";
import { useEffect, useId, useRef, useState } from "react";

export const Mermaid = ({ code }: { code: string }) => {
  const id = useId().replace(/:/g, "_");

  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      theme: "base",
    });

    mermaid
      .render(CSS.escape(id), code)
      .then(({ svg }) => {
        // get contents of style tag
        const style = svg.match(/<style>.*<\/style>/)?.[0];
        // remove style tag from style
        const styleWithoutTag = style?.replace(/<style>|<\/style>/g, "");
        // replace id with `.mermaid > svg`
        const newStyle = styleWithoutTag?.replace(
          new RegExp(`#${CSS.escape(id)}`, "g"),
          ".mermaid > svg"
        );

        console.log(newStyle);

        // remove style tag from svg via regex
        svg = svg.replace(/<style>.*<\/style>/, "");

        setSvg(svg);
      })

      .catch(console.error);
  }, [id, code]);

  return svg ? (
    <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />
  ) : null;
};
