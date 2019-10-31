/** @jsx jsx */
import { jsx } from "theme-ui";
import { Heading, Flex, Box } from "@theme-ui/components";
import { useStaticQuery, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { CodeBox } from "./code-box";

export const Hero: React.SFC = () => {
  const { file } = useStaticQuery(graphql`
    query HelloWorldSnippetQuery {
      file(
        sourceInstanceName: { eq: "home" }
        relativePath: { eq: "hello-world.md" }
      ) {
        childMdx {
          body
        }
      }
    }
  `);

  return (
    <Flex
      sx={{
        padding: 2,
        maxWidth: 1240,
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "flex-start",
        justifyContent: "space-between",
        display: ["block", null, "flex"],
      }}
    >
      <Box
        sx={{
          flex: "0 0 400px",
          m: 4,
        }}
      >
        <Heading variant="hero">
          Strawberry is a new GraphQL library for Python 3, inspired by
          dataclasses.
        </Heading>
      </Box>
      <CodeBox
        sx={{
          flex: "1 1 50%",
          fontSize: 1,
        }}
      >
        <MDXRenderer>{file.childMdx.body}</MDXRenderer>
      </CodeBox>
    </Flex>
  );
};
