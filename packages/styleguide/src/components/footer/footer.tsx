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

const VercelLink = ({ className }: { className?: string }) => {
  return (
    <a
      href="https://vercel.com?utm_source=strawberry-graphql&utm_campaign=oss"
      className={clsx(className, "typography-paragraph-2")}
    >
      Website powered by
      <svg
        className="inline-block h-24 ml-4"
        viewBox="0 0 4438 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z"
          className="fill-black dark:fill-white"
        ></path>
      </svg>
    </a>
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
          <VercelLink className="order-2 md:ml-24 md:border-l border-g-100 dark:border-transparency-light md:py-8 md:pl-24 md:block" />

          <SocialNav className="border-t border-g-100 dark:border-g-900 my-32 pt-32 md:border-none md:pt-0 md:m-0 order-3 md:ml-auto" />

          <div className="border-t border-g-100 dark:border-g-900 my-32 pt-32 md:border-none md:pt-0 md:m-0 order-1">
            <Logo className="w-[50px] h-[60px] md:w-[66px] md:h-[80px]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
