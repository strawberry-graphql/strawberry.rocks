import {
  DocsContent,
  PageTOC,
  FeedbackForm,
  Separator,
} from "@strawberry-graphql/styleguide";

import { NotSafeToPreview } from "~/components/not-safe-to-preview";
import { fetchExtensionsPaths, fetchTableOfContentsPaths } from "~/lib/api";

import { fetchAndParsePage } from "../page-utils";
import { getFetchDocsParams } from "../path-utils";

// revalidate every 10 minutes
export const revalidate = 600;

export async function generateStaticParams() {
  const ref = "main";
  const [pagePaths, extensionPaths] = await Promise.all([
    fetchTableOfContentsPaths({ ref }),
    fetchExtensionsPaths({ ref }),
  ]);
  const paths = pagePaths.concat(extensionPaths);

  return paths
    .map((path) => path.params)
    .filter((params) => params.slug.join("/") !== "index");
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}) {
  let data: Awaited<ReturnType<typeof getFetchDocsParams>>;

  try {
    data = await getFetchDocsParams(params);
  } catch (e: any) {
    if (e.message === "not safe to preview") {
      return {
        title: "🚫",
      };
    }

    throw e;
  }

  const { frontmatter } = await fetchAndParsePage(data);

  const title = frontmatter.title;

  return {
    title: `${title} | Docs | 🍓 Strawberry GraphQL`,
  };
}

export default async function DocsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  let data: Awaited<ReturnType<typeof getFetchDocsParams>>;

  try {
    data = await getFetchDocsParams(params);
  } catch (e: any) {
    if (e.message === "not safe to preview") {
      return (
        <DocsContent>
          <NotSafeToPreview />
        </DocsContent>
      );
    }

    throw e;
  }

  const { content, items, githubUrl } = await fetchAndParsePage(data);

  return (
    <>
      <DocsContent>
        {content}

        <Separator />

        <div className="md:flex">
          <div className="flex-1 mb-12 md:mb-0">
            <FeedbackForm />
          </div>

          <div className="ml-auto">
            {/* TODO: use component */}
            <a
              href={githubUrl}
              className="uppercase typography-label-1 font-bold hover:text-strawberry"
            >
              Edit this page on GitHub
            </a>
          </div>
        </div>
      </DocsContent>
      {/* TODO: support for nested? */}
      <PageTOC
        // @ts-ignore
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
      />
    </>
  );
}
