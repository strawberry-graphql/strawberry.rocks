import cx from "classnames";
import Refractor from "react-refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";

Refractor.registerLanguage(python);
Refractor.registerLanguage(graphql);
Refractor.registerLanguage(markdown);
Refractor.registerLanguage(json);

export const CodeBlock = ({
  language,
  children,
  className,
}: {
  language: string;
  children: string;
  className?: string;
}) => (
  <Refractor
    language={language || "markdown"}
    value={children}
    className={cx(
      className,
      "font-mono overflow-x-auto border-2 border-red-500 p-6"
    )}
  />
);
