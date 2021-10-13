import cx from "classnames";
import { Fragment, useCallback, useEffect } from "react";

import { Router } from "next/router";

import { useToggle } from "~/helpers/use-toggle";

import { CloseIcon } from "./icons/close";
import { NavigationIcon } from "./icons/navigation";
import { Link } from "./link";

export type Section = {
  name: string;
  links: {
    text: string;
    href: string;
  }[];
};

export type SectionLink = {
  href: string;
  text: string;
};

export type DocsTree = {
  [section: string]: Section | SectionLink;
};

function isSection(section: any): section is Section {
  return section.name !== undefined;
}

const ExperimentalBadge = () => (
  <span className="text-black text-xs bg-red-200 inline-block rounded p-1 ml-1">
    experimental
  </span>
);

const getDocsLink = ({ text, href }: { text: string; href: string }) => {
  const regex = /\*\*experimental\*\*/g;
  const isExperimental = text.search(regex) >= 0;

  if (isExperimental) {
    text = text.replace(regex, "").trim();
  }

  if (href === "/docs/index") {
    href = "/docs";
  }

  return (
    <li className="list-none" key={href}>
      <Link href="/docs/[[...slug]]" as={href} className="text-red-500">
        {text}
      </Link>
      {isExperimental && <ExperimentalBadge />}
    </li>
  );
};

function Nav({ docs }: { docs: DocsTree }) {
  return (
    <>
      {Object.values(docs).map((section) => {
        if (isSection(section)) {
          const { name, links } = section;
          return (
            <Fragment key={name}>
              <h2 className="capitalize font-bold text-xl mb-2">{name}</h2>

              <nav className="mb-4">{links.map(getDocsLink)}</nav>
            </Fragment>
          );
        }

        return (
          <a
            href={section.href}
            className="flex justify-between"
            key={section.href}
          >
            <h2 className="capitalize font-bold text-xl mb-2">
              {section.text}
            </h2>
            <span>&gt;</span>
          </a>
        );
      })}
    </>
  );
}

export default function DocsNavigation({ docs }: { docs: DocsTree }) {
  const [open, toggleOpen, setOpen] = useToggle(false);

  const closeMenu = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    Router.events.on("routeChangeStart", closeMenu);

    return () => Router.events.on("routeChangeStart", closeMenu);
  });

  return (
    <Fragment>
      <div className="hidden md:flex md:flex-shrink-0 md:flex-col px-6 py-8">
        <div className="w-48">
          <Nav docs={docs} />
        </div>
      </div>

      <Fragment>
        <div
          className={`fixed ${
            open ? "" : "hidden"
          } md:hidden top-0 left-0 right-0 h-screen overflow-x-scroll bg-white dark:bg-gray-800 z-10 p-8`}
        >
          <Nav docs={docs} />
        </div>

        <button
          className={cx(
            "fixed md:hidden bottom-8 w-16 h-16 focus:outline-none right-8 z-10",
            "fill-current text-red-500 bg-red-200 dark:bg-red-500 dark:text-white p-2 rounded-full cursor-pointer shadow-xl"
          )}
          onClick={toggleOpen}
        >
          {open ? (
            <CloseIcon className="stroke-current" />
          ) : (
            <NavigationIcon className="stroke-current" />
          )}
        </button>
      </Fragment>
    </Fragment>
  );
}
