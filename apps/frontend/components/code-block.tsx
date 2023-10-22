import cx from "classnames";
import Refractor from "react-refractor";
import graphql from "refractor/lang/graphql";
import json from "refractor/lang/json";
import markdown from "refractor/lang/markdown";
import python from "refractor/lang/python";
import toml from "refractor/lang/toml";

// TODO: this might not be used at all
Refractor.registerLanguage(python);
Refractor.registerLanguage(graphql);
Refractor.registerLanguage(markdown);
Refractor.registerLanguage(json);
Refractor.registerLanguage(toml);

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
      "font-mono overflow-x-auto border-2 border-red-500 p-6",
      "bg-white dark:text-white dark:bg-gray-800",
      className
    )}
  />
);
