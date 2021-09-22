import { NextPage } from "next";
import { useRouter } from "next/router";

import DocsNavigation from "~/components/docs-navigation";
import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { fetchTableOfContents } from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

import { FeedbackForm } from "./feedback-form";

type ExtensionSummary = {
  href: string;
  data: {
    title: string;
    summary?: string;
    tags?: string;
  },
};

export type ExtensionsPageProps = {
  extensions: ExtensionSummary[],
  docsToc?: ReturnedPromiseResolvedType<typeof fetchTableOfContents>;
  version?: string;
  versionHref?: string;
};

const ExtensionsPage: NextPage<ExtensionsPageProps> = ({
  docsToc,
  extensions,
  version,
  versionHref,
}) => {
  return (
    <>
      <SEO title="Extensions" />

      <Header version={version} versionHref={versionHref} />

      <main className="flex mx-auto w-full max-w-7xl flex-1 text-lg">
        {docsToc && <DocsNavigation docs={docsToc} />}
        <div className="px-8 pb-12 w-0 flex-1">
          {extensions.map(extension => (
            <div key={extension.data.title}>
              <h4>{extension.data.title}</h4>
              <p>{extension.data.summary}</p>
            </div>
          ))}
          <FeedbackForm />
        </div>
      </main>
    </>
  );
};

export default ExtensionsPage;
