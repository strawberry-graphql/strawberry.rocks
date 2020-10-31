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

export default function SchemaExample({
  python,
  schema,
}: {
  python: string;
  schema: string;
}): ReactElement {
  return (
    <Flex>
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Definition</Header>
        <CodeBlock
          language="python"
          extraStyles={{
            borderRight: "none",
          }}
        >
          {python}
        </CodeBlock>
      </Flex>
      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Header>Schema</Header>
        <CodeBlock language="graphql">{schema}</CodeBlock>
      </Flex>
    </Flex>
  );
}
