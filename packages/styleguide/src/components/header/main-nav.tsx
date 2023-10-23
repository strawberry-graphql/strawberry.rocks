"use client";

import { ExternalLink } from "../icons/external-link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";

const Link = ({
  href,
  children,
  active = false,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <a
      className={clsx(
        "block py-16 typography-paragraph-2",
        "font-sans font-bold cursor-pointer relative group",
        "text-black transition-colors",
        "dark:text-g-100 md:px-[28px]"
      )}
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {href.startsWith("http") && (
        <ExternalLink className="inline-block h-12 align-top stroke-current" />
      )}

      <span className="absolute rounded-sm bottom-0 left-0 right-0 h-1 md:hidden bg-g-100" />

      <span
        className={clsx(
          "absolute rounded-sm bottom-0 left-0 right-0 md:hidden",
          "bg-gradient-to-r from-magenta to-orange h-2",
          "transition-opacity opacity-0 duration-200",
          { "opacity-100": active }
        )}
      />

      {active && (
        <motion.span
          layoutId="underline"
          className={clsx(
            "hidden md:block absolute rounded-sm bottom-0 left-[28px] right-[28px] h-2",
            "bg-gradient-to-r from-magenta to-orange",
            "bg-g-100 from-magenta to-orange"
          )}
        />
      )}
    </a>
  );
};

export const MainNav = ({
  activeSection,
}: {
  activeSection?: "blog" | "docs" | "github" | "discord" | "playground";
}) => {
  const [active, setActive] = useState(activeSection);

  const links = [
    {
      name: "Docs",
      href: "/docs",
      slug: "docs",
    },
    {
      name: "GitHub",
      href: "https://github.com/strawberry-graphql/strawberry",
      slug: "github",
    },
    {
      name: "Discord",
      href: "https://strawberry.rocks/discord",
      slug: "discord",
    },
    {
      name: "Blog",
      href: "/blog",
      slug: "blog",
    },
    {
      name: "Playground",
      href: "https://play.strawberry.rocks",
      slug: "playground",
    },
  ] as const;

  return (
    <ul className="w-full md:flex md:w-auto relative">
      {links.map((link) => (
        <li key={link.slug}>
          <Link
            href={link.href}
            active={active == link.slug}
            onMouseEnter={() => setActive(link.slug)}
            onMouseLeave={() => setActive(activeSection)}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
