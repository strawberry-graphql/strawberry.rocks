import * as React from "react";
import { Flex, Box } from "@theme-ui/components";
import { Global, css } from "@emotion/core";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import matter from "gray-matter";

// import SEO from "../components/seo";
import DocsNavigation from "~/components/docs-navigation";
import { GetServerSidePropsContext } from "next";
import { EditOnGithub } from "~/components/edit-on-github";

import docsTree from "../../data/docs-tree.json";

export default function DocsPage({ source, sourcePath }) {
  const content = hydrate(source);

  return (
    <>
      {/* <SEO title={file.childMdx.frontmatter.title} /> */}

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
        <Box sx={{ px: 4, pb: 6 }}>
          <DocsNavigation data={new Map(undefined)} />

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
