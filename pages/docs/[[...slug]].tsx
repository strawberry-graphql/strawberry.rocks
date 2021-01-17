/** @jsx jsx */
import { Global, css } from "@emotion/react";
import { anchorLinks } from "@hashicorp/remark-plugins";
import { Flex, Box } from "@theme-ui/components";
import matter from "gray-matter";
import { jsx } from "theme-ui";
import { ThemeProvider } from "theme-ui";

import { GetServerSidePropsContext } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { ExperimentalWarning } from "~/components/experimental-warning";
import { SEO } from "~/components/seo";
import components from "~/components/theme-ui";
import { getDocsToc } from "~/helpers/get-docs-toc";

import theme from "../../theme";

export default function DocsPage({ data, source, sourcePath, docsToc }) {
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

          <EditOnGithub relativePath={sourcePath} />
        </Box>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const slugParts: string[] = (context.params.slug as string[]) || ["index"];
  const path = slugParts.join("/");

  // const base =
  //   "https://raw.githubusercontent.com/strawberry-graphql/strawberry/master/docs/";
  // TODO: update with master when updated
  const base =
    "https://raw.githubusercontent.com/strawberry-graphql/strawberry/feature/docs-toc/docs/";

  const text = await fetch(`${base}${path}.md`).then((r) => r.text());
  const { data, content } = matter(text);

  const source = await renderToString(content, {
    components,
    provider: {
      component: ThemeProvider,
      components,
      theme,
    },
    mdxOptions: {
      remarkPlugins: [anchorLinks],
    },
  });
  const docsToc = await getDocsToc();

  return {
    props: { source, data, sourcePath: path, docsToc },
  };
}
