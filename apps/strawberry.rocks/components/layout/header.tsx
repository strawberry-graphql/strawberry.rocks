'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import releaseData from '@/data/release.json';
import './header.css';

const navigation = [
  { name: 'Docs', href: '/docs', slug: 'docs' },
  { name: 'API Reference', href: '/api-reference', slug: 'api-reference' },
  { name: 'Events', href: '/events', slug: 'events' },
  {
    name: 'GitHub',
    href: 'https://github.com/strawberry-graphql/strawberry',
    slug: 'github',
  },
  { name: 'Discord', href: 'https://strawberry.rocks/discord', slug: 'discord' },
  { name: 'Support', href: '/support', slug: 'support' },
  { name: 'Shop 👕', href: 'https://shop.strawberry.rocks/', slug: 'shop' },
  { name: 'Playground', href: 'https://play.strawberry.rocks', slug: 'playground' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-content">
        <Link href="/" className="logo">
          <Logo />
          <span className="sr-only">Strawberry GraphQL</span>
        </Link>

        <nav className="header-nav">
          <ul>
            {navigation.map((item) => {
              const isActive =
                item.slug === 'docs'
                  ? pathname?.startsWith('/docs')
                  : pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={isActive ? 'active' : ''}
                    {...(item.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={`/release/${releaseData.name}`}
            className="version typography-caption"
          >
            {releaseData.name}
          </Link>

          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      viewBox="0 0 67 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.8357 27.4555C23.7098 27.444 19.6927 26.1023 16.3561 23.6215C13.3495 21.3813 8.2419 17.0224 7.82122 13.0839C7.74506 12.4855 7.79679 11.8774 7.97282 11.3015C8.14885 10.7256 8.445 10.1955 8.84083 9.74792C9.67982 8.77605 10.8468 8.2318 12.3085 8.13704C12.4582 8.13704 12.6127 8.12246 12.7696 8.12246C15.4077 8.12246 18.8278 9.5657 22.0959 11.9905C21.851 8.98986 22.7114 6.80314 24.5463 6.05236H24.5653C24.8722 5.91678 25.1992 5.83466 25.5326 5.8094H25.7037C27.6217 5.8094 29.1167 7.7653 30.2195 10.0468C32.0852 4.85939 35.2392 0.223536 38.5713 4.12651e-06H38.809C39.2932 -0.000737263 39.7726 0.0984301 40.2184 0.291567C44.8792 2.31793 42.9017 11.4949 41.2071 16.0651C39.4139 20.9296 35.8218 24.8784 31.2059 27.0595L30.8969 27.2125L30.5451 27.2611C30.0698 27.3316 29.5612 27.3826 29.0692 27.4142C28.6532 27.4409 28.2421 27.4555 27.8357 27.4555Z"
        fill="#1D1D1B"
      />
      <path
        d="M28.9058 24.9895C24.9241 25.2433 20.9809 24.0658 17.7589 21.6608C13.3097 18.3418 10.4125 14.9548 10.1843 12.8216C10.1468 12.5602 10.1671 12.2937 10.2436 12.0414C10.3201 11.7891 10.4509 11.5576 10.6264 11.3638C11.0375 10.8778 11.6389 10.6348 12.4588 10.5717C15.0732 10.4016 19.1802 12.428 22.7073 15.6109L26.0656 18.648L24.8986 14.2211C24.1238 11.2739 24.3567 8.74698 25.431 8.30477L25.4833 8.28291C25.5441 8.25425 25.6092 8.23619 25.6758 8.22945C26.2676 8.19058 27.7079 9.60466 29.0579 13.5748L30.5006 17.8024L31.6319 13.4752C33.3122 7.04376 36.6515 2.57799 38.7169 2.44436C38.9129 2.43065 39.1092 2.4648 39.2897 2.54398C41.5524 3.51585 40.9534 9.88893 38.9807 15.2172C37.4064 19.4873 34.2531 22.9535 30.2011 24.868C29.7733 24.9166 29.3384 24.9627 28.9058 24.9895Z"
        fill="url(#paint0_linear_906_904)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_906_904"
          x1="23.3157"
          y1="2.80881"
          x2="31.4713"
          y2="25.2916"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#11998E" />
          <stop offset="1" stopColor="#38EF7D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ThemeSwitcher() {
  return (
    <div className="theme-switcher">
      {/* Theme switcher will be added here */}
      <button
        type="button"
        className="theme-toggle"
        aria-label="Toggle theme"
        onClick={() => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sun-icon"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="moon-icon"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  );
}
