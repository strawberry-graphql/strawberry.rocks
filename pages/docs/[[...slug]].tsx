import { promises as fs } from "fs";
import path from "path";
import * as React from "react";
import { Flex, Box } from "@theme-ui/components";
import { Global, css } from "@emotion/core";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import matter from "gray-matter";
import globby from "globby";

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
  const source = await fs.readFile(
    path.join(process.env.DOCS_LOCAL_LOCATION, docPath),
    "utf8"
  );
  const { content, data } = matter(source);
  const mdxSource = await renderToString(content, { scope: data });
  return [mdxSource, data];
}

export async function getStaticProps(context) {
  const data = await import("../../data/docs.json");
  const sidebar = new Map(data.sidebar);
  const routeMap = new Map(data.routeMap);

  let docFilePath = null;
  if (context.params.slug) {
    // Get index page
    const route = path.join("/docs", context.params.slug.join("/"));
    if (routeMap.has(route)) {
      const routeInfo = routeMap.get(route);
      docFilePath = routeInfo.filePath;
    }
  } else {
    docFilePath = "index.md";
  }

  const [source, metadata] = await getDoc(docFilePath);

  // TODO handle 404

  return {
    props: {
      source,
      metadata,
      sidebar: [...sidebar],
    },
  };
}

export async function getStaticPaths() {
  // Get all doc files and create a map of url paths to content
  const allDocs = (
    await globby(path.posix.join(process.env.DOCS_LOCAL_LOCATION, "/**/*.md"))
  )
    .map((filePath) =>
      filePath.replace(
        path.posix.join(process.env.DOCS_LOCAL_LOCATION, "/"),
        ""
      )
    )
    .filter((filePath) => filePath !== "index.md");

  allDocs.sort();

  // Put index file at the front
  allDocs.unshift("index.md");

  const sidebar = new Map();
  const routeMap = new Map();

  const paths = [{ params: { slug: null } }];

  for (const filePath of allDocs) {
    // Read file contents
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, metadata] = await getDoc(filePath);

    // Populate sidebar section
    let section;
    if (filePath === "index.md") {
      section = "docs";
    } else {
      section = filePath.split("/")[0].replace(/^[0-9]+_/, "");
    }
    if (!sidebar.has(section)) {
      sidebar.set(section, []);
    }
    sidebar.set(section, sidebar.get(section).concat([metadata]));

    paths.push({
      params: {
        slug: metadata.path.replace("/docs/", "").split("/"),
      },
    });

    // Populate route map
    routeMap.set(metadata.path, {
      filePath,
    });
  }

  await fs.writeFile(
    path.join("data", "docs.json"),
    JSON.stringify({
      sidebar: [...sidebar],
      routeMap: [...routeMap],
    })
  );

  return {
    paths,
    fallback: false,
  };
}
