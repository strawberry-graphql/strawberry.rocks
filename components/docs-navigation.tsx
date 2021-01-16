/** @jsx jsx */
import { Box, Button } from "@theme-ui/components";
import { Fragment, useCallback, useEffect } from "react";
import { jsx } from "theme-ui";

import { Router } from "next/router";

import { useToggle } from "../helpers/use-toggle";
import { CloseIcon } from "./icons/close";
import { NavigationIcon } from "./icons/navigation";
import { Link } from "./link";

type DocsTree = {
  [section: string]: {
    name: string;
    links: {
      text: string;
      href: string;
    }[];
  };
};

const ExperimentalBadge = () => (
  <Box
    sx={{
      fontSize: 0,
      backgroundColor: "muted",
      p: 1,
      borderRadius: "5px",
      display: "inline-block",
      color: "black",
      ml: 1,
    }}
  >
    experimental
  </Box>
);

const getDocsLink = ({ text, href }) => {
  const regex = /\*\*experimental\*\*/g;
  const isExperimental = text.search(regex) >= 0;

  if (isExperimental) {
    text = text.replace(regex, "").trim();
  }

  return (
    <li sx={{ listStyle: "none" }} key={href}>
      <Link href="/docs/[[...slug]]" as={href} variant="docs-nav">
        {text}
      </Link>
      {isExperimental && <ExperimentalBadge />}
    </li>
  );
};

function Nav({ docs }: { docs: DocsTree }) {
  return (
    <>
      {Object.values(docs).map(({ name, links }) => (
        <Fragment key={name}>
          <h2 sx={{ textTransform: "capitalize" }}>{name}</h2>

          <nav sx={{ mb: 2 }}>{links.map(getDocsLink)}</nav>
        </Fragment>
      ))}
    </>
  );
}

export default function DocsNavigation({ docs }: { docs: DocsTree }) {
  const [open, toggleOpen, setOpen] = useToggle(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    Router.events.on("routeChangeStart", closeMenu);

    return () => Router.events.on("routeChangeStart", closeMenu);
  });

  return (
    <Fragment>
      <Box
        sx={{
          px: 3,
          py: 4,
          flex: "0 0 200px",
          display: ["none", "block"],
        }}
      >
        <Nav docs={docs} />
      </Box>

      <Fragment>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "100vh",
            overflowX: "scroll",
            backgroundColor: "background",
            zIndex: 1,
            p: 4,
            display: [open ? "block" : "none", "none"],
          }}
        >
          <Nav docs={docs} />
        </Box>

        <Button
          sx={{
            position: "fixed",
            bottom: 4,
            right: 4,
            zIndex: 2,
            fill: "primary",
            backgroundColor: "muted",
            borderRadius: "100%",
            width: 70,
            height: 70,
            p: "10px",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
            display: ["block", "none"],
          }}
          onClick={toggleOpen}
        >
          {open ? <CloseIcon /> : <NavigationIcon />}
        </Button>
      </Fragment>
    </Fragment>
  );
}
