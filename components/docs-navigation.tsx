/** @jsx jsx */
import { Box, Button } from "@theme-ui/components";
import { Fragment, useCallback, useEffect } from "react";
import { jsx } from "theme-ui";

import { Router } from "next/router";

import docsNav from "../data/docs-nav.json";
import { useToggle } from "../helpers/use-toggle";
import { CloseIcon } from "./icons/close";
import { NavigationIcon } from "./icons/navigation";
import { Link } from "./link";

function Nav() {
  return (
    <>
      {docsNav.sections.map(({ title, pages }) => (
        <Fragment key={title}>
          <h2 sx={{ textTransform: "capitalize" }}>{title}</h2>

          <nav sx={{ mb: 2 }}>
            {pages.map(({ title, slug }) => (
              <li sx={{ listStyle: "none" }} key={slug}>
                <Link href={slug} variant="docs-nav">
                  {title}
                </Link>
              </li>
            ))}
          </nav>
        </Fragment>
      ))}
    </>
  );
}

export default function DocsNavigation() {
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
        <Nav />
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
          <Nav />
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
