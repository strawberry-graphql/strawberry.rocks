/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "./link";

type EditOnGithubProps = { relativePath: string };

export const EditOnGithub: React.SFC<EditOnGithubProps> = ({
  relativePath,
}) => (
  <Link
    href={`https://github.com/strawberry-graphql/strawberry/tree/master/${relativePath}`}
    sx={{
      p: 2,
      my: 4,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "accent",
      textAlign: "left",
      textDecoration: "none",
      border: "2px solid",
      borderColor: "accent",
      width: "100%",
      "&:hover": {
        backgroundColor: "prismBackground",
      },
    }}
  >
    Edit on Github
  </Link>
);
