/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link as ThemeLink } from "@theme-ui/components";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  target?: string;
};

export const Link: React.SFC<LinkProps> = ({ children, href, ...props }) => (
  <ThemeLink href={href} {...props}>
    {children}

    {href.startsWith("http") && (
      <ExternalIcon
        width="1em"
        sx={{ ml: 2, verticalAlign: "middle", fill: "currentColor" }}
      />
    )}
  </ThemeLink>
);
