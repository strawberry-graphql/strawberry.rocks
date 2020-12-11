import { Global, css } from "@emotion/react";
import { Flex, Box } from "@theme-ui/components";
import matter from "gray-matter";
import * as React from "react";

import { GetServerSidePropsContext } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import DocsNavigation from "~/components/docs-navigation";
import { EditOnGithub } from "~/components/edit-on-github";
import { SEO } from "~/components/seo";

import docsTree from "../../data/docs-tree.json";

export default function DocsPage({ data, source, sourcePath }) {
  const content = hydrate(source);

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
        <DocsNavigation />
        <Box sx={{ px: 4, pb: 6 }}>
          {content}

          <EditOnGithub relativePath={sourcePath} />
        </Box>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const slugParts: string[] = (context.params.slug as string[]) || ["index"];
  const path = docsTree[slugParts.join("/")];

  const base =
    "https://raw.githubusercontent.com/strawberry-graphql/strawberry/master/";

  const text = await fetch(base + path).then((r) => r.text());
  const { data, content } = matter(text);

  const source = await renderToString(content);

  return {
    props: { source, data, sourcePath: path },
  };
}
