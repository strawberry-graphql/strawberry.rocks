import sponsorsData from '@/data/sponsors.json';
import downloadsData from '@/data/downloads.json';
import { ButtonLink } from './button-link';
import './sponsors.css';

function roundDownToNearest(num: number, nearest: number) {
  return Math.floor(num / nearest) * nearest;
}

const logoOverrides: Record<
  string,
  { darkMode: string; lightMode: string }
> = {
  xoflare: {
    darkMode: '/images/sponsor-overrides/exoflare-white.png',
    lightMode: '/images/sponsor-overrides/exoflare-black.png',
  },
  cinder: {
    darkMode: '/images/sponsor-overrides/cinder-white.png',
    lightMode: '/images/sponsor-overrides/cinder-black.png',
  },
  wedgworth: {
    darkMode: '/images/sponsor-overrides/wedgworth-white.png',
    lightMode: '/images/sponsor-overrides/wedgworth-black.png',
  },
  stellate: {
    darkMode: '/images/sponsor-overrides/stellate-dark.png',
    lightMode: '/images/sponsor-overrides/stellate-light.png',
  },
};

function getImage(
  sponsor: { id: string; logo: string },
  theme: 'dark' | 'light',
) {
  const override = logoOverrides[sponsor.id];

  if (override) {
    return {
      dark: override.darkMode,
      light: override.lightMode,
    }[theme];
  }
  return sponsor.logo;
}

function getDownloadsMessage() {
  const downloadsLastMonth = roundDownToNearest(
    downloadsData.lastMonth,
    100_000,
  );

  if (downloadsLastMonth >= 2_000_000) {
    // If more than 2M per month, show per month
    const millionsPerMonth = Math.floor(downloadsLastMonth / 1_000_000);
    return `More than ${millionsPerMonth} million downloads per month.`;
  }

  // Otherwise show weekly downloads
  const downloadsLastWeek = roundDownToNearest(downloadsData.lastWeek, 5000);

  if (downloadsLastWeek < 100_000) {
    return `More than ${downloadsLastMonth.toLocaleString()} downloads last month.`;
  }

  return `More than ${downloadsLastWeek.toLocaleString()} downloads last week.`;
}

export function Sponsors() {
  const sponsors = sponsorsData.home;
  const message = getDownloadsMessage();

  return (
    <section className="sponsors-section full">
      <header>
        <h1>Discover the sponsors that make Strawberry possible.</h1>
        <h2 className="typography-heading-4">{message}</h2>
      </header>

      <ButtonLink href="https://opencollective.com/strawberry-graphql">
        Become a sponsor
      </ButtonLink>

      <div className="sponsors-list">
        <ul>
          {sponsors.map((sponsor) => (
            <li key={sponsor.id}>
              <a href={sponsor.href || '#'}>
                <img
                  src={getImage(sponsor, 'dark')}
                  alt={sponsor.name}
                  className="dark"
                />
                <img
                  src={getImage(sponsor, 'light')}
                  alt={sponsor.name}
                  className="light"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
