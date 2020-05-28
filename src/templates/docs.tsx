import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Flex, Box } from "@theme-ui/components";
import SEO from "../components/seo";
import { DocsNavigation } from "../components/docs-navigation";
import { DocsPageQuery } from "./__generated__/DocsPageQuery";
import { EditOnGithub } from "../components/edit-on-github";

const DocsPage = ({ data: { file } }: { data: DocsPageQuery }) => (
  <>
    <SEO title={file.childMdx.frontmatter.title} />

    <Flex
      sx={{
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <DocsNavigation />

      <Box sx={{ px: 4, pb: 6 }}>
        <MDXRenderer>{file.childMdx.body}</MDXRenderer>

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
        }
      }
    }
  }
`;
