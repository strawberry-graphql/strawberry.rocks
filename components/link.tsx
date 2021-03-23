import cx from "classnames";

import NextLink from "next/link";
import { useRouter } from "next/router";

import { ExternalIcon } from "./icons/external";

export type LinkProps = {
  href: string;
  variant?: string;
  className?: string;
  as?: string;
  target?: string;
  hideExternalIcon?: boolean;
  partialMatch?: boolean;
  underline?: boolean;
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
  ...rest
}: {
  href: string;
  as?: string;
  isExternal: boolean;
  partialMatch?: boolean;
  underline?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  const match = (a: string, b: string) => {
    if (partialMatch && b) {
      return a.startsWith(b);
    }

    return a == b;
  };

  const isActive: boolean =
    (as != null && match(router?.asPath, as)) || match(router?.asPath, href);

  className = cx(className, {
    underline: underline || isActive,
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
    <NextLink prefetch={false} href={href} as={as} passHref>
      <a {...rest} className={className}>
        {children}
      </a>
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
