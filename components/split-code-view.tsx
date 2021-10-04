import cx from "classnames";
import React, { ReactElement, ReactNode } from "react";

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
  children: ReactElement[];
}) => {
  return (
    <div className="md:flex">
      <div className="flex md:w-1/2 flex-col">
        <Header>{leftHeader}</Header>

        {React.cloneElement(children[0], {
          className: cx("flex-1 md:border-r-0", children[0].props.className),
        })}
      </div>
      <div className="flex md:w-1/2 flex-col">
        <Header>{rightHeader}</Header>
        {React.cloneElement(children[1], {
          className: cx("flex-1", children[1].props.className),
        })}
      </div>
    </div>
  );
};
