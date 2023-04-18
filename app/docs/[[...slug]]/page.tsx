import {
  DocsContent,
  PageTOC,
  FeedbackForm,
  Spacer,
  Separator,
} from "@strawberry-graphql/styleguide";

import { NotSafeToPreview } from "~/components/not-safe-to-preview";

import { fetchAndParsePage } from "../page-utils";
import { getFetchDocsParams } from "../path-utils";

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

  const { content, items } = await fetchAndParsePage(data);

  return (
    <>
      <DocsContent>
        {content}

        <Separator />

        <FeedbackForm />
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
