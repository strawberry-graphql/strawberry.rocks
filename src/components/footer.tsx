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
      px: 4,
      backgroundColor: "black",
      color: "white",
    }}
  >
    <Grid
      sx={{
        mx: "auto",
        maxWidth: 1280,
        gridTemplateColumns: ["repeat(4, 1fr)", "140px repeat(3, 1fr)"],
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: ["center", "flex-start"],
          gridColumnStart: [1, 1],
          gridColumnEnd: [5, 2],
          mb: 3,
        }}
      >
        <Logo width="100" />
      </Box>
      <nav>
        <NavItem href="/docs/">Documentation</NavItem>
      </nav>
      <Box
        as="nav"
        sx={{
          textAlign: "right",
          gridColumnStart: [2, 3],
          gridColumnEnd: [5, 5],
        }}
      >
        <NavItem href="https://twitter.com/patrick91">Twitter</NavItem>
        <NavItem href="https://twitter.com/patrick91">Github</NavItem>
      </Box>
    </Grid>
  </Box>
);
