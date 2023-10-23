import matter from "gray-matter";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { ExtensionsList } from "~/components/extensions-list";
import { components } from "~/components/mdx";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { updateURLsPlugin } from "~/helpers/remark-update-urls";
import { fetchDocPage, OWNER, REPO, REF } from "~/lib/api/github";
import { getHighlighter } from "~/lib/shiki";
import { FaqPlugin } from "~/rehype-plugins/faq-plugin";
import { RehypeCodeNotes } from "~/rehype-plugins/rehype-code-notes";
import { RehypeHighlightCode } from "~/rehype-plugins/rehype-highlight-code";
import { RehypeMermaid } from "~/rehype-plugins/rehype-mermaid";
import { TocItem, RehypeTOC } from "~/rehype-plugins/rehype-toc";

import { getFetchDocsParams } from "./path-utils";

import { Spacer } from "@strawberry-graphql/styleguide";

export const parseDocument = async ({
  content: pageContent,
  additionalRehypePlugins = [],
  additionalRemarkPlugins = [],
  additionalComponents = {},
}: {
  content: string;
  additionalRehypePlugins?: any[];
  additionalRemarkPlugins?: any[];
  additionalComponents?: any;
}) => {
  const highlighter = await getHighlighter();

  const mdxOptions = {
    rehypePlugins: [
      RehypeMermaid(),
      RehypeHighlightCode({ highlighter }),
      RehypeCodeNotes(),
      ...additionalRehypePlugins,
    ],
    remarkPlugins: [
      remarkComment,
      remarkGfm,
      remarkMdxDisableExplicitJsx,
      ...additionalRemarkPlugins,
    ],
  };

  const { content } = await compileMDX<{ title: string }>({
    source: pageContent,
    components: {
      ...components,
      ...additionalComponents,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions,
    },
  });

  return content;
};

export const fetchAndParsePage = async (
  data: Awaited<ReturnType<typeof getFetchDocsParams>>
) => {
  const { filename, owner, repo, forceRemote, ref } = data;

  let page;

  try {
    page = (
      await fetchDocPage({
        prefix: "/docs/",
        filename: `docs/${filename}`,
        owner,
        repo,
        ref,
        forceRemote,
      })
    ).page;
  } catch (e) {
    console.error(e);

    throw notFound();
  }

  const { data: pageData, content: pageContent } = matter({ content: page });

  const items: TocItem[] = [];
  const additionalRehypePlugins: any[] = [RehypeTOC({ items })];

  if (pageData.faq) {
    additionalRehypePlugins.push(FaqPlugin);
  }

  const additionalRemarkPlugins: any[] = [
    updateURLsPlugin({ path: filename, owner: OWNER, repo: REPO, ref: REF }),
    fixImagePathsPlugin({
      path: filename,
      owner: OWNER,
      repo: REPO,
      ref: REF,
    }),
  ];

  const content = await parseDocument({
    content: pageContent,
    additionalRehypePlugins,
    additionalRemarkPlugins,
    additionalComponents: {
      ExtensionsList: () => {
        return (
          <>
            <Spacer size={12} />

            <ExtensionsList
              repoRef={ref}
              owner={owner}
              repo={repo}
              prefix={""}
            />
          </>
        );
      },
    },
  });

  const githubUrl = `https://github.com/${owner}/${repo}/edit/${REF}/docs/${filename}`;

  return { content, frontmatter: pageData, items, githubUrl };
};