"use client";

import { ArrowUpIcon } from "../icons/arrow-up";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Section =
  | {
      name: string;
      links: {
        href: string;
        name: string;
      }[];
    }
  | {
      name: string;
      links?: undefined;
      href: string;
    };

const TopLevelTitle = ({
  children,
  as,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  as?: string;
}) => {
  const Component = as || "summary";

  return (
    // @ts-ignore
    <Component
      {...props}
      className="text-g-900 dark:text-g-50 typography-label list-none relative flex justify-between items-center cursor-pointer"
    >
      {children}
    </Component>
  );
};

export const SidebarNav = ({ sections }: { sections: Section[] }) => {
  const pathname = usePathname();

  return (
    <nav>
      {sections.map((section) => {
        if (!section.links) {
          return (
            <div
              className="mb-16 pb-16 border-b border-g-100 dark:border-g-900 "
              key={section.name}
            >
              <TopLevelTitle href={section.href} as="a">
                {section.name}
                <ArrowUpIcon className="text-g-500 dark:text-g-700 rotate-90" />
              </TopLevelTitle>
            </div>
          );
        }

        const hasActiveLink = section.links.some(
          (link) => link.href == pathname
        );

        if (section.name === "Docs") {
          return (
            <ul
              key={section.name}
              className="mb-16 pb-16 border-b border-g-100 dark:border-g-900 group"
            >
              {section.links.map((link) => (
                <li
                  key={link.href}
                  className={clsx(
                    "mt-16 typography-paragraph-2 font-bold text-g-500 hover:text-strawberry",
                    {
                      "text-strawberry": pathname == link.href,
                    }
                  )}
                >
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <details
            key={section.name}
            className="mb-16 pb-16 border-b border-g-100 dark:border-g-900 group"
            open={true}
          >
            <TopLevelTitle>
              {section.name}

              <ArrowUpIcon className="text-g-500 dark:text-g-700 group-open:rotate-180" />
            </TopLevelTitle>

            <ul>
              {section.links.map((link) => (
                <li
                  key={link.href}
                  className={clsx(
                    "mt-16 typography-paragraph-2 font-bold text-g-500 hover:text-strawberry",
                    {
                      "text-strawberry": pathname == link.href,
                    }
                  )}
                >
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </nav>
  );
};
