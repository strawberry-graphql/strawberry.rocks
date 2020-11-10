/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Grid } from "@theme-ui/components";
import { Logo } from "./logo";
import { Link } from "./link";

type NavItemProps = {
  href: string;
  target?: string;
};

const NavItem: React.SFC<NavItemProps> = ({ href, children, ...props }) => (
  <Box as="li" sx={{ listStyle: "none", whiteSpace: "nowrap" }}>
    <Link sx={{ color: "white" }} href={href} {...props}>
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
      backgroundColor: "backgroundDark",
      color: "textDark",
    }}
  >
    <Grid
      sx={{
        mx: "auto",
        maxWidth: 1280,
        gridTemplateColumns: ["1fr 1fr", "140px repeat(3, 1fr)"],
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: ["center", "flex-start"],
          gridRowStart: [2, 1],
          gridColumnStart: [1, 1],
          gridColumnEnd: [3, 2],
          mt: [3, 0],
        }}
      >
        <Logo width="100" />
      </Box>
      <nav>
        <NavItem href="/docs/">Documentation</NavItem>
        <NavItem href="/acknowledgements/">Acknowledgements</NavItem>
      </nav>
      <Box
        as="nav"
        sx={{
          textAlign: "right",
          gridColumnStart: [2, 3],
          gridColumnEnd: [3, 5],
        }}
      >
        <NavItem target="_blank" href="https://twitter.com/patrick91">
          Twitter
        </NavItem>
        <NavItem
          target="_blank"
          href="https://github.com/strawberry-graphql/strawberry"
        >
          Github
        </NavItem>
      </Box>
    </Grid>
  </Box>
);
