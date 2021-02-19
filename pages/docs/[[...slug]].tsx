/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { anchorLinks } from "@hashicorp/remark-plugins";
import { Flex, Box } from "@theme-ui/components";
import matter from "gray-matter";
import { jsx, ThemeProvider } from "theme-ui";

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { Header } from "~/components/header";
import { SEO } from "~/components/seo";
import components from "~/components/theme-ui";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { DUMMY_CONTENT } from "~/helpers/next-mdx-remote";
import {
  fetchFile,
  fetchLatestRelease,
  fetchTableOfContents,
  fetchTableOfContentsPaths,
  OWNER,
  REF,
  REPO,
} from "~/lib/api";
import { ReturnedPromiseResolvedType } from "~/types/utility";

import theme from "../../theme";

type Props = {
  source?: MdxRemote.Source;
  data?: { [key: string]: any };
  editPath: string;
  docsToc: ReturnedPromiseResolvedType<typeof fetchTableOfContents>;
  version: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Get repo to query against.
   * REF / BRANCH
   * OWNER
   * REPO
   */
  // TODO write util function to get REF, OWNER, REPO
  const ref = (await fetchLatestRelease()) ?? REF;
  const paths = await fetchTableOfContentsPaths(ref);

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug: string[] =
    params != null && Array.isArray(params.slug) && params.slug.length > 0
      ? params.slug
      : ["index"];

  /**
   * Get repo to query against.
   * REF / BRANCH
   * OWNER
   * REPO
   */
  // TODO write util function to get REF, OWNER, REPO

  /**
   * Get table of contents navigation data.
   */
  const ref = (await fetchLatestRelease()) ?? REF;
  const owner = OWNER;
  const repo = REPO;

  const docsToc = await fetchTableOfContents("/docs/", ref);

  try {
    /**
     * Get doc content from markdown file.
     */
    const filename: string = slug.join("/") + ".md";
    const text = await fetchFile(`docs/${filename}`, owner, repo, ref);

    const { data, content } = matter(text);
    const source = await renderToString(content, {
      components,
      provider: {
        component: ThemeProvider,
        props: {
          components,
          theme,
        },
      },
      mdxOptions: {
        remarkPlugins: [fixImagePathsPlugin(filename, ref), anchorLinks],
      },
    });

    const editPath = `https://github.com/${owner}/${repo}/edit/${REF}/docs/${filename}`;
    return {
      props: { source, data, editPath, docsToc, version: ref },
      revalidate: 30,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: 30, props: { docsToc } };
  }
};

const DocsPage: NextPage<Props> = ({
  data,
  source,
  editPath,
  docsToc,
  version,
}) => {
  /**
   * Need fallback DUMMY_CONTENT as this errors if source is undefined.
   * https://github.com/hashicorp/next-mdx-remote/issues/73#issuecomment-747085961
   */
  const content = hydrate(source ?? DUMMY_CONTENT, { components });

  return (
    <>
      {data && <SEO title={data.title} />}

      <Global
        styles={css`
          a.anchor.before {
            position: absolute;
            left: -1.5rem;
          }
        `}
      />
      <Header latestVersion={version} />
      <Flex
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          flex: 1,
        }}
      >
        {docsToc && <DocsNavigation docs={docsToc} />}
        <Box sx={{ px: 4, pb: 6 }}>
          {data?.experimental && <ExperimentalWarning />}

          {content}

          <EditOnGithub path={editPath} />
        </Box>
      </Flex>
    </>
  );
};

export default DocsPage;
