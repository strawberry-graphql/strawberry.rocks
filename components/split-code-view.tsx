import { ReactNode } from "react";

import { CodeBlock } from "./code-block";

const Header = ({ children, ...props }: { children: ReactNode }) => (
  <div className="p-2 px-4 text-sm bg-red-500 font-mono text-white" {...props}>
    {children}
  </div>
);

export const SplitCodeView = ({
  leftHeader,
  rightHeader,
  children,
}: {
  leftHeader: string;
  leftLanguage: string;
  leftCode: string;
  rightLanguage: string;
  rightHeader: string;
  rightCode: string;
  children: ReactNode[];
}) => {
  return (
    <div className="md:flex mb-8">
      <div className="flex md:w-1/2 flex-col">
        <Header>{leftHeader}</Header>
        <div className="flex-1 md:border-r-0">{children[0]}</div>
      </div>
      <div className="flex md:w-1/2 flex-col">
        <Header>{rightHeader}</Header>
        <div className="flex-1">{children[1]}</div>
      </div>
    </div>
  );
};
