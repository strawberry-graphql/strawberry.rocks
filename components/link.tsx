/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Link as ThemeLink } from "@theme-ui/components";
import NextLink from "next/link";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  target?: string;
  hideExternalIcon?: boolean;
  rel?: string;
};

function LinkWrapper({
  href,
  isExternal,
  children,
  ...rest
}: {
  href: string;
  isExternal: boolean;
  children: React.ReactNode;
}) {
  if (isExternal) {
    return (
      <ThemeLink {...rest} href={href}>
        {children}
      </ThemeLink>
    );
  }

  return (
    <NextLink href={href} passHref>
      <ThemeLink {...rest}>{children}</ThemeLink>
    </NextLink>
  );
}

export const Link: React.SFC<LinkProps> = ({
  children,
  href,
  hideExternalIcon = false,
  ...props
}) => {
  const isExternal = href.startsWith("http");

  if (props.target == "_blank") {
    props.rel = "noopener noreferrer";
  }

  return (
    <LinkWrapper isExternal={isExternal} {...props} href={href}>
      <Box as="span" sx={{ mr: isExternal ? 1 : 0 }}>
        {children}
      </Box>

      {isExternal && !hideExternalIcon && (
        <ExternalIcon
          width="1em"
          sx={{ verticalAlign: "middle", fill: "currentColor" }}
        />
      )}
    </LinkWrapper>
  );
};