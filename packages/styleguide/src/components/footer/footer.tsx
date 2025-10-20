import { DiscordCircleIcon } from "../icons/discord";
import { GithubCircleIcon } from "../icons/github";
import { MastodonCircleIcon } from "../icons/mastodon";
import { TwitterCircleIcon } from "../icons/twitter";
import { Logo } from "../logo/logo";
import { NewsletterForm } from "../newsletter-form/newsletter-form";
import clsx from "clsx";
import Link from "next/link";

const links = [
  {
    href: "/docs",
    label: "Docs",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "https://shop.strawberry.rocks/",
    label: "Shop 👕",
  },
  {
    href: "https://play.strawberry.rocks",
    label: "Playground",
  },
  {
    href: "https://speed.strawberry.rocks",
    label: "Benchmarks",
  },
  {
    href: "/acknowledgements",
    label: "Acknowledgements",
  },
  {
    href: "/code-of-conduct",
    label: "Code of Conduct",
  },
];

const Nav = () => {
  return (
    <nav className="border-t border-g-100 dark:border-g-900 my-32 pt-32 md:m-0 md:text-right md:border-none md:pt-0">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {links.map(({ href, label }) => (
          <li key={`${href}${label}`}>
            <Link
              href={href}
              className="typography-label hover:text-strawberry"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const SocialNav = ({ className }: { className?: string }) => {
  return (
    <nav className={className}>
      <ul className="flex gap-16">
        <li>
          <Link
            href="https://github.com/strawberry-graphql/strawberry"
            rel="me"
            className="text-black dark:text-white hover:!text-strawberry"
          >
            <GithubCircleIcon />
          </Link>
        </li>
        <li>
          <Link
            href="https://twitter.com/strawberry_gql"
            rel="me"
            className="text-black dark:text-white hover:!text-strawberry"
          >
            <TwitterCircleIcon />
          </Link>
        </li>
        <li>
          <Link
            href="https://farbun.social/@strawberry"
            rel="me"
            className="text-black dark:text-white hover:!text-strawberry"
          >
            <MastodonCircleIcon />
          </Link>
        </li>
        <li>
          <Link
            href="/discord"
            rel="me"
            className="text-black dark:text-white hover:!text-strawberry"
          >
            <DiscordCircleIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="border-t py-80 px-16 md:px-40 bg-transparency-light border-g-100 dark:bg-footer-dark dark:border-transparency-light">
      <div className="mx-auto max-w-[1600px]">
        <div className="md:flex md:justify-between md:mb-32">
          <NewsletterForm />

          <Nav />
        </div>

        <div className="border-t border-g-100 dark:border-g-900 pt-32 md:flex items-center">
          <div className="border-t border-g-100 dark:border-g-900 my-32 pt-32 md:border-none md:pt-0 md:m-0 order-1">
            <Logo className="w-[50px] h-[60px] md:w-[66px] md:h-[80px]" />
          </div>

          <SocialNav className="border-t border-g-100 dark:border-g-900 my-32 pt-32 md:border-none md:pt-0 md:m-0 order-2 md:ml-auto" />
        </div>
      </div>
    </footer>
  );
};
