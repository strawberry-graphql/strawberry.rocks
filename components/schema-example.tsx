import { ReactNode } from "react";

import { CodeBlock } from "./code-block";

const Header = ({ children, ...props }: { children: ReactNode }) => (
  <div className="p-2 px-4 text-sm bg-red-500 font-mono text-white" {...props}>
    {children}
  </div>
);

export const SchemaExample = ({
  python,
  schema,
}: {
  python: string;
  schema: string;
}) => {
  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <Header>Query</Header>
        <CodeBlock language="python" className="flex-1 border-r-0">
          {python}
        </CodeBlock>
      </div>
      <div className="flex flex-1 flex-col">
        <Header>Schema</Header>
        <CodeBlock language="graphql" className="flex-1">
          {schema}
        </CodeBlock>
      </div>
    </div>
  );
};
