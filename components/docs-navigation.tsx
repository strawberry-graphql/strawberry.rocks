/** @jsx jsx */
import { jsx } from "theme-ui";
import { Fragment } from "react";
import { Box, Button } from "@theme-ui/components";
import { Link } from "./link";
import { useToggle } from "../helpers/use-toggle";
import { NavigationIcon } from "./icons/navigation";
import { CloseIcon } from "./icons/close";

function Nav({ data }) {
  return (
    <>
      {[...data.entries()].map(([section, nodes]) => (
        <Fragment key={section}>
          <h2 sx={{ textTransform: "capitalize" }}>{section}</h2>

          <nav sx={{ mb: 2 }}>
            {nodes.map(({ title, path }) => (
              <li sx={{ listStyle: "none" }} key={path}>
                <Link href={path} variant="docs-nav">
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

export default function DocsNavigation({ data }) {
  const [open, toggleOpen] = useToggle(false);

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
        <Nav data={data} />
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
          <Nav data={data} />
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
