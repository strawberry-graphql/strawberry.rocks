import * as React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Flex, Box } from "@theme-ui/components";
import { Global, css } from "@emotion/core";
import SEO from "../components/seo";
import { DocsNavigation } from "../components/docs-navigation";
import { DocsPageQuery } from "./__generated__/DocsPageQuery";
import { EditOnGithub } from "../components/edit-on-github";
import { Link } from "../components/link";

const ExperimentalWarning = () => (
  <Box
    sx={{
      backgroundColor: "prismBackground",
      borderLeftColor: "primary",
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
      padding: 3,
      my: 3,
    }}
  >
    <Box sx={{ fontWeight: "bold", mb: 2 }}>Caution:</Box>

    <Box as="p" sx={{ mb: 2 }}>
      This documentation refers to an experimental feature of Strawberry, these
      features may change significantly and without a warning before they become
      a part of the main strawberry API.
    </Box>

    <Box as="p">
      This documentation is aimed at early adopters and people who are curious.
      If you&apos;re interested in contributing to this feature{" "}
      <Link href="https://github.com/strawberry-graphql/strawberry/discussions">
        join the discussion on our GitHub page
      </Link>
      .
    </Box>
  </Box>
);

const DocsPage = ({
  data: { file },
}: {
  data: DocsPageQuery;
}): React.ReactElement => (
  <>
    <SEO title={file.childMdx.frontmatter.title} />

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
        {file.childMdx.frontmatter.experimental && <ExperimentalWarning />}
        <MDXProvider components={{}}>
          <MDXRenderer>{file.childMdx.body}</MDXRenderer>
        </MDXProvider>
        <EditOnGithub relativePath={file.relativePath} />
      </Box>
    </Flex>
  </>
);

export default DocsPage;

export const pageQuery = graphql`
  query DocsPageQuery($relativePath: String!) {
    file(relativePath: { eq: $relativePath }) {
      relativePath
      childMdx {
        body
        frontmatter {
          title
          experimental
        }
      }
    }
  }
`;
