/** @jsx jsx */
import { ReactElement } from "react";
import { jsx } from "theme-ui";
import { Flex, Box } from "@theme-ui/components";
import Prism from "@theme-ui/prism";

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

function CodeBlock({ language, children, extraStyles = {}, ...props }) {
  return (
    <Prism
      className={`language-${language}`}
      sx={{
        flex: 1,
        borderTop: "none",
        maxHeight: "300px",
        overflowY: "auto",
        ...extraStyles,
      }}
      {...props}
    >
      {children}
    </Prism>
  );
}

export default function GraphQLExample({
  query,
  response,
}: {
  query: string;
  response: string;
}): ReactElement {
  const res = JSON.parse(response);
  return (
    <Flex>
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Query</Header>
        <CodeBlock
          language="graphql"
          extraStyles={{
            borderRight: "none",
          }}
        >
          {query}
        </CodeBlock>
      </Flex>
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Result</Header>
        <CodeBlock language="json">{JSON.stringify(res, null, "  ")}</CodeBlock>
      </Flex>
    </Flex>
  );
}
