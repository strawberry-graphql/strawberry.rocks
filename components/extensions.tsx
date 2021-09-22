import { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import DocsNavigation from "~/components/docs-navigation";
import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { Link } from "~/components/link";
import { fetchTableOfContents } from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

import { FeedbackForm } from "./feedback-form";

type ExtensionSummary = {
  href: string;
  data: {
    title: string;
    summary: string;
    tags: string;
  },
};

export type ExtensionsPageProps = {
  extensions: ExtensionSummary[],
  docsToc?: ReturnedPromiseResolvedType<typeof fetchTableOfContents>;
  version?: string;
  versionHref?: string;
};


type SearchDocument = {
  index: string;
  extension: ExtensionSummary;
}

const ExtensionsPage: NextPage<ExtensionsPageProps> = ({
  docsToc,
  extensions,
  version,
  versionHref,
}) => {
  const searchIndex = useRef<SearchDocument[] | null>(null);

  const [searchState, setSearchState] = useState<{
    isReady: boolean;
    query: string;
    results: ExtensionSummary[];
  }>({
    isReady: false,
    query: "",
    results: extensions,
  });

  useEffect(() => {
    // Build a simple index which just generates a string with all the search
    // parameters
    searchIndex.current = extensions.map((extension) => ({
      index: [
        extension.data.title.toLowerCase(),
        extension.data.summary.toLowerCase(),
        extension.data.tags.toLowerCase().split(",").join(" "),
      ].join(" "),
      extension,
    }));

    setSearchState(state => ({
      ...state,
      isReady: true,
    }));
  }, []);

  function updateSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    let results: ExtensionSummary[] = [];
    // Perform search
    if (searchIndex.current && value.length > 0) {
      for (const searchDocument of searchIndex.current) {
        if (searchDocument.index.indexOf(value.toLowerCase()) > -1) {
          results.push(searchDocument.extension);
        }
      }
    } else {
      results = extensions;
    }

    setSearchState(state => ({
      ...state,
      query: value,
      results: results,
    }));
  }

  return (
    <>
      <SEO title="Extensions" />

      <Header version={version} versionHref={versionHref} />

      <main className="flex mx-auto w-full max-w-7xl flex-1 text-lg">
        {docsToc && <DocsNavigation docs={docsToc} />}
        <div className="px-8 pb-12 w-0 flex-1">
          <h1 className="font-medium my-8 text-3xl">Extensions</h1>

          <p className="mb-4">
            Extensions allow you, as an application developer, to customise the GraphQL execution flow based on your needs.
            Strawberry provides multiple built in extensions that allow you extend the capability of your GraphQL server.
          </p>

          <p className="mb-4">
            If you can't find what you need here you can also build your own
            custom extensions based on a standard interface.
            More details <Link href="/docs/guides/custom-extensions" className="text-red-500 text-lg">here</Link>.
          </p>

          {searchState.isReady ? (
            <input
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 border-gray-300 border-b"
              placeholder="Find an extension..."
              type="text"
              value={searchState.query}
              onChange={updateSearchQuery}
            />
          ) : null}

          <ul className="list-none">
            {searchState.results.map(extension => (
              <Link href="/docs/[[...slug]]" as={extension.href} className="border-b last:border-b-0 block mb-4 last:mb-0" key={extension.href}>
                <li key={extension.data.title} className="flex px-4 py-6 justify-between items-center">
                  <div>
                    <h4 className="font-mono font-medium text-xl mb-2">{extension.data.title}</h4>
                    <p className="text-sm mb-2">{extension.data.summary}</p>
                    {extension.data.tags ? (
                      <div className="">
                        {extension.data.tags.split(",").map(tag => (
                          <span className="bg-gray-100 rounded-md p-2 text-xs mr-2" key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <span className="font-4xl font-bold">&gt;</span>
                </li>
              </Link>
            ))}
          </ul>
          <FeedbackForm />
        </div>
      </main>
    </>
  );
};

export default ExtensionsPage;
