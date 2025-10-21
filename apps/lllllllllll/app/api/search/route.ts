import { strawberrySource, djangoSource } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Combine both sources by merging their pages
const combinedSource = {
  ...strawberrySource,
  getPages: () => [...strawberrySource.getPages(), ...djangoSource.getPages()],
};

export const { GET } = createFromSource(combinedSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
