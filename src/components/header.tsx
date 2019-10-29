/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "@theme-ui/components";

export const Header: React.SFC = () => (
  <header
    sx={{
      padding: 2,
    }}
  >
    aaaaaaaaa
    <nav>nav....</nav>
    <h1>logo</h1>
    <Link variant="version" href="#!">
      Hello
    </Link>
  </header>
);
