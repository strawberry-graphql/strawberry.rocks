import { strawberryDocs, djangoDocs } from "@/.source";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// Strawberry docs - main docs at /docs
export const strawberrySource = loader({
  baseUrl: "/docs",
  source: strawberryDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Django docs - at /docs/django
export const djangoSource = loader({
  baseUrl: "/docs/django",
  source: djangoDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Legacy export for compatibility (will be removed)
export const source = strawberrySource;

export function getPageImage(
  page:
    | InferPageType<typeof strawberrySource>
    | InferPageType<typeof djangoSource>
) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(
  page:
    | InferPageType<typeof strawberrySource>
    | InferPageType<typeof djangoSource>
) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
