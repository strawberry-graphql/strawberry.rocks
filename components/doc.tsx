import { useState } from "react";

import { NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { Header } from "~/components/header";
import components from "~/components/mdx";
import { SEO } from "~/components/seo";
import { fetchTableOfContents } from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

import { Note, NotesContext } from "./code-notes";
import { FeedbackForm } from "./feedback-form";

export type DocsPageProps = {
  source?: any;
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
  const { isFallback } = useRouter();
  const [note, setCurrentNote] = useState<Note | null>(null);

  return (
    <>
      <SEO title={data?.title} />

      <Header version={version} versionHref={versionHref} />

      <main className="flex mx-auto w-full max-w-7xl flex-1 text-lg">
        {docsToc && <DocsNavigation docs={docsToc} />}
        <div className="px-8 pb-12 w-0 flex-1" id="docs-content">
          {data?.experimental && <ExperimentalWarning />}

          <NotesContext.Provider
            value={{
              currentNote: note,
              setCurrentNote,
            }}
          >
            {!isFallback && <MDXRemote {...source} components={components} />}
          </NotesContext.Provider>

          <FeedbackForm />

          {editPath && <EditOnGithub path={editPath} />}
        </div>
      </main>
    </>
  );
};

export default DocsPage;
