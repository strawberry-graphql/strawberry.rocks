import { NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import { useRouter } from "next/router";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { DUMMY_CONTENT } from "~/helpers/next-mdx-remote";
import { fetchTableOfContents } from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

export type DocsPageProps = {
  source?: MdxRemote.Source;
  data?: { [key: string]: any };
  editPath?: string;
  docsToc?: ReturnedPromiseResolvedType<typeof fetchTableOfContents>;
  version?: string;
  versionHref?: string;
};

const DocsPage: NextPage<DocsPageProps> = ({
  data,
  source,
  editPath,
  docsToc,
  version,
  versionHref,
}) => {
  /**
   * Need fallback DUMMY_CONTENT as this errors if source is undefined.
   * https://github.com/hashicorp/next-mdx-remote/issues/73#issuecomment-747085961
   */
  const content = hydrate(source ?? DUMMY_CONTENT, { components });

  const { isFallback } = useRouter();

  return (
    <>
      <SEO title={data?.title} />

      <Header version={version} versionHref={versionHref} />

      <main className="flex mx-auto w-full max-w-7xl flex-1 text-lg">
        {docsToc && <DocsNavigation docs={docsToc} />}
        <div className="px-8 pb-12 w-0 flex-1">
          {data?.experimental && <ExperimentalWarning />}

          {!isFallback && content}

          {editPath && <EditOnGithub path={editPath} />}
        </div>
      </main>
    </>
  );
};

export default DocsPage;
