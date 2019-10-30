import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import SEO from "../components/seo";
import { Header } from "../components/header";

const DocsPage = ({ data: { file } }: any) => (
  <>
    <Header />
    <SEO title={file.childMdx.frontmatter.title} />

    <MDXRenderer>{file.childMdx.body}</MDXRenderer>
  </>
);

export default DocsPage;

export const pageQuery = graphql`
  query($relativePath: String!) {
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
