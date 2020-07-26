/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "./link";

type EditOnGithubProps = { relativePath: string };

export const EditOnGithub: React.SFC<EditOnGithubProps> = ({
  relativePath,
}) => (
  <Link
    href={`https://github.com/strawberry-graphql/strawberry/tree/master/${relativePath}`}
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
