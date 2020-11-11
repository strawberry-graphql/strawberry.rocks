import { promises as fs } from "fs";
import path from "path";
import * as React from "react";
import { Flex, Box } from "@theme-ui/components";
import { Global, css } from "@emotion/core";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import matter from "gray-matter";

// import SEO from "../components/seo";
import DocsNavigation from "~/components/docs-navigation";
// import { DocsPageQuery } from "./__generated__/DocsPageQuery";
// import { EditOnGithub } from "../components/edit-on-github";

export default function DocsPage({ source, sidebar }) {
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
        <DocsNavigation data={new Map(sidebar)} />

        <Box sx={{ px: 4, pb: 6 }}>
          {content}
          {/* <MDXProvider components={{}}> */}
          {/*   <MDXRenderer>{file.childMdx.body}</MDXRenderer> */}
          {/* </MDXProvider> */}

          {/* <EditOnGithub relativePath={file.relativePath} /> */}
        </Box>
      </Flex>
    </>
  );
}

async function getDoc(docPath) {
  const source = await fs.readFile(docPath, "utf8");
  const { content, data } = matter(source);
  const mdxSource = await renderToString(content, { scope: data });
  return [mdxSource, data];
}

export async function getStaticProps(context) {
  const data = await import("../../data/docs.json");
  const sidebar = new Map(data.sidebar);
  const routeMap = new Map(data.routeMap);

  let route = null;
  if (context.params.slug) {
    // Get index page
    route = path.join("/docs", context.params.slug.join("/"));
  } else {
    route = "/docs";
  }

  if (!routeMap.has(route)) {
    // TODO handle 404
  }

  const { filePath } = routeMap.get(route);
  const [source, metadata] = await getDoc(filePath);

  return {
    props: {
      source,
      metadata,
      sidebar: [...sidebar],
    },
  };
}

export async function getStaticPaths() {
  const data = await import("../../data/docs.json");
  const routeMap = new Map(data.routeMap);

  const paths = [{ params: { slug: null } }];

  for (const [path] of routeMap) {
    paths.push({
      params: {
        slug: path.replace("/docs/", "").split("/"),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
}
