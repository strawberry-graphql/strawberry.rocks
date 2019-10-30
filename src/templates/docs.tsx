import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Flex, Box } from "@theme-ui/components";
import SEO from "../components/seo";
import { Header } from "../components/header";
import { DocsNavigation } from "../components/docs-navigation";
import { DocsPageQuery } from "./__generated__/DocsPageQuery";

const DocsPage = ({ data: { file } }: { data: DocsPageQuery }) => (
  <>
    <Header />

    <SEO title={file.childMdx.frontmatter.title} />

    <Flex>
      <Box as="aside" p={4} bg="muted" sx={{ flex: "0 0 200px" }}>
        <DocsNavigation />
      </Box>

      <Box p={4}>
        <MDXRenderer>{file.childMdx.body}</MDXRenderer>
      </Box>
    </Flex>
  </>
);

export default DocsPage;

export const pageQuery = graphql`
  query DocsPageQuery($relativePath: String!) {
    file(relativePath: { eq: $relativePath }) {
      childMdx {
        body
        frontmatter {
          title
        }
      }
    }
  }
`;
