/** @jsx jsx */
import Prism, { ThemeUIPrismProps } from "@theme-ui/prism";
import { jsx, ThemeUIStyleObject } from "theme-ui";

export const CodeBlock = ({
  language,
  children,
  extraStyles = {},
  ...props
}: Omit<ThemeUIPrismProps, "className"> & {
  language: string;
  extraStyles?: ThemeUIStyleObject;
}): jsx.JSX.Element => (
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
