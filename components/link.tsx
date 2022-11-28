import cx from "classnames";

import NextLink from "next/link";

import { ExternalIcon } from "./icons/external";

export type LinkProps = {
  href: string;
  className?: string;
  as?: string;
  target?: string;
  hideExternalIcon?: boolean;
  partialMatch?: boolean;
  underline?: boolean;
  activeClass?: string;
  rel?: string;
  children?: React.ReactNode;
};

const LinkWrapper = ({
  href,
  isExternal,
  children,
  as,
  partialMatch = false,
  underline = false,
  className,
  activeClass = "underline",
  ...rest
}: LinkProps & { isExternal: boolean }) => {
  const match = (a: string, b: string) => {
    // TODO: a is undefined

    if (!a) {
      return false;
    }

    if (partialMatch && b) {
      return a.startsWith(b);
    }

    return a == b;
  };

  // TODO: fix this
  const isActive: boolean = false;

  className = cx(className, {
    underline: underline,
    [activeClass]: isActive,
    "whitespace-nowrap": !underline,
  });

  if (isExternal) {
    return (
      <a {...rest} href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <NextLink
      prefetch={false}
      href={href}
      as={as}
      className={className}
      {...rest}
    >
      {children}
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
      <span className={isExternal ? "mr-2" : ""}>{children}</span>

      {isExternal && !hideExternalIcon && (
        <ExternalIcon
          width="1em"
          className="inline align-middle fill-current"
        />
      )}
    </LinkWrapper>
  );
};
