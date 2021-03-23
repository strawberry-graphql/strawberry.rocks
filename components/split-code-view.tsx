import { ReactNode } from "react";

import { CodeBlock } from "./code-block";

const Header = ({ children, ...props }: { children: ReactNode }) => (
  <div className="p-2 px-4 text-sm bg-red-500 font-mono text-white" {...props}>
    {children}
  </div>
);

export const SplitCodeView = ({
  leftHeader,
  leftLanguage,
  leftCode,
  rightHeader,
  rightLanguage,
  rightCode,
}: {
  leftHeader: string;
  leftLanguage: string;
  leftCode: string;
  rightLanguage: string;
  rightHeader: string;
  rightCode: string;
}) => {
  return (
    <div className="md:flex">
      <div className="flex md:w-1/2 flex-col">
        <Header>{leftHeader}</Header>
        <CodeBlock language={leftLanguage} className="flex-1 md:border-r-0">
          {leftCode}
        </CodeBlock>
      </div>
      <div className="flex md:w-1/2 flex-col">
        <Header>{rightHeader}</Header>
        <CodeBlock language={rightLanguage} className="flex-1">
          {rightCode}
        </CodeBlock>
      </div>
    </div>
  );
};
