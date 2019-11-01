/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Grid } from "@theme-ui/components";
import { Logo } from "./logo";
import { Link } from "./link";

type NavItemProps = {
  href: string;
};

const NavItem: React.SFC<NavItemProps> = ({ href, children }) => (
  <Box as="li" sx={{ listStyle: "none" }}>
    <Link sx={{ color: "white" }} href={href}>
      {children}
    </Link>
  </Box>
);

export const Footer: React.SFC = () => (
  <Box
    as="footer"
    sx={{
      py: 5,
      px: 3,
      backgroundColor: "black",
      color: "white",
    }}
  >
    <Grid
      columns={[4]}
      sx={{
        mx: "auto",
        maxWidth: 1280,
      }}
    >
      <Logo width="100" />
      <nav>
        <NavItem href="/docs/">Documentation</NavItem>
      </nav>
      <nav></nav>
      <nav>
        <NavItem href="https://twitter.com/patrick91">Twitter</NavItem>
        <NavItem href="https://twitter.com/patrick91">Github</NavItem>
      </nav>
    </Grid>
  </Box>
);
