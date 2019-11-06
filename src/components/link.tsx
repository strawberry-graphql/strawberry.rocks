/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Link as ThemeLink } from "@theme-ui/components";
import { Link as GatsbyLink } from "gatsby";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  target?: string;
};

export const Link: React.SFC<LinkProps> = ({ children, href, ...props }) => {
  const isExternal = href.startsWith("http");
  const LinkComponent = isExternal
    ? ThemeLink
    : ({ ...props }: { to: string }) => (
        <GatsbyLink activeClassName="active" {...props} />
      );

  if (props.target == "_blank") {
    (props as any).rel = "noopener noreferrer";
  }

  return (
    <ThemeLink {...props} as={LinkComponent} href={href} to={href}>
      <Box as="span" sx={{ display: "inline-block", mr: isExternal ? 1 : 0 }}>
        {children}
      </Box>

      {isExternal && (
        <ExternalIcon
          width="1em"
          sx={{ verticalAlign: "middle", fill: "currentColor" }}
        />
      )}
    </ThemeLink>
  );
};
