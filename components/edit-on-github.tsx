/** @jsx jsx */
import { jsx } from "theme-ui";

import { Link } from "./link";

type EditOnGithubProps = { path: string };

export const EditOnGithub = ({ path }: EditOnGithubProps) => (
  <Link
    href={path}
    variant="box"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "accent",
      textAlign: "left",
    }}
  >
    Edit on Github
  </Link>
);
