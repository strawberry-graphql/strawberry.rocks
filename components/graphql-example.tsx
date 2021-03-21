import { ReactNode } from "react";

import { CodeBlock } from "./code-block";

const Header = ({ children, ...props }: { children: ReactNode }) => (
  <div className="p-2 px-4 text-sm bg-red-500 font-mono text-white" {...props}>
    {children}
  </div>
);

export const GraphQLExample = ({
  query,
  response,
}: {
  query: string;
  response: string;
}) => {
  const res = JSON.parse(response);
  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <Header>Query</Header>
        <CodeBlock language="graphql" className="flex-1 border-r-0">
          {query}
        </CodeBlock>
      </div>
      <div className="flex flex-1 flex-col">
        <Header>Result</Header>
        <CodeBlock language="json" className="flex-1">
          {JSON.stringify(res, null, "  ")}
        </CodeBlock>
      </div>
    </div>
  );
};
