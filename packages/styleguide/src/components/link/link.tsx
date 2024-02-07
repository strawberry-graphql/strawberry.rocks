import clsx from "clsx";
import NextLink from "next/link";

export const Link = ({
  children,
  className,
  href,
  rel,
  target,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  rel?: string;
  target?: string;
}) => {
  return (
    <NextLink
      href={href}
      rel={rel}
      target={target}
      className={clsx(
        // maybe use decoration-clone
        "font-bold text-strawberry group hover:text-white transition-all bg-gradient-to-r from-magenta to-orange",
        "bg-[size:100%_2px] bg-[position:0_100%] hover:bg-[size:100%_100%] bg-no-repeat pb-4",
        className
      )}
    >
      {children}
    </NextLink>
  );
};
