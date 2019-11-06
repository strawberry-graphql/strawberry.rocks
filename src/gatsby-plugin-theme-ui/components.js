/** @jsx jsx */
import { jsx } from "theme-ui";

import Prism from "@theme-ui/prism";
import { Link } from "../components/link";

// TODO: update branch to be master
const getImageSrc = src => {
  if (src.startsWith("./")) {
    return src.replace(
      "./",
      "https://github.com/strawberry-graphql/strawberry/raw/feature/docs/docs/"
    );
  }

  return src;
};

export default {
  pre: props => props.children,
  code: Prism,
  a: Link,
  // eslint-disable-next-line react/display-name
  img: ({ src, ...props }) => <img src={getImageSrc(src)} {...props} />,
};
