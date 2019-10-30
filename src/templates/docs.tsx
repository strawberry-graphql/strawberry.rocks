import * as React from "react";
import { graphql } from "gatsby";
import SEO from "../components/seo";
import { Header } from "../components/header";

const HomePage = ({ data: { file } }: any) => (
  <>
    <Header />
    <SEO title={file.childMarkdownRemark.frontmatter.title} />

    <div dangerouslySetInnerHTML={{ __html: file.childMarkdownRemark.html }} />
  </>
);

export default HomePage;

export const pageQuery = graphql`
  query($relativePath: String!) {
    file(relativePath: { eq: $relativePath }) {
      childMarkdownRemark {
        html
        frontmatter {
          title
        }
      }
    }
  }
`;
