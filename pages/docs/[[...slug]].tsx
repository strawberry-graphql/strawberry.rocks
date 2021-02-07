/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { anchorLinks } from "@hashicorp/remark-plugins";
import { Flex, Box } from "@theme-ui/components";
import matter from "gray-matter";
import { dirname, join } from "path";
import { jsx, ThemeProvider } from "theme-ui";
import { ReturnedPromiseResolvedType } from "types/utility";
import visit from "unist-util-visit";

import { GetServerSideProps, NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { SEO } from "~/components/seo";
import components from "~/components/theme-ui";
import { getDocsToc } from "~/helpers/get-docs-toc";
import { getGithub } from "~/helpers/github";

import theme from "../../theme";

type Props = {
  source: MdxRemote.Source;
  data: { [key: string]: any };
  sourcePath: string;
  docsToc: ReturnedPromiseResolvedType<typeof getDocsToc>;
};

const DocsPage: NextPage<Props> = ({ data, source, sourcePath, docsToc }) => {
  const content = hydrate(source, { components });

  return (
    <>
      <SEO title={data.title} />

      <Global
        styles={css`
          a.anchor.before {
            position: absolute;
            left: -1.5rem;
          }
        `}
      />

      <Flex
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          flex: 1,
        }}
      >
        <DocsNavigation docs={docsToc} />
        <Box sx={{ px: 4, pb: 6 }}>
          {data.experimental && <ExperimentalWarning />}

          {content}

          <EditOnGithub path={sourcePath} />
        </Box>
      </Flex>
    </>
  );
};

const isPR = (slugParts: string[]) => {
  return (
    slugParts.length > 2 &&
    slugParts[0] === "pr" &&
    !isNaN(parseInt(slugParts[1], 10))
  );
};

const getPrInformation = async (id: number) => {
  const github = getGithub();

  const data = await github
    .get(`/repos/strawberry-graphql/strawberry/pulls/${id}`)
    .then((res) => res.body);

  return {
    pr: id,
    branch: data.head.ref,
    repo: data.head.repo.full_name,
    safeToPreview:
      data.state === "open" &&
      data.labels.find((label) => label.name === "ok-to-preview") !== undefined,
  };
};

type DocsSource = {
  pr: null | number;
  branch: string;
  repo: string;
  base: string;
};

const fixImagePathsPlugin = ({
  docsSource,
  path,
}: {
  docsSource: DocsSource;
  path: string;
}) => () => (tree, file) => {
  visit(tree, "image", (node) => {
    const url = node.url as string;

    if (url.startsWith(".")) {
      const updatedPath = join("docs", dirname(path), node.url as string);

      node.url = `https://github.com/${docsSource.repo}/raw/${docsSource.branch}/${updatedPath}`;
    }
  });
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  let slugParts: string[] = (context.params.slug as string[]) || ["index"];

  const docsSource: DocsSource = {
    branch: "master",
    pr: null,
    repo: "strawberry-graphql/strawberry",
    base: `https://raw.githubusercontent.com/strawberry-graphql/strawberry/`,
  };

  if (isPR(slugParts)) {
    const prInfo = await getPrInformation(parseInt(slugParts[1], 10));

    if (prInfo.safeToPreview) {
      docsSource.branch = prInfo.branch;
      docsSource.pr = prInfo.pr;
      docsSource.base = `https://raw.githubusercontent.com/${prInfo.repo}/`;
      docsSource.repo = prInfo.repo;

      slugParts = slugParts.slice(2);
    }
  }

  const filename: string = slugParts.join("/") + ".md";
  const path = `${docsSource.branch}/docs/${filename}`;

  const text: string = await fetch(`${docsSource.base}${path}`).then((r) =>
    r.text()
  );
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
      remarkPlugins: [
        fixImagePathsPlugin({ docsSource, path: filename }),
        anchorLinks,
      ],
    },
  });
  const docsToc = await getDocsToc(docsSource);

  return {
    props: { source, data, sourcePath: path, docsToc },
  };
};

export default DocsPage;
