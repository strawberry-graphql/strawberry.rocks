/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Link as ThemeLink } from "@theme-ui/components";
import { Link as GatsbyLink } from "gatsby";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  target?: string;
  partiallyActive?: boolean;
  hideExternalIcon?: boolean;
};

export const Link: React.SFC<LinkProps> = ({
  children,
  href,
  partiallyActive,
  hideExternalIcon = false,
  ...props
}) => {
  const isExternal = href.startsWith("http");
  const LinkComponent = isExternal
    ? ThemeLink
    : (props: { to: string }) => (
        <GatsbyLink
          activeClassName="active"
          partiallyActive={partiallyActive}
          {...props}
        />
      );

  if (props.target == "_blank") {
    (props as any).rel = "noopener noreferrer";
  }

  return (
    <ThemeLink {...props} as={LinkComponent} href={href} to={href}>
      <Box as="span" sx={{ mr: isExternal ? 1 : 0 }}>
        {children}
      </Box>

      {isExternal && !hideExternalIcon && (
        <ExternalIcon
          width="1em"
          sx={{ verticalAlign: "middle", fill: "currentColor" }}
        />
      )}
    </ThemeLink>
  );
};
