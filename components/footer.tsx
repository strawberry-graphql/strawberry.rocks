import { Link } from "./link";
import { Logo } from "./logo";

type NavItemProps = {
  href: string;
  target?: string;
  children: React.ReactNode;
};

const NavItem = ({ href, children, ...props }: NavItemProps) => (
  <li className="list-none whitespace-nowrap">
    <Link href={href} {...props} className="underline">
      {children}
    </Link>
  </li>
);

export const Footer = () => (
  <footer className="bg-black text-white py-12  dark:bg-gray-800">
    <div className="grid mx-auto w-full max-w-7xl px-8 grid-cols-2 md:flex">
      <div className="flex justify-center md:justify-start row-start-2 md:row-start-1 col-start-1 col-end-3 md:col-end-2 mt-6 md:mt-0">
        <Logo width="100" />
      </div>
      <nav className="md:ml-10">
        <NavItem href="/docs/">Documentation</NavItem>
        <NavItem href="/acknowledgements/">Acknowledgements</NavItem>
        <NavItem href="/code-of-conduct/">Code of Conduct</NavItem>
      </nav>
      <nav className="text-right col-start-2 col-end-3 md:ml-auto">
        <NavItem target="_blank" href="https://twitter.com/patrick91">
          Twitter
        </NavItem>
        <NavItem
          target="_blank"
          href="https://github.com/strawberry-graphql/strawberry"
        >
          Github
        </NavItem>
      </nav>
    </div>
  </footer>
);
