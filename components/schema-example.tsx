/** @jsx jsx */
import { jsx, Flex, Box, BoxProps } from "theme-ui";

import { CodeBlock } from "./code-block";

const Header = ({ children, ...props }: BoxProps) => (
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

export default function SchemaExample({
  python,
  schema,
}: {
  python: string;
  schema: string;
}): jsx.JSX.Element {
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
