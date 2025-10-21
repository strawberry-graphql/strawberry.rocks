import { getPageImage, strawberrySource, djangoSource } from "@/lib/source";
import { generate as DefaultImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await params;

  // Try to find the page in either source
  let page = strawberrySource.getPage(slug.slice(0, -1));
  if (!page) {
    page = djangoSource.getPage(slug.slice(0, -1));
  }
  if (!page) notFound();

  return new ImageResponse(
    (
      <DefaultImage
        title={page.data.title}
        description={page.data.description}
        site="My App"
      />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export function generateStaticParams() {
  const strawberryPages = strawberrySource.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));

  const djangoPages = djangoSource.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));

  return [...strawberryPages, ...djangoPages];
}
