/* eslint-disable @next/next/no-img-element */
import { Button } from "../button/button";
import { Heading } from "../typography/heading";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

type Sponsor = {
  id?: string;
  name: string;
  href: string;
  logo: string;
};

const Sponsor = ({
  name,
  href,
  logo,
  logoOverride,
}: Sponsor & {
  logoOverride?: {
    darkMode: string;
    lightMode: string;
  };
}) => {
  return (
    <li className="snap-center break-inside-avoid mb-24 lg:w-auto flex-shrink-0 self-stretch flex items-stretch">
      <Link href={href}>
        {logoOverride ? (
          <>
            <img
              src={logoOverride.darkMode}
              alt={name}
              className="max-w-[250px] max-h-[120px] hidden dark:block"
            />
            <img
              src={logoOverride.lightMode}
              alt={name}
              className="max-w-[250px] max-h-[120px] block dark:hidden"
            />
          </>
        ) : (
          <img src={logo} alt={name} className="max-w-[250px] max-h-[120px]" />
        )}
      </Link>
    </li>
  );
};

export const SponsorsSection = ({
  sponsors,
  logoOverrides,
  downloads,
}: {
  downloads: { lastMonth: number; lastWeek: number };
  sponsors: Sponsor[];
  logoOverrides?: {
    [key: string]: {
      darkMode: string;
      lightMode: string;
    };
  };
}) => {
  function roundDownToNearest(num: number, nearest: number) {
    return Math.floor(num / nearest) * nearest;
  }

  const downloadsLastWeek = roundDownToNearest(downloads.lastWeek, 5000);

  return (
    <section className="text-center max-w-screen-lg mx-auto">
      <div className="px-16 md:px-24">
        <Heading>
          <Balancer>
            Discover the sponsors that make Strawberry possible.
          </Balancer>
        </Heading>

        <Heading level={4} className="mt-24 mb-48 text-g-700 dark:text-g-500">
          <Balancer>
            More than {downloadsLastWeek.toLocaleString()} downloads last week
          </Balancer>
        </Heading>

        <Button as="a" href="/sponsor-us">
          Become a sponsor
        </Button>
      </div>

      <ul className="mt-80 text-left overflow-auto flex justify-center snap-x px-24 max-w-screen-xl mx-auto gap-72">
        {sponsors.map((sponsor) => (
          <Sponsor
            key={sponsor.name}
            {...sponsor}
            logoOverride={logoOverrides?.[sponsor.id ?? sponsor.name]}
          />
        ))}
      </ul>
    </section>
  );
};
