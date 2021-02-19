/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { anchorLinks } from "@hashicorp/remark-plugins";
import { Box } from "@theme-ui/components";
import matter from "gray-matter";
import { jsx, ThemeProvider } from "theme-ui";

import { GetStaticProps, NextPage } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";

import { Header } from "~/components/header";
import { SEO } from "~/components/seo";
import components from "~/components/theme-ui";
import { fetchLatestRelease } from "~/lib/api";

import theme from "../theme";

type Props = {
  source: MdxRemote.Source;
  version: string;
};

const CodeOfConductPage: NextPage<Props> = ({ source, version }) => {
  const content = hydrate(source, { components });

  return (
    <>
      <SEO title="Code of Conduct" />
      <Global
        styles={css`
          a.anchor.before {
            position: absolute;
            left: -1.5rem;
          }
        `}
      />
      <Header latestVersion={version} />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          flex: 1,
          pb: 6,
        }}
      >
        {content}
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const path =
    "https://raw.githubusercontent.com/strawberry-graphql/strawberry/master/CODE_OF_CONDUCT.md";

  const text: string = await fetch(path).then((r) => r.text());
  const { content } = matter(text);

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
      remarkPlugins: [anchorLinks],
    },
  });

  return {
    props: {
      source,
      version: await fetchLatestRelease(),
    },
    revalidate: 30,
  };
};

export default CodeOfConductPage;
