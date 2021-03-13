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

const GraphQLExample = ({
  query,
  response,
}: {
  query: string;
  response: string;
}): jsx.JSX.Element => {
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
};

export default GraphQLExample;
