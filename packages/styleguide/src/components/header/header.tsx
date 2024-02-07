"use client";

import { DarkModeToggle } from "../dark-mode/dark-mode";
import { MenuIcon } from "../icons/menu";
import { MenuCloseIcon } from "../icons/menu-close";
import { Logo } from "../logo/logo";
import { Caption } from "../typography/caption";
import { MainNav } from "./main-nav";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

const Version = ({ version }: { version: { name: string; href: string } }) => {
  return (
    <a
      href={version.href}
      className="uppercase bg-g-50 px-16 py-8 rounded-3xl text-g-700 dark:bg-g-900 dark:text-g-400"
    >
      <Caption className="inline-block">{version.name}</Caption>
    </a>
  );
};

const VerticalSeparator = () => {
  return <div className="w-1 h-48 bg-g-100 mx-32 dark:bg-g-900" />;
};

export const Header = ({
  version,
  activeSection,
}: {
  version: {
    name: string;
    href: string;
  };
  activeSection?: "blog" | "docs" | "github" | "discord" | "playground";
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={clsx(
        "mx-auto max-w-[1600px] px-16 md:px-40 py-16 grid grid-cols-2 items-center md:flex",
        {
          "fixed inset-0 z-50 bg-white dark:bg-g-900": isMenuOpen,
        }
      )}
    >
      <div className="flex-1">
        <Link href="/" className="w-[40px] h-48 md:w-[67px] md:h-[80px] block">
          <Logo className="w-full h-full" />
        </Link>
      </div>

      <nav
        className={clsx(
          "mt-40 items-start order-3 flex-col md:flex-row w-full col-span-2 h-[calc(100vh_-_120px)]",
          "md:flex md:items-center md:h-auto md:ml-auto md:mt-0 md:w-auto",
          { hidden: !isMenuOpen, flex: isMenuOpen }
        )}
      >
        <div className="order-2 my-40 md:-order-none md:my-0">
          <Version version={version} />
        </div>

        <div className="hidden md:block">
          <VerticalSeparator />
        </div>

        <MainNav activeSection={activeSection} />

        <div className="hidden md:block">
          <VerticalSeparator />
        </div>

        <div className="mt-auto pb-40 order-3 self-center md:-order-none md:mt-0 md:pb-0">
          <DarkModeToggle />
        </div>
      </nav>

      <label
        htmlFor="toggle-nav"
        className="cursor-pointer place-self-end md:hidden"
        onClick={toggleMenu}
      >
        {!isMenuOpen && (
          <MenuIcon className="text-black menu-icon dark:text-g-100 " />
        )}
        {isMenuOpen && (
          <MenuCloseIcon className="text-g-700 dark:text-g-100 menu-icon" />
        )}
      </label>
    </header>
  );
};
