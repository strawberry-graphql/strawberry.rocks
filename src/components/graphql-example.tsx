/** @jsx jsx */
import { ReactElement } from "react";
import { jsx } from "theme-ui";
import { Flex, Box } from "@theme-ui/components";
import Prism from "@theme-ui/prism";
import dedent from "dedent";

function Header({ children, ...props }) {
  return (
    <Box
      sx={{
        backgroundColor: "primary",
        padding: 1,
        color: "#fff",
        paddingLeft: 2,
        fontSize: 12,
        fontFamily: "monospace",
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

function CodeBlock({ language, children, ...props }) {
  return (
    <Prism
      className={`language-${language}`}
      sx={{
        flex: 1,
        borderTop: "none",
        maxHeight: "300px",
        overflowY: "auto",
      }}
      {...props}
    >
      {children}
    </Prism>
  );
}

export default function GraphQLExample({
  query,
  result,
}: {
  query: string;
  result: Record<string, unknown>;
}): ReactElement {
  return (
    <Flex
      sx={{
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Query</Header>
        <CodeBlock
          language="graphql"
          sx={{
            borderRight: "none",
          }}
        >
          {dedent(query)}
        </CodeBlock>
      </Flex>
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Result</Header>
        <CodeBlock language="graphql">
          {JSON.stringify(result, null, "  ")}
        </CodeBlock>
      </Flex>
    </Flex>
  );
}
