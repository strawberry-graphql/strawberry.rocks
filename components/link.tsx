/** @jsx jsx */
import { jsx, ThemeUIStyleObject, Box, Link as ThemeLink } from "theme-ui";

import NextLink from "next/link";
import { useRouter } from "next/router";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  as?: string;
  target?: string;
  hideExternalIcon?: boolean;
  partialMatch?: boolean;
  rel?: string;
  sx?: ThemeUIStyleObject;
  children?: React.ReactNode;
};

const LinkWrapper = ({
  href,
  isExternal,
  children,
  as,
  partialMatch = false,
  ...rest
}: {
  href: string;
  as?: string;
  isExternal: boolean;
  partialMatch?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  if (isExternal) {
    return (
      <ThemeLink {...rest} href={href}>
        {children}
      </ThemeLink>
    );
  }

  const match = (a: string, b: string) => {
    if (partialMatch && b) {
      return a.startsWith(b);
    }

    return a == b;
  };

  const isActive: boolean =
    (as != null && match(router.asPath, as)) || match(router.asPath, href);

  let className = rest.className ?? "";

  if (isActive) {
    className = `${className} active`;
  }

  return (
    <NextLink prefetch={false} href={href} as={as} passHref>
      <ThemeLink {...rest} className={className}>
        {children}
      </ThemeLink>
    </NextLink>
  );
};

export const Link = ({
  children,
  href,
  hideExternalIcon = false,
  ...props
}: LinkProps) => {
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
